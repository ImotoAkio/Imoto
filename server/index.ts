import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'imoto-dev-token'; // Fallback admin token if no user in DB
const JWT_SECRET = process.env.JWT_SECRET || 'imoto-super-secret-jwt-key';
const IS_PROD = process.env.NODE_ENV === 'production';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'cesarimoto441@gmail.com';

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const getEmailFrom = () => {
  const name = process.env.SMTP_FROM_NAME || 'Arquivo Imoto';
  const email = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'naoresponda@imoto.com';
  return `"${name}" <${email}>`;
};

// Test transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erro na configuração do E-mail (SMTP):', error.message);
  } else {
    console.log('✅ Servidor de e-mail pronto para enviar notificações');
  }
});

// Ensure public/uploads exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Security: Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});

const collaborateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 collaborations per hour
  message: { error: 'Muitas requisições desta origem, tente novamente mais tarde.' }
});

// Security: CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(globalLimiter);
app.use(express.json());
// Serve static files from public directory
app.use('/public', express.static(path.join(process.cwd(), 'public')));

// In production, serve the built frontend
if (IS_PROD) {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
}

// Security: Authentication Middleware
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Não autorizado. Token ausente.' });
  }

  const token = authHeader.split(' ')[1];

  // Fallback para o ADMIN_TOKEN estático se configurado (para retrocompatibilidade/debug)
  if (token === ADMIN_TOKEN) {
    (req as any).user = { role: 'ADMIN' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if ((req as any).user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado. Requer privilégios de administrador.' });
  }
  next();
};

// --- AUTH API ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const approvalToken = crypto.randomBytes(32).toString('hex');
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        status: 'PENDING',
        approvalToken
      }
    });

    const approveUrl = `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/auth/approve/${approvalToken}`;
    console.log(`📧 E-mail para admin: Novo cadastro solicitado por ${name} (${email}). Aprovação pendente.`);
    
    // Enviar e-mail real para o admin
    try {
      await transporter.sendMail({
        from: getEmailFrom(),
        to: ADMIN_EMAIL,
        subject: `🔔 Novo Cadastro Solicitado: ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #1a237e;">Novo Cadastro Pendente</h2>
            <p>Um novo usuário solicitou acesso ao <strong>Arquivo Imoto</strong>:</p>
            <ul>
              <li><strong>Nome:</strong> ${name}</li>
              <li><strong>E-mail:</strong> ${email}</li>
            </ul>
            <p>Para aprovar ou rejeitar este cadastro, acesse o painel administrativo ou use o botão de aprovação rápida abaixo:</p>
            <div style="margin: 20px 0;">
              <a href="${approveUrl}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #2e7d32; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">
                 ✅ Aprovar Cadastro Agora
              </a>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/users" 
                 style="display: inline-block; padding: 12px 24px; background-color: #1a237e; color: white; text-decoration: none; border-radius: 5px;">
                 Painel Geral
              </a>
            </div>
            <p style="font-size: 11px; color: #999;">O botão de aprovação rápida é seguro e expira após o uso.</p>
          </div>
        `
      });
    } catch (mailError) {
      console.error('❌ Falha ao enviar e-mail de notificação para admin:', mailError);
    }
    
    res.json({ message: 'Cadastro realizado com sucesso! Aguarde a aprovação do administrador.' });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    if (user.status === 'PENDING') {
      return res.status(403).json({ error: 'Sua conta ainda está aguardando aprovação.' });
    }
    if (user.status === 'REJECTED') {
      return res.status(403).json({ error: 'Sua conta foi rejeitada.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({ message: 'Se o e-mail existir, um link será enviado.' }); // Segurança: não revelar se email existe
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora

    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt
      }
    });

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    console.log(`📧 Email para ${email}: Link de recuperação de senha: ${resetUrl}`);
    
    // Enviar e-mail real para o usuário
    try {
      await transporter.sendMail({
        from: getEmailFrom(),
        to: email,
        subject: 'Recuperação de Senha - Arquivo Imoto',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #1a237e;">Recuperação de Senha</h2>
            <p>Você solicitou a recuperação de senha para sua conta no <strong>Arquivo Imoto</strong>.</p>
            <p>Clique no botão abaixo para definir uma nova senha. Este link expira em 1 hora.</p>
            <a href="${resetUrl}" 
               style="display: inline-block; padding: 10px 20px; background-color: #1a237e; color: white; text-decoration: none; border-radius: 5px;">
               Redefinir Minha Senha
            </a>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              Se você não solicitou isso, pode ignorar este e-mail com segurança.
            </p>
          </div>
        `
      });
    } catch (mailError) {
      console.error('❌ Falha ao enviar e-mail de recuperação:', mailError);
    }
    
    res.json({ message: 'Se o e-mail existir, um link será enviado.' });
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Token inválido ou expirado.' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash }
    });

    await prisma.passwordReset.delete({ where: { id: resetRecord.id } });

    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/auth/approve/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { approvalToken: token }
    });

    if (!user) {
      return res.status(404).send(`
        <div style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #d32f2f;">Token Inválido</h1>
          <p>Este link de aprovação já foi usado ou não existe.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">Voltar para o Início</a>
        </div>
      `);
    }

    // Aprovar usuário e limpar token
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        status: 'APPROVED',
        approvalToken: null 
      }
    });

    // Enviar e-mail de boas vindas para o usuário
    try {
      await transporter.sendMail({
        from: getEmailFrom(),
        to: user.email,
        subject: '🎉 Seu cadastro no Arquivo Imoto foi aprovado!',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #1a237e;">Bem-vindo(a), ${user.name}!</h2>
            <p>Seu acesso ao <strong>Arquivo Imoto</strong> foi liberado.</p>
            <p>Agora você pode explorar a história da família e contribuir com novas memórias.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
               style="display: inline-block; padding: 10px 20px; background-color: #1a237e; color: white; text-decoration: none; border-radius: 5px;">
               Acessar o Acervo
            </a>
          </div>
        `
      });
    } catch (mailErr) {
      console.error('Erro ao enviar boas vindas:', mailErr);
    }

    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #2e7d32;">Usuário Aprovado!</h1>
        <p>O cadastro de <strong>${user.name}</strong> foi ativado com sucesso.</p>
        <p>Um e-mail de boas-vindas foi enviado para ele(a).</p>
        <br>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color: #1a237e;">Ir para o Site</a>
      </div>
    `);
  } catch (error) {
    res.status(500).send('Erro interno ao processar aprovação.');
  }
});

// --- ADMIN USERS API ---
app.get('/api/admin/users', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true }
    });
    res.json(users);
  } catch (error) {
    handleError(res, error);
  }
});

app.patch('/api/admin/users/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body; // 'APPROVED' or 'REJECTED'
    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status }
    });

    console.log(`📧 E-mail para ${user.email}: Seu cadastro foi ${status === 'APPROVED' ? 'aprovado' : 'rejeitado'}.`);
    
    // Enviar e-mail real de status para o usuário
    try {
      await transporter.sendMail({
        from: getEmailFrom(),
        to: user.email,
        subject: `Status do seu cadastro: ${status === 'APPROVED' ? 'Aprovado! 🎉' : 'Rejeitado'}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #1a237e;">Olá ${user.name},</h2>
            <p>Seu cadastro no <strong>Arquivo Imoto</strong> foi <strong>${status === 'APPROVED' ? 'APROVADO' : 'REJEITADO'}</strong> pelo administrador.</p>
            ${status === 'APPROVED' ? `
              <p>Agora você já pode acessar todo o acervo e contribuir com a história da família.</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
                 style="display: inline-block; padding: 10px 20px; background-color: #1a237e; color: white; text-decoration: none; border-radius: 5px;">
                 Acessar Agora
              </a>
            ` : `
              <p>Infelizmente não pudemos aprovar seu acesso neste momento. Se você acredita que isso foi um erro, entre em contato conosco.</p>
            `}
          </div>
        `
      });
    } catch (mailError) {
      console.error('❌ Falha ao enviar e-mail de status para o usuário:', mailError);
    }
    
    res.json(user);
  } catch (error) {
    handleError(res, error);
  }
});

// Multer configuration (Secure)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB Limit
  },
  fileFilter: (req, file, cb) => {
    // Apenas imagens
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos.'));
    }
  }
});

// Helpers to format errors
const handleError = (res: express.Response, error: any) => {
  console.error("❌ SERVER ERROR:", error?.message || error);
  if (error?.stack) console.error(error.stack);
  
  // Ocultar detalhes em produção
  res.status(500).json({ 
    error: 'Internal server error', 
    details: IS_PROD ? 'Erro interno do servidor' : (error?.message || 'Unknown error') 
  });
};

// --- Upload API ---
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    const fileUrl = `/public/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    handleError(res, error);
  }
});

