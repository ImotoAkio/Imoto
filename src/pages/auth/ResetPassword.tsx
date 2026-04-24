import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../lib/api';
import { KeyRound, AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({ token, newPassword });
      setSuccess(response.message);
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Falha ao redefinir senha. O link pode ter expirado.');
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
                    Nova Senha
                  </h2>
                  <p className="mt-4 text-gray-400 font-light leading-relaxed">
                    Escolha uma senha segura para proteger seu acesso ao acervo.
                  </p>
                </div>
                
                <form className="space-y-5" onSubmit={handleSubmit}>
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
                      Nova Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-imoto-400">
                        <KeyRound size={18} className="text-gray-600" />
                      </div>
                      <input
                        type="password"
                        required
                        className="bg-black/40 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-imoto-500/30 focus:border-imoto-500 block w-full pl-12 p-4 transition-all outline-none placeholder:text-gray-700 shadow-inner"
                        placeholder="Mínimo 6 caracteres"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="group/input">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-imoto-400">
                        <KeyRound size={18} className="text-gray-600" />
                      </div>
                      <input
                        type="password"
                        required
                        className="bg-black/40 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-imoto-500/30 focus:border-imoto-500 block w-full pl-12 p-4 transition-all outline-none placeholder:text-gray-700 shadow-inner"
                        placeholder="Repita a nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex items-center justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-imoto-600 hover:bg-imoto-500 focus:outline-none ring-offset-2 ring-offset-black transition-all disabled:opacity-50 shadow-lg shadow-imoto-900/40 active:scale-[0.98]"
                    >
                      {loading ? (
                        <Loader2 className="animate-spin h-5 w-5" />
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          <span>Atualizar Senha</span>
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
                <h3 className="text-2xl font-bold text-white mb-4">Senha Atualizada!</h3>
                <p className="text-gray-400 leading-relaxed mb-8">
                  Sua nova senha foi salva com sucesso. Redirecionando para o login...
                </p>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3 }}
                    className="h-full bg-imoto-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
