import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { login as apiLogin } from '../../lib/api';
import { KeyRound, Mail, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiLogin({ email, password });
      login(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Falha ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0a0a0a]">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 grayscale-[0.3]"
        style={{ backgroundImage: 'url(/auth-bg.png)' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-transparent to-black opacity-80" />
      
      {/* Decorative Hanko Seal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-12 left-12 hidden lg:block"
      >
        <div className="hanko-seal">
          <span>井</span>
          <span>本</span>
        </div>
        <div className="mt-4 text-white/30 font-noto-serif italic tracking-widest text-sm vertical-text">
          家族の記憶
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-md w-full"
      >
        <div className="bg-white/[0.03] backdrop-blur-xl p-10 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden group">
          {/* Top Decorative bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-imoto-500/50 to-transparent" />
          
          <div className="text-center mb-10">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-noto-serif font-bold text-white tracking-tight"
            >
              Bem-vindo
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 text-gray-400 font-light"
            >
              Acesse o acervo privado da família
            </motion.p>
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

            <div className="space-y-5">
              <div className="group/input">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                  E-mail institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-imoto-400">
                    <Mail size={20} className="text-gray-600" />
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
              
              <div className="group/input">
                <div className="flex items-center justify-between mb-2 px-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    Chave de Acesso
                  </label>
                  <Link to="/forgot-password" size="sm" className="text-[11px] text-imoto-400 hover:text-imoto-300 transition-colors uppercase font-bold tracking-tighter">
                    Esqueceu?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within/input:text-imoto-400">
                    <KeyRound size={20} className="text-gray-600" />
                  </div>
                  <input
                    type="password"
                    required
                    className="bg-black/40 border border-white/10 text-white rounded-2xl focus:ring-2 focus:ring-imoto-500/30 focus:border-imoto-500 block w-full pl-12 p-4 transition-all outline-none placeholder:text-gray-700 shadow-inner"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
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
                    <span>Entrar no Arquivo</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <p className="text-sm text-gray-500 font-light">
              Ainda não faz parte do nosso acervo?
            </p>
            <Link 
              to="/register" 
              className="w-full py-3 px-4 border border-imoto-500/30 text-imoto-400 rounded-2xl text-sm font-bold hover:bg-imoto-500/10 hover:border-imoto-500 transition-all text-center tracking-wide"
            >
              SOLICITAR ACESSO AGORA
            </Link>
          </div>
        </div>

        {/* Footer text */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium">
            Imoto Family Legacy &copy; {new Date().getFullYear()}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
