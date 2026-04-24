import React from 'react';
import { Share2, FileText, History, Clock, ArrowRight, Camera } from 'lucide-react';
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
      <section className="mt-8 mb-16 relative overflow-hidden bg-surface-container-low min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            alt="Family portrait"
            className="w-full h-full object-cover grayscale opacity-40 mix-blend-multiply"
            src="https://images.weserv.nl/?url=https://lh3.googleusercontent.com/pw/AP1GczOifr894TsgXN8RuC6j0AomsR_JjfoZOp4-9X69NQdyXSlGa58YCCTQeT_ehXIlNDxsp8xUmTZVvorhclEmdwYHLFvp_iozBqDH9wPb0-P3IOUG_jLURczHoXZ4PiLCgO-U1FgfjCxUIo69jmw-dJaaEg=w1104-h729-s-no-gm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-2xl pl-8 md:pl-16">
          <div className="mb-4 inline-block bg-primary px-3 py-1 text-on-primary text-[10px] tracking-[0.2em] uppercase font-bold">
            O Legado Vive
          </div>
          <h1 className="text-4xl md:text-7xl font-noto-serif text-on-background leading-tight mb-6">
            Bem-vindos ao <span className="text-primary italic">Legado Imoto</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary max-w-lg font-body leading-relaxed mb-8">
            Um arquivo vivo dedicado à preservação da história, dos documentos e das memórias preciosas da nossa família, desde Japão até o Brasil.
          </p>
          <div className="flex gap-4">
            <Link to="/gallery" className="bg-primary text-on-primary px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-primary-container transition-colors inline-block text-center">
              Explorar Acervo
            </Link>
            <Link to="/stories" className="flex items-center gap-2 text-on-surface font-noto-serif px-4 py-4 hover:bg-surface-container-high transition-colors">
              <span className="text-primary text-xl">·</span> Nossa História
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
        {/* Genealogy Bento */}
        <Link to="/tree" className="md:col-span-8 bg-surface-container-lowest p-10 relative overflow-hidden group cursor-pointer hover:bg-surface-container-high transition-colors duration-500">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="font-noto-serif text-3xl mb-2">Árvore Genealógica</h3>
              <p className="text-secondary text-sm max-w-sm">Mapeando nossas raízes através das gerações, de 1890 até os dias atuais.</p>
            </div>
            <Share2 className="text-primary w-10 h-10" />
          </div>
          <div className="flex gap-12 items-end">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container border border-outline-variant flex items-center justify-center font-noto-serif">K.I.</div>
                <div className="h-[1px] w-8 bg-outline-variant/30"></div>
                <div className="w-12 h-12 bg-surface-container border border-outline-variant flex items-center justify-center font-noto-serif">M.I.</div>
              </div>
              <div className="flex items-center gap-4 translate-x-10">
                <div className="w-12 h-12 bg-primary/10 border border-primary flex items-center justify-center font-noto-serif font-bold text-primary">S.I.</div>
              </div>
            </div>
            <div className="ml-auto text-right">
              <span className="text-4xl font-noto-serif block text-primary">422</span>
              <span className="text-[10px] uppercase tracking-widest text-secondary">Membros Catalogados</span>
            </div>
          </div>
        </Link>

        {/* Documents Bento */}
        <div className="md:col-span-4 bg-surface-container-low p-8 flex flex-col justify-between border-l-4 border-primary">
          <div className="hanko-seal mb-6">書類 </div>
          <div>
            <h3 className="font-noto-serif text-2xl mb-4">Documentos Históricos</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">Certidões, passaportes de imigração e registros de terra originais digitalizados em alta resolução.</p>
            <Link className="text-xs font-bold uppercase tracking-widest border-b border-primary pb-1 text-on-surface hover:text-primary transition-colors" to="/documents">Ver Documentos</Link>
          </div>
        </div>

        {/* Timeline Bento */}
        <Link to="/timeline" className="md:col-span-4 bg-[#1b1c1a] text-inverse-on-surface p-8 relative overflow-hidden group cursor-pointer block">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <History className="text-primary mb-4" />
              <h3 className="font-noto-serif text-2xl mb-2">Linha do Tempo</h3>
              <p className="text-stone-400 text-xs">Os marcos fundamentais da jornada Imoto entre dois continentes.</p>
            </div>
            <div className="mt-8">
              <div className="text-primary font-noto-serif text-lg mb-1 italic">1912</div>
              <div className="text-[10px] uppercase tracking-[0.15em] opacity-70">A Chegada no Porto de Santos</div>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock className="w-24 h-24" />
          </div>
        </Link>

        {/* Gallery Bento */}
        <Link to="/gallery" className="md:col-span-8 bg-surface-container-lowest grid grid-cols-2 md:grid-cols-4 gap-1 p-1 hover:bg-surface-container-high transition-colors duration-500">
          <div className="col-span-2 row-span-2 relative group overflow-hidden">
            <img
              className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKAfLUb3uyDZVnsiKq1WQfLnC8_uADd6dlIkOepr6LBJMK1vBOwpldN4iUvxm1UZZWuHAYAktOuie688W79XFG86P6_EVzKV2GolO-9A7wuBTNXzlzBxH-ENbw_fCyqAiDVq3d6OlDDkWZchXYquZZOtgWJFai6K8JJWt0ud6h3bEbuOFzta1Oh9ZJanJhgs4s_hc0gVbykwlbnLLsjAK68HrU8MQyEdrjKOCQC1G264RMk39aCY7RxZpeJh9gtDoT0aD0AKQYwXw"
              alt="Gallery highlight"
            />
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="bg-surface-container-high flex items-center justify-center p-4">
            <h3 className="font-noto-serif text-xl text-center">Galeria de Fotos</h3>
          </div>
          <div className="relative overflow-hidden group">
            <img className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGt3EnveMumjsMOVTZR-1pqdPZNdr5xSM-DCyB6Ht0H6hEgy955DOiDpXUjn6HBjlWzt9KvNEhQOK6G_UOm76-iJzEFchlLolkke6OOLpPaOp4WnQRBxe0iLqs7DjekfDXAT7Rwdq6f70EeuICkVyE2JrSId4tDClnL3r0BImxXnbA7QFrR7RGvU1l36gD6x5JEMw8nl3TVWJ2x1eS5-Sq4GgbEI_YazBxbJIpTKQL0KMZ7jcWMXA6ruPLVHTy2nRWzzcYf7Ht0wk" alt="Gallery 1" />
          </div>
          <div className="relative overflow-hidden group">
            <img className="w-full h-full object-cover grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWDT7-gHWucReJRCsrSoSFfak5Xq5pC0orG4N0U2p-fRR_cWVJm1Mps6DzNcie6OvgTEbyOgC67AsvEZ6mZzd5x6ZohckUsPjhWsI-R5jWzFmItf3gUGHPQ0sTEnVgRbaoVlkw55UsE_VE60QKkvr2GQZbjWwYhk78j-kQljrgnnXKfPb4Hij_D3NtWJ1L2xJw6Lg-SYHlCBh60gZ4RwYOGdluPEEkTvNXaqtlvsIizJrrPym36W_OBE8HkJEyvBBRBEG3IApkd1A" alt="Gallery 2" />
          </div>
          <div className="col-span-2 md:col-span-1 bg-primary flex flex-col items-center justify-center p-4 text-on-primary">
            <span className="text-2xl font-noto-serif">1.2k+</span>
            <span className="text-[8px] uppercase tracking-widest text-center">Registros Visuais</span>
          </div>
        </Link>
      </div>

      {/* Latest Stories Section */}
      <section className="py-12 border-t border-outline-variant/20">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="font-noto-serif text-4xl mb-4">Histórias & Memórias</h2>
            <p className="text-secondary max-w-md">Relatos em primeira mão e tradições orais transcritas para as gerações futuras.</p>
          </div>
          <Link className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2" to="/stories">
            Ver Todas as Histórias <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Story 1 */}
          <Link to="/stories" className="flex flex-col group">
            <div className="mb-6 relative overflow-hidden aspect-[3/4]">
              <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1Lzp7Qt4D4vddCRxh2m3twGihy0TceXy0MkH_ZC9Qg3NpJ68MpW2z9pMZD8BfXADgeMy-etGzjoY0HGWhu3v4JAU37DnoarnzvdnUKV-P31gn28osAxDsOwbL-Kvb3IL0X4N5GKqt13rIke6K44REGcIVpQvG6Ue5xwb032z7AXpc1G8CpVo3s9wvU52BeZ_fK301ORPfuzVFVWcT4LPKLSzypvJ84RYHcsUjajBBgeKFsWAmKe_FzngSM89z1tEe9YrvsieYYFA" alt="Haruo Imoto" />
              <div className="absolute bottom-4 left-4 bg-background px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                O Patriarca
              </div>
            </div>
            <h4 className="font-noto-serif text-2xl mb-3 group-hover:text-primary transition-colors">Haruo Imoto (1885 - 1962)</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6 italic">
              "A travessia no navio Kasato Maru e os primeiros anos nas lavouras de café no interior de São Paulo. Uma história de resiliência e adaptação."
            </p>
            <div className="h-1 w-12 bg-primary mb-4"></div>
            <p className="text-[10px] text-secondary uppercase tracking-widest">Narrado por Akira Imoto</p>
          </Link>

          {/* Story 2 */}
          <Link to="/stories" className="flex flex-col md:translate-y-12 group">
            <div className="mb-6 relative overflow-hidden aspect-[3/4]">
              <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNkG8L4By8w-gW-zibmkdzpvyg7lMWiRppKrqRVa4uro6Tm6mMyz7T9crfIh3e1t5XknZDirUrr5TwTxYdhQGq59aOYYkF15sZ5LNTlxsV4_TPA-5vS7tRp3HTOrDcbkF5oCHR9gWbq-b0ZRTZrsDAH_z3Ks7YTj6PGetOa2N48SYvNOTzTUvR8jwQWnTOzUW0-hdFGrJ3e8_Wnv4urOSevZUJtRu7YyCUQHeom_1zR-NqgrcjxoN34XniyoZ3J7n-4vkP5BTrVq8" alt="Emiko Imoto" />
              <div className="absolute bottom-4 left-4 bg-background px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
                Educação & Sonhos
              </div>
            </div>
            <h4 className="font-noto-serif text-2xl mb-3 group-hover:text-primary transition-colors">Emiko Imoto (1922 - 2005)</h4>
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6 italic">
              "A primeira da família a ingressar na universidade. Como o sonho da educação moldou o futuro das gerações seguintes no Brasil."
            </p>
            <div className="h-1 w-12 bg-primary mb-4"></div>
            <p className="text-[10px] text-secondary uppercase tracking-widest">Escrito por Fernanda Imoto</p>
          </Link>

          {/* Contribute Card */}
          <div className="flex flex-col">
            <div className="mb-6 relative overflow-hidden aspect-[3/4] bg-surface-container-high flex flex-col items-center justify-center p-8 text-center">
              <Camera className="text-primary w-12 h-12 mb-6" />
              <h5 className="font-noto-serif text-xl mb-2">Preserve uma Memória</h5>
              <p className="text-xs text-secondary mb-8">Você possui uma foto antiga ou uma história que gostaria de compartilhar com o arquivo?</p>
              <button className="border border-outline px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-on-surface hover:text-background transition-colors">Contribuir</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Tonal Layer */}
      <footer className="mt-24 pt-12 border-t border-outline-variant/10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <div className="font-noto-serif text-xl tracking-widest uppercase text-on-surface mb-4">Arquivo Imoto</div>
            <p className="text-xs text-secondary leading-loose">
              Este arquivo é mantido pela Associação Memorial Imoto. Todos os direitos reservados à preservação da dignidade e privacidade de nossos ancestrais.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-widest mb-6">Navegação</h5>
              <ul className="text-sm flex flex-col gap-3 font-noto-serif text-on-surface-variant">
                <li><Link className="hover:text-primary" to="/">Início</Link></li>
                <li><Link className="hover:text-primary" to="/gallery">Galeria Digital</Link></li>
                <li><Link className="hover:text-primary" to="/documents">Registros Civis</Link></li>
                <li><Link className="hover:text-primary" to="/stories">Histórias</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-[10px] font-bold uppercase tracking-widest mb-6">Privacidade</h5>
              <ul className="text-sm flex flex-col gap-3 font-noto-serif text-on-surface-variant">
                <li><Link className="hover:text-primary" to="/admin/tree">Acesso Restrito</Link></li>
                <li><a className="hover:text-primary" href="#">Termos de Uso</a></li>
                <li><a className="hover:text-primary" href="#">Política do Acervo</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-20 py-8 flex justify-between items-center text-[10px] text-secondary tracking-widest uppercase">
          <span>© 2024 Família Imoto</span>
          <span>São Paulo · Okayama</span>
        </div>
      </footer>
    </motion.div>
  );
};

export default Dashboard;