// --- Members API ---
app.get('/api/members', async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      include: { parents: true, children: true, spouse: true, spouseOf: true }
    });
    res.json(members);
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/members/:id', async (req, res) => {
  try {
    const member = await prisma.member.findUnique({
      where: { id: req.params.id },
      include: { parents: true, children: true, spouse: true, spouseOf: true }
    });
    if (!member) return res.status(404).json({ error: 'Membro não encontrado' });
    res.json(member);
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/members', requireAuth, async (req, res) => {
  try {
    const { id, children, parents, spouse, spouseOf, citations, ...dataToCreate } = req.body;
    const newMember = await prisma.member.create({
      data: dataToCreate,
    });
    res.json(newMember);
  } catch (error) {
    handleError(res, error);
  }
});

app.put('/api/members/:id', requireAuth, async (req, res) => {
  try {
    const { id, children, parents, spouse, spouseOf, citations, ...dataToUpdate } = req.body;
    const updatedMember = await prisma.member.update({
      where: { id: req.params.id },
      data: dataToUpdate,
    });
    res.json(updatedMember);
  } catch (error) {
    handleError(res, error);
  }
});

app.patch('/api/members/:id/connect', requireAuth, async (req, res) => {
  try {
     const { relationType, targetId } = req.body;
     if (relationType === 'parent') {
        const updated = await prisma.member.update({
           where: { id: req.params.id }, // child
           data: { parents: { connect: { id: targetId } } }
        });
        res.json(updated);
     } else if (relationType === 'spouse') {
        await prisma.member.updateMany({
           where: { spouseId: targetId },
           data: { spouseId: null }
        });
        
        const updated = await prisma.member.update({
           where: { id: req.params.id }, // spouse 1
           data: { spouseId: targetId }
        });
        res.json(updated);
     } else {
        res.status(400).json({ error: 'Tipo Invalido' });
     }
  } catch (error) {
     handleError(res, error);
  }
});

