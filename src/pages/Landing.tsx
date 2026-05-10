import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, History, Shield, Globe } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden archival-grid washi-texture">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/assets/images/hero-legacy.png" 
            alt="Imoto Legacy" 
            className="w-full h-full object-cover grayscale"
          />
        </motion.div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="hanko-seal mx-auto mb-12 scale-150 border-imoto-600">
              <span className="text-imoto-600">井</span>
              <span className="text-imoto-600">本</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-noto-serif font-bold text-on-surface mb-8 tracking-tighter leading-tight">
              O Legado <br/> <span className="text-primary italic font-normal">Transcendental</span>
            </h1>
            
            <p className="text-xl md:text-3xl font-noto-serif italic text-secondary mb-12 max-w-3xl mx-auto leading-relaxed opacity-80">
              "Uma história escrita entre o sol nascente e as terras vermelhas do Brasil. Preservada para a eternidade."
            </p>
            
            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              <Link to="/dashboard" className="group relative bg-primary text-on-primary px-12 py-6 rounded-full font-bold uppercase tracking-[0.3em] text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl">
                <span className="relative z-10 flex items-center gap-3">
                  Acessar o Arquivo <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-primary-container scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </Link>
              
              <Link to="/stories" className="text-on-surface-variant font-black uppercase tracking-[0.4em] text-[10px] hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary pb-2">
                Descobrir as Histórias
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-outline opacity-40">Explorar</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-outline/40 to-transparent"></div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-6 border-t border-outline-variant/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8"
          >
            <div className="w-16 h-16 bg-surface-container-high rounded-3xl flex items-center justify-center text-primary shadow-xl">
              <History size={32} />
            </div>
            <h3 className="text-3xl font-noto-serif font-bold text-on-surface">Raízes Profundas</h3>
            <p className="text-secondary font-noto-serif italic text-lg leading-relaxed opacity-70">
              De Yamaguchi em 1890 ao interior de São Paulo. Cada documento, cada carta, mapeando a resiliência de nossos antepassados.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <div className="w-16 h-16 bg-surface-container-high rounded-3xl flex items-center justify-center text-primary shadow-xl">
              <Shield size={32} />
            </div>
            <h3 className="text-3xl font-noto-serif font-bold text-on-surface">Preservação Atemporal</h3>
            <p className="text-secondary font-noto-serif italic text-lg leading-relaxed opacity-70">
              Digitalização em alta fidelidade e curadoria histórica para garantir que nenhuma memória seja perdida para o tempo.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-8"
          >
            <div className="w-16 h-16 bg-surface-container-high rounded-3xl flex items-center justify-center text-primary shadow-xl">
              <Globe size={32} />
            </div>
            <h3 className="text-3xl font-noto-serif font-bold text-on-surface">Legado Global</h3>
            <p className="text-secondary font-noto-serif italic text-lg leading-relaxed opacity-70">
              Conectando gerações espalhadas pelo mundo através de uma única fonte de verdade histórica familiar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Floating Japanese Characters (Aesthetic) */}
      <div className="fixed top-20 right-10 pointer-events-none opacity-[0.03] select-none text-9xl font-noto-serif vertical-text">
        家族の歴史
      </div>
      <div className="fixed bottom-20 left-10 pointer-events-none opacity-[0.03] select-none text-9xl font-noto-serif vertical-text">
        不滅の絆
      </div>
    </div>
  );
};

export default Landing;
