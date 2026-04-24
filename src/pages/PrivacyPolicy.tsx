import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 md:p-12 max-w-4xl mx-auto pb-32"
    >
      <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-2xl border border-outline/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
        
        <div className="relative z-10">
          <div className="bg-primary/10 w-16 h-16 rounded-3xl flex items-center justify-center mb-8 border border-primary/20">
            <ShieldCheck className="text-primary" size={32} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-noto-serif font-bold mb-6 text-on-background">Política de Privacidade</h1>
          <p className="text-on-surface-variant font-noto-serif italic text-lg mb-12 opacity-70">
            Última atualização: 24 de Abril de 2026
          </p>

          <div className="space-y-12 text-on-surface-variant leading-relaxed font-noto-serif text-lg">
            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-4 flex items-center gap-3">
                <Lock className="text-primary" size={20} /> 1. Compromisso com a Memória
              </h2>
              <p>
                O Arquivo Digital Imoto é um espaço de preservação histórica familiar. Nossa prioridade é proteger a dignidade e a privacidade de todos os membros da família, vivos ou falecidos. Os dados aqui contidos são de natureza sensível e histórica.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-4 flex items-center gap-3">
                <Eye className="text-primary" size={20} /> 2. Coleta de Dados
              </h2>
              <p>
                Coletamos informações básicas de cadastro (nome, e-mail) para controle de acesso ao acervo restrito. Além disso, o sistema armazena informações genealógicas e documentos históricos fornecidos voluntariamente pelos administradores e colaboradores autorizados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-4 flex items-center gap-3">
                <FileText className="text-primary" size={20} /> 3. Uso das Informações
              </h2>
              <p>
                As informações são utilizadas exclusivamente para:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Construção e visualização da árvore genealógica familiar;</li>
                <li>Preservação de relatos históricos e biografias;</li>
                <li>Gestão de permissões de acesso ao sistema;</li>
                <li>Comunicações administrativas relacionadas ao portal.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-4">4. Segurança</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração. O acesso ao acervo completo é restrito a membros autenticados e aprovados pela administração.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-4">5. Seus Direitos</h2>
              <p>
                Qualquer membro da família tem o direito de solicitar a correção ou a remoção de informações pessoais ou de parentes diretos que considerem inadequadas ou excessivas, respeitando o interesse histórico comum.
              </p>
            </section>

            <section className="pt-8 border-t border-outline/10">
              <p className="text-sm italic opacity-60">
                Para dúvidas ou solicitações sobre seus dados, entre em contato com a administração do memorial.
              </p>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