app.patch('/api/members/:id/disconnect', requireAuth, async (req, res) => {
  try {
     const { relationType, targetId } = req.body;
     if (relationType === 'parent') {
        const updated = await prisma.member.update({
           where: { id: req.params.id }, // child
           data: { parents: { disconnect: { id: targetId } } }
        });
        res.json(updated);
     } else if (relationType === 'spouse') {
        const updated = await prisma.member.update({
           where: { id: req.params.id }, // spouse 1
           data: { spouseId: null }
        });
        res.json(updated);
     } else {
        res.status(400).json({ error: 'Tipo Invalido' });
     }
  } catch (error) {
     handleError(res, error);
  }
});

app.delete('/api/members/:id', requireAuth, async (req, res) => {
  try {
    await prisma.member.delete({
      where: { id: req.params.id },
    });
    res.json({ success: true });
  } catch (error) {
    handleError(res, error);
  }
});

// --- Artifacts API ---
app.get('/api/artifacts', async (req, res) => {
  try {
    const artifacts = await prisma.artifact.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        citations: {
          include: { member: true }
        }
      }
    });
    res.json(artifacts);
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/artifacts', requireAuth, async (req, res) => {
  try {
    const { citations, ...data } = req.body;
    const artifact = await prisma.artifact.create({
      data: {
        ...data,
        citations: citations ? {
          create: citations.map((c: any) => ({ 
            memberId: typeof c === 'string' ? c : c.memberId,
            x: c.x || null,
            y: c.y || null,
            width: c.width || null,
            height: c.height || null
          }))
        } : undefined
      },
      include: {
        citations: {
          include: { member: true }
        }
      }
    });
    res.json(artifact);
  } catch (error) {
    handleError(res, error);
  }
});

