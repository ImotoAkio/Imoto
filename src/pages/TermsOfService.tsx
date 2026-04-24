import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Book, AlertTriangle, CheckCircle } from 'lucide-react';

const TermsOfService: React.FC = () => {
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
            <Scale className="text-primary" size={32} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-noto-serif font-bold mb-6 text-on-background">Termos de Uso</h1>
          <p className="text-on-surface-variant font-noto-serif italic text-lg mb-12 opacity-70">
            Ao acessar este portal, você concorda com os termos abaixo.
          </p>

          <div className="space-y-12 text-on-surface-variant leading-relaxed font-noto-serif text-lg">
            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-4 flex items-center gap-3">
                <Book className="text-primary" size={20} /> 1. Propósito do Portal
              </h2>
              <p>
                O Arquivo Imoto é uma plataforma de uso estritamente familiar e educacional. O conteúdo aqui disponibilizado, incluindo fotos, documentos e relatos, pertence à memória coletiva das famílias Imoto e Yajima.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-4 flex items-center gap-3">
                <CheckCircle className="text-primary" size={20} /> 2. Responsabilidade do Usuário
              </h2>
              <p>
                Ao utilizar este sistema, você se compromete a:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Manter o sigilo de suas credenciais de acesso;</li>
                <li>Não compartilhar informações privadas de outros membros sem autorização;</li>
                <li>Utilizar o conteúdo apenas para fins de preservação e estudo familiar;</li>
                <li>Não utilizar o material para fins comerciais ou difamatórios.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-4 flex items-center gap-3">
                <AlertTriangle className="text-primary" size={20} /> 3. Propriedade Intelectual
              </h2>
              <p>
                Os direitos sobre as imagens e documentos históricos pertencem aos seus respectivos detentores originais ou à Associação Familiar Imoto. A reprodução externa de qualquer material requer consulta prévia aos administradores.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-4">4. Moderação de Conteúdo</h2>
              <p>
                A administração reserva-se o direito de moderar, editar ou remover conteúdos que não estejam em conformidade com o propósito do memorial ou que violem a privacidade de terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-4">5. Alterações nos Termos</h2>
              <p>
                Estes termos podem ser atualizados periodicamente para refletir mudanças na plataforma ou requisitos legais. Recomendamos a revisão ocasional desta página.
              </p>
            </section>

            <section className="pt-8 border-t border-outline/10">
              <p className="text-sm italic opacity-60">
                O uso continuado deste portal após alterações nos termos constitui aceitação das novas condições.
              </p>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsOfService;
