import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../lib/api';
import { Mail, AlertCircle, CheckCircle2, ArrowLeft, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      setSuccess(response.message);
    } catch (err: any) {
      setError(err.message || 'Falha ao solicitar recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0a0a0a]">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale-[0.3] blur-sm scale-110"
        style={{ backgroundImage: 'url(/auth-bg.png)' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-black via-imoto-950/20 to-black opacity-90" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-white/[0.03] backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
          <Link to="/login" className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-white transition-colors mb-8 group">
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            VOLTAR PARA LOGIN
          </Link>

          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-noto-serif font-bold text-white tracking-tight">
                    Recuperar Senha
                  </h2>
                  <p className="mt-4 text-gray-400 font-light leading-relaxed">
                    Digite seu e-mail para receber um link de redefinição de acesso.
                  </p>
                </div>
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm"
                    >
                      <AlertCircle size={18} className="shrink-0" />
                      <p>{error}</p>
                    </motion.div>
                  )}

                  <div className="group/input">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                      E-mail cadastrado
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-imoto-400">
                        <Mail size={18} className="text-gray-600" />
                      </div>
                      <input
                        type="email"
                        required
                        className="bg-black/40 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-imoto-500/30 focus:border-imoto-500 block w-full pl-12 p-4 transition-all outline-none placeholder:text-gray-700 shadow-inner"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex items-center justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-imoto-600 hover:bg-imoto-500 focus:outline-none ring-offset-2 ring-offset-black transition-all disabled:opacity-50 shadow-lg shadow-imoto-900/40 active:scale-[0.98]"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <>
                          <Send size={16} className="mr-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                          <span>Enviar Instruções</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Verifique seu E-mail</h3>
                <p className="text-gray-400 leading-relaxed mb-8">
                  Enviamos as instruções de recuperação para <strong>{email}</strong>. 
                  Não esqueça de verificar também sua pasta de spam.
                </p>
                <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl font-bold transition-all">
                  Voltar para o Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
