import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Heart, Mail, User, MessageSquare, CheckCircle2, Loader2, Info } from 'lucide-react';

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: string;
}

const CollaborationModal: React.FC<CollaborationModalProps> = ({ isOpen, onClose, initialType = 'HISTORIA' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: initialType,
    message: ''
  });

  // Reset form when initialType changes (when modal is opened with different context)
  React.useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, type: initialType }));
    }
  }, [isOpen, initialType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/collaborate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSuccess(true);
        // Reset form after success
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({ name: '', email: '', type: 'HISTORIA', message: '' });
          onClose();
        }, 3000);
      } else {
        throw new Error('Falha ao enviar');
      }
    } catch (error) {
      alert('Erro ao enviar colaboração. Por favor, tente novamente mais tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-on-background/60 backdrop-blur-sm z-[2000]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-background shadow-2xl z-[2010] washi-texture overflow-hidden"
          >
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container-low">
              <div className="flex items-center gap-3">
                 <div className="hanko-seal scale-75">協</div>
                 <div>
                    <h2 className="font-noto-serif text-2xl font-bold">Colaborar com o Arquivo</h2>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary">A sua memória é o nosso legado</p>
                 </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-surface-container rounded-full transition-colors text-secondary"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-noto-serif">Obrigado pela Contribuição!</h3>
                  <p className="text-secondary max-w-sm font-body">Sua mensagem foi recebida e entrará em nosso processo de revisão histórica. Entraremos em contato em breve.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <label className="block">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block flex items-center gap-2">
                        <User size={12} /> Seu Nome
                      </span>
                      <input 
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-surface-container-low border-b border-primary/20 px-3 py-2 outline-none focus:border-primary transition-colors font-noto-serif text-sm"
                        placeholder="Nome completo"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block flex items-center gap-2">
                        <Mail size={12} /> Seu E-mail
                      </span>
                      <input 
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-surface-container-low border-b border-primary/20 px-3 py-2 outline-none focus:border-primary transition-colors font-body text-sm"
                        placeholder="contato@exemplo.com"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block flex items-center gap-2">
                      <Info size={12} /> Tipo de Colaboração
                    </span>
                    <select 
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-b border-primary/20 px-3 py-2 outline-none focus:border-primary transition-colors font-body text-sm"
                    >
                      <option value="HISTORIA">Compartilhar uma História</option>
                      <option value="FOTO">Enviar Fotos ou Documentos</option>
                      <option value="CORRECAO">Sugerir uma Correção</option>
                      <option value="OUTRO">Outro Assunto</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-secondary mb-2 block flex items-center gap-2">
                      <MessageSquare size={12} /> Sua Mensagem
                    </span>
                    <textarea 
                      required
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-surface-container-low border-b border-primary/20 px-3 py-3 outline-none focus:border-primary transition-colors font-body text-sm resize-none"
                      placeholder="Conte-nos os detalhes..."
                    />
                  </label>

                  <div className="pt-4 flex flex-col items-center gap-4">
                     <button 
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-primary text-on-primary py-4 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-primary-container transition-all shadow-xl disabled:opacity-50"
                     >
                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                        Enviar para o Memorial
                     </button>
                     <p className="text-[8px] uppercase tracking-widest text-secondary/60 flex items-center gap-2">
                        <Heart size={10} className="text-primary/50" /> Mantendo viva a essência da família Imoto
                     </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CollaborationModal;
