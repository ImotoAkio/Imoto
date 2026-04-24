import React from 'react';
import { Share2, FileText, History, Clock, ArrowRight, Camera, GraduationCap, MapPin, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-6 md:px-12 pb-12"
    >
      {/* Hero Section */}
      <section className="mt-8 mb-16 relative overflow-hidden bg-surface-container-low min-h-[500px] flex items-center rounded-[40px] shadow-2xl border border-white/5">
        <div className="absolute inset-0 z-0">
          <img
            alt="Family portrait"
            className="w-full h-full object-cover grayscale opacity-30 mix-blend-multiply transition-transform duration-[10s] hover:scale-110"
            src="https://images.weserv.nl/?url=https://lh3.googleusercontent.com/pw/AP1GczOifr894TsgXN8RuC6j0AomsR_JjfoZOp4-9X69NQdyXSlGa58YCCTQeT_ehXIlNDxsp8xUmTZVvorhclEmdwYHLFvp_iozBqDH9wPb0-P3IOUG_jLURczHoXZ4PiLCgO-U1FgfjCxUIo69jmw-dJaaEg=w1104-h729-s-no-gm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-2xl pl-8 md:pl-20 py-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/30"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary-fixed text-[10px] tracking-[0.2em] uppercase font-black">Arquivo Histórico Vivo</span>
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-noto-serif text-on-background leading-[1.1] mb-8 font-bold">
            O Legado da <span className="text-primary italic">Família Imoto</span>
          </h1>
          <p className="text-xl md:text-2xl text-secondary max-w-xl font-noto-serif italic leading-relaxed mb-10 opacity-80">
            Desde as raízes em Yamaguchi até a consolidação no Brasil. Uma jornada de resiliência, inovação e tradição preservada para as gerações futuras.
          </p>
          <div className="flex flex-wrap gap-6">
            <Link to="/gallery" className="bg-primary text-on-primary px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary-container hover:shadow-2xl hover:-translate-y-1 transition-all inline-block text-center shadow-xl">
              Explorar Acervo
            </Link>
            <Link to="/stories" className="flex items-center gap-3 text-on-surface font-noto-serif px-6 py-5 hover:bg-surface-container-high rounded-2xl transition-all group">
              <History className="text-primary group-hover:rotate-12 transition-transform" size={20} />
              <span className="font-bold">Nossas Histórias</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
        {/* Genealogy Bento */}
        <Link to="/tree" className="md:col-span-8 bg-white rounded-[40px] p-12 relative overflow-hidden group cursor-pointer border border-outline/5 shadow-xl hover:shadow-2xl transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
          <div className="flex justify-between items-start mb-16 relative z-10">
            <div>
              <h3 className="font-noto-serif text-4xl mb-3 font-bold">Árvore Genealógica</h3>
              <p className="text-on-surface-variant/60 text-lg max-w-md font-noto-serif italic">Mapeando nossas raízes através das gerações, de 1890 até os dias atuais.</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-3xl group-hover:rotate-12 transition-transform">
              <Share2 className="text-primary w-10 h-10" />
            </div>
          </div>
          <div className="flex flex-wrap gap-12 items-end relative z-10">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-surface-container-high rounded-2xl border border-outline/10 flex items-center justify-center font-noto-serif text-xl shadow-inner">M.I.</div>
                <div className="h-[2px] w-12 bg-primary/20"></div>
                <div className="w-16 h-16 bg-surface-container-high rounded-2xl border border-outline/10 flex items-center justify-center font-noto-serif text-xl shadow-inner">K.I.</div>
              </div>
              <div className="flex items-center gap-5 translate-x-12">
                <div className="w-20 h-20 bg-primary rounded-3xl border-4 border-white flex items-center justify-center font-noto-serif font-bold text-white text-2xl shadow-2xl transform hover:scale-110 transition-transform">C.I.</div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary ml-2">Linhagem Principal</p>
              </div>
            </div>
            <div className="ml-auto text-right">
              <span className="text-6xl font-noto-serif block text-primary font-bold leading-none mb-2">38</span>
              <span className="text-[10px] uppercase tracking-[0.3em] font-black text-on-surface-variant/40">Membros Catalogados</span>
            </div>
          </div>
        </Link>

        {/* Documents Bento */}
        <div className="md:col-span-4 bg-inverse-surface rounded-[40px] p-10 flex flex-col justify-between border-b-8 border-primary shadow-xl group hover:-translate-y-2 transition-transform">
          <div className="hanko-seal scale-125 origin-left mb-10 border-white/20">
            <span>書</span>
            <span>類</span>
          </div>
          <div>
            <h3 className="font-noto-serif text-3xl mb-4 text-white font-bold">Acervo Digital</h3>
            <p className="text-base text-inverse-on-surface/60 leading-relaxed mb-8 font-noto-serif italic">Registros de imigração, passaportes e escrituras originais digitalizados para preservação perpétua.</p>
            <Link className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary-fixed border-b-2 border-primary/30 pb-2 hover:text-white hover:border-white transition-all" to="/documents">
              Ver Documentos <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Timeline Bento */}
        <Link to="/timeline" className="md:col-span-4 bg-[#1b1c1a] rounded-[40px] text-inverse-on-surface p-10 relative overflow-hidden group cursor-pointer block shadow-xl">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="bg-primary/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-primary/30">
                <History className="text-primary" size={24} />
              </div>
              <h3 className="font-noto-serif text-3xl mb-3 font-bold text-white">Cronologia</h3>
              <p className="text-stone-500 text-sm font-noto-serif italic">Os marcos fundamentais da jornada Imoto entre Yamaguchi, Lins e o Nordeste.</p>
            </div>
            <div className="mt-12 group-hover:translate-x-2 transition-transform">
              <div className="text-primary font-noto-serif text-3xl mb-1 italic font-bold">1912</div>
              <div className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-black">Início da Trajetória no Brasil</div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-1000">
            <Clock className="w-48 h-48" />
          </div>
        </Link>

        {/* Gallery Bento */}
        <Link to="/gallery" className="md:col-span-8 bg-surface-container-lowest rounded-[40px] grid grid-cols-2 md:grid-cols-4 gap-2 p-2 hover:bg-surface-container-high transition-colors duration-500 shadow-xl overflow-hidden group">
          <div className="col-span-2 row-span-2 relative overflow-hidden rounded-[32px]">
            <img
              className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKAfLUb3uyDZVnsiKq1WQfLnC8_uADd6dlIkOepr6LBJMK1vBOwpldN4iUvxm1UZZWuHAYAktOuie688W79XFG86P6_EVzKV2GolO-9A7wuBTNXzlzBxH-ENbw_fCyqAiDVq3d6OlDDkWZchXYquZZOtgWJFai6K8JJWt0ud6h3bEbuOFzta1Oh9ZJanJhgs4s_hc0gVbykwlbnLLsjAK68HrU8MQyEdrjKOCQC1G264RMk39aCY7RxZpeJh9gtDoT0aD0AKQYwXw"
              alt="Family History"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
              <span className="text-white font-noto-serif text-xl italic">Registros de Aliança</span>
            </div>
          </div>
          <div className="bg-surface-container-high rounded-[32px] flex flex-col items-center justify-center p-6 text-center group-hover:bg-primary/5 transition-colors">
            <Camera className="text-primary mb-3" size={32} />
            <h3 className="font-noto-serif text-xl font-bold leading-tight">Galeria de Memórias</h3>
          </div>
          <div className="relative overflow-hidden rounded-[32px]">
            <img className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGt3EnveMumjsMOVTZR-1pqdPZNdr5xSM-DCyB6Ht0H6hEgy955DOiDpXUjn6HBjlWzt9KvNEhQOK6G_UOm76-iJzEFchlLolkke6OOLpPaOp4WnQRBxe0iLqs7DjekfDXAT7Rwdq6f70EeuICkVyE2JrSId4tDClnL3r0BImxXnbA7QFrR7RGvU1l36gD6x5JEMw8nl3TVWJ2x1eS5-Sq4GgbEI_YazBxbJIpTKQL0KMZ7jcWMXA6ruPLVHTy2nRWzzcYf7Ht0wk" alt="Legacy" />
          </div>
          <div className="relative overflow-hidden rounded-[32px]">
            <img className="w-full h-full object-cover grayscale group-hover:scale-110 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWDT7-gHWucReJRCsrSoSFfak5Xq5pC0orG4N0U2p-fRR_cWVJm1Mps6DzNcie6OvgTEbyOgC67AsvEZ6mZzd5x6ZohckUsPjhWsI-R5jWzFmItf3gUGHPQ0sTEnVgRbaoVlkw55UsE_VE60QKkvr2GQZbjWwYhk78j-kQljrgnnXKfPb4Hij_D3NtWJ1L2xJw6Lg-SYHlCBh60gZ4RwYOGdluPEEkTvNXaqtlvsIizJrrPym36W_OBE8HkJEyvBBRBEG3IApkd1A" alt="Heritage" />
          </div>
          <div className="col-span-2 md:col-span-1 bg-primary rounded-[32px] flex flex-col items-center justify-center p-6 text-on-primary shadow-xl">
            <span className="text-3xl font-noto-serif font-bold">120+</span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-center font-black opacity-80">Arquivos Restaurados</span>
          </div>
        </Link>
      </div>

      {/* Real Stories Section - Data from markdown files */}
      <section className="py-20 border-t border-outline-variant/10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="font-noto-serif text-5xl md:text-6xl mb-6 font-bold tracking-tight">Histórias de <span className="text-primary">Resiliência</span></h2>
            <p className="text-secondary text-xl font-noto-serif italic opacity-70">Fragmentos reais da nossa jornada, extraídos dos arquivos originais da família.</p>
          </div>
          <Link className="px-8 py-4 bg-surface-container rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-on-surface hover:bg-primary hover:text-white transition-all flex items-center gap-3 group shadow-md" to="/stories">
            Arquivo Completo <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {/* Story 1 - Makisuke */}
          <Link to="/stories" className="flex flex-col group animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="mb-8 relative overflow-hidden aspect-[4/5] rounded-[40px] shadow-2xl">
              <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" src="/api/proxy-image?id=167DDyeUVtNkCQiclTMnql9IoY0JKT5GD" alt="Makisuke Imoto" />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-lg">
                O Patriarca
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-grow bg-outline/20"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Getulina · Lins</span>
              <div className="h-px flex-grow bg-outline/20"></div>
            </div>
            <h4 className="font-noto-serif text-3xl mb-4 group-hover:text-primary transition-colors font-bold leading-tight">Capítulo 1: A Travessia e a Conquista da Terra</h4>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8 font-noto-serif italic opacity-80">
              "A história da família Imoto no Brasil tem suas raízes no Japão Imperial. O protagonista desta jornada é Makisuke Imoto, um homem de determinação imensa."
            </p>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-secondary group-hover:text-on-surface transition-colors">
              <MapPin size={14} /> Região de Aliança
            </div>
          </Link>

          {/* Story 2 - Sakue */}
          <Link to="/stories" className="flex flex-col md:translate-y-20 group animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
            <div className="mb-8 relative overflow-hidden aspect-[4/5] rounded-[40px] shadow-2xl">
              <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" src="https://projetokaeru.org.br/wp-content/uploads/2016/02/kasato_maru_postal_card.jpg" alt="A Chegada" />
              <div className="absolute top-6 left-6 bg-primary/90 backdrop-blur px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                Resiliência
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-grow bg-outline/20"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Matriarca Yajima</span>
              <div className="h-px flex-grow bg-outline/20"></div>
            </div>
            <h4 className="font-noto-serif text-3xl mb-4 group-hover:text-primary transition-colors font-bold leading-tight">Capítulo 2: A Imigração Astuciosa e a Força de Sakue</h4>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8 font-noto-serif italic opacity-80">
              "Para contornar as rígidas regras do consulado, a família precisou de astúcia. A verdadeira força estava no coração e na imensa resiliência de Sakue."
            </p>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-secondary group-hover:text-on-surface transition-colors">
              <History size={14} /> Memórias de Imigração
            </div>
          </Link>

          {/* Story 3 - Inovação e Sertão */}
          <Link to="/stories" className="flex flex-col group animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <div className="mb-8 relative overflow-hidden aspect-[4/5] rounded-[40px] shadow-2xl border border-outline/5">
              <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" src="/api/proxy-image?id=1pAKkqPb4xT7JDRStxLWyUFrQnVlfWlup" alt="Oásis no Sertão" />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary shadow-lg">
                Inovação
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-grow bg-outline/20"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Getulina · Petrolina</span>
              <div className="h-px flex-grow bg-outline/20"></div>
            </div>
            <h4 className="font-noto-serif text-3xl mb-4 group-hover:text-primary transition-colors font-bold leading-tight">Capítulo 5: Da Queda do Café ao Oásis no Sertão</h4>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8 font-noto-serif italic opacity-80">
              "Com a queda da safra cafeeira, Cyro Imoto reinventou o negócio da família, transformando o semiárido nordestino em um dos maiores polos exportadores."
            </p>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-secondary group-hover:text-on-surface transition-colors">
              <Award size={14} /> Expansão e Sucesso
            </div>
          </Link>
        </div>
      </section>

      {/* Real Functional Footer */}
      <footer className="mt-20 pt-20 border-t border-outline-variant/10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="hanko-seal scale-90 border border-on-surface/10">
                <span>井</span>
                <span>本</span>
              </div>
              <div className="font-noto-serif text-2xl font-bold tracking-tight uppercase text-on-surface">Arquivo Imoto</div>
            </div>
            <p className="text-base text-secondary font-noto-serif italic leading-relaxed opacity-60">
              Preservando a história das famílias Imoto e Yajima. Um portal dedicado à genealogia, documentos históricos e memórias da imigração japonesa.
            </p>
          </div>

          <div className="lg:col-span-1">
            <h5 className="text-[11px] font-black uppercase tracking-[0.3em] mb-10 text-primary">Navegação</h5>
            <ul className="flex flex-col gap-5 text-lg font-noto-serif text-on-surface-variant/70">
              <li><Link className="hover:text-primary hover:translate-x-2 transition-all inline-block" to="/">Início</Link></li>
              <li><Link className="hover:text-primary hover:translate-x-2 transition-all inline-block" to="/tree">Árvore Familiar</Link></li>
              <li><Link className="hover:text-primary hover:translate-x-2 transition-all inline-block" to="/timeline">Linha do Tempo</Link></li>
              <li><Link className="hover:text-primary hover:translate-x-2 transition-all inline-block" to="/gallery">Galeria Digital</Link></li>
              <li><Link className="hover:text-primary hover:translate-x-2 transition-all inline-block" to="/stories">Histórias Reais</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-surface-container-high rounded-[32px] p-8 border border-outline/10 shadow-xl">
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-on-surface">Institucional</h5>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-6 italic font-noto-serif">
                Este memorial é mantido pela Echo Desenvolvimento de Softwares.
              </p>
              <div className="flex items-center gap-3 text-[10px] font-bold text-secondary uppercase tracking-widest border-t border-outline/10 pt-6">
                <MapPin size={14} className="text-primary" />
                São Paulo · Petrolina
              </div>
            </div>
          </div>
        </div>

        <div className="py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-secondary/40 font-black tracking-[0.4em] uppercase border-t border-outline-variant/5">
          <span>© 2026 Memorial Família Imoto - Powered by Echo</span>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacidade</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Termos</Link>
            <a href="#" className="hover:text-primary transition-colors">Contato</a>
          </div>

        </div>
      </footer>
    </motion.div>
  );
};

export default Dashboard;
