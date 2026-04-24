import 'dotenv/config';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Função manual para ler o .env caso o process.env esteja em cache
function getEnv(key: string) {
  try {
    const envPath = path.join(process.cwd(), '.env');
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match ? match[1].trim() : process.env[key];
  } catch {
    return process.env[key];
  }
}

const transporter = nodemailer.createTransport({
  host: getEnv('SMTP_HOST'),
  port: parseInt(getEnv('SMTP_PORT') || '587'),
  secure: getEnv('SMTP_SECURE') === 'true' || getEnv('SMTP_PORT') === '465',
  auth: {
    user: getEnv('SMTP_USER'),
    pass: getEnv('SMTP_PASS')
  }
});

async function sendTest() {
  const fromEmail = getEnv('SMTP_FROM_EMAIL') || getEnv('SMTP_USER');
  const fromName = getEnv('SMTP_FROM_NAME') || 'Arquivo Imoto';
  const target = getEnv('ADMIN_EMAIL') || getEnv('SMTP_USER') || 'cesarimoto441@gmail.com';
  
  console.log('--- DEBUG INFO ---');
  console.log('Host:', getEnv('SMTP_HOST'));
  console.log('User:', getEnv('SMTP_USER'));
  console.log('From:', `"${fromName}" <${fromEmail}>`);
  console.log('Target:', target);
  console.log('------------------');

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: target,
      subject: '🧪 Teste de Conexão V2 - Arquivo Imoto',
      html: `<h2>Teste OK!</h2><p>Enviado em: ${new Date().toLocaleString('pt-BR')}</p>`
    });
    
    console.log('✅ E-mail enviado com sucesso!');
    console.log('ID:', info.messageId);
  } catch (error: any) {
    console.error('❌ Erro detalhado:', error.message);
    if (error.response) console.error('Resposta do Servidor:', error.response);
  }
}

sendTest();