app.put('/api/artifacts/:id', requireAuth, async (req, res) => {
  try {
    const { citations, id, ...data } = req.body;
    
    // Sincronizar Citações: Primeiro removemos as existentes e depois criamos as novas
    // Em produção, o ideal seria usar connect/disconnect para evitar IDs flutuantes
    if (citations) {
      await prisma.artifactCitation.deleteMany({
        where: { artifactId: req.params.id }
      });
    }

    const artifact = await prisma.artifact.update({
      where: { id: req.params.id },
      data: {
        ...data,
        citations: citations ? {
          create: citations.map((c: any) => ({
            memberId: typeof c === 'string' ? c : c.memberId,
            x: c.x || null,
            y: c.y || null,
            width: c.width || null,
            height: c.height || null
          }))
        } : undefined
      },
      include: {
        citations: {
          include: { member: true }
        }
      }
    });
    res.json(artifact);
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/artifacts/:id', requireAuth, async (req, res) => {
  try {
    await prisma.artifact.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    handleError(res, error);
  }
});

// --- Stories API ---
app.get('/api/stories', async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { publishDate: 'desc' },
    });
    res.json(stories);
  } catch (error) {
    handleError(res, error);
  }
});

// --- Timeline API ---
app.get('/api/events', async (req, res) => {
  try {
    const events = await prisma.timelineEvent.findMany({
      orderBy: { year: 'asc' },
    });
    res.json(events);
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/events', requireAuth, async (req, res) => {
  try {
    const { year, ...rest } = req.body;
    const event = await prisma.timelineEvent.create({
      data: {
        ...rest,
        year: parseInt(year)
      }
    });
    res.json(event);
  } catch (error) {
    handleError(res, error);
  }
});

app.put('/api/events/:id', requireAuth, async (req, res) => {
  try {
    const { year, ...rest } = req.body;
    const event = await prisma.timelineEvent.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        year: year ? parseInt(year) : undefined
      }
    });
    res.json(event);
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/events/:id', requireAuth, async (req, res) => {
  try {
    await prisma.timelineEvent.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    handleError(res, error);
  }
});

// --- Collaboration API ---
app.post('/api/collaborate', collaborateLimiter, async (req, res) => {
  try {
    const { name, email, type, message } = req.body;
    const contribution = await prisma.contribution.create({
      data: {
        name,
        email,
        type,
        message
      }
    });

    console.log(`📧 Nova colaboração recebida de ${name} (${email})`);
    
    // NOTA: Para envio real de e-mail, configuraríamos o nodemailer aqui.
    // Por enquanto, salvamos no banco e logamos no servidor.
    
    res.json({ success: true, id: contribution.id });
  } catch (error) {
    handleError(res, error);
  }
});

// --- Proxy API for Google Drive Images ---
app.get('/api/proxy-image', async (req, res) => {
  const { id, sz } = req.query;
  if (!id) return res.status(400).json({ error: 'ID do arquivo é necessário' });

  const size = sz || 'w1000';
  const driveUrl = `https://drive.google.com/thumbnail?id=${id}&sz=${size}`;

  try {
    const response = await fetch(driveUrl);
    if (!response.ok) {
      throw new Error(`Google Drive respondeu com o status: ${response.status}`);
    }

    // Set content type from original response or default to image/jpeg
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache por 1 dia

    // Use standard Web Stream to pipe to express response
    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    } else {
      res.status(500).send('Corpo da resposta vazio');
    }
  } catch (error: any) {
    console.error('❌ PROXY ERROR:', error.message);
    res.status(500).send('Erro ao processar imagem via proxy');
  }
});

// Catch-all route to serve React app in production
if (IS_PROD) {
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) return;
    
    const indexPath = path.join(process.cwd(), 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Frontend not built');
    }
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`📡 Backend SQLite Memory server rodando na porta ${PORT}`);
});
