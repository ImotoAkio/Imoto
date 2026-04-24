import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LayoutProps from './LayoutProps';
import CollaborationModal from './CollaborationModal';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Share2,
  History,
  Image as ImageIcon,
  Users,
  BookOpen,
  Wallet,
  FileText,
  Menu,
  X,
  Settings,
  ChevronLeft,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();

  const navItems = [
    { label: 'Início', path: '/', icon: <Home size={20} /> },
    { label: 'Árvore', path: '/tree', icon: <Share2 size={20} /> },
    { label: 'Linha do Tempo', path: '/timeline', icon: <History size={20} /> },
    { label: 'Galeria', path: '/gallery', icon: <ImageIcon size={20} /> },
    { label: 'Perfis', path: '/profiles', icon: <Users size={20} /> },
    { label: 'Documentos', path: '/documents', icon: <FileText size={20} /> },
    { label: 'Histórias', path: '/stories', icon: <BookOpen size={20} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Fechar menu mobile ao navegar
  const isAuthPage = location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname.startsWith('/reset-password/');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen overflow-hidden bg-background text-on-background flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 px-6 bg-surface border-b border-surface-container-low z-50 fixed top-0 w-full h-[73px]">
        <div className="flex items-center gap-3">
          <div className="hanko-seal scale-75 origin-left">
            <span>井</span>
            <span>本</span>
          </div>
          <div>
            <h1 className="font-noto-serif text-lg font-bold text-on-background tracking-tight leading-tight">Arquivo Imoto</h1>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-on-surface hover:bg-surface-container-low transition-colors rounded-full"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[73px] bg-inverse-surface z-40 overflow-y-auto border-t border-outline/20">
          <div className="flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-8 py-5 transition-all duration-300 font-noto-serif font-medium border-b border-white/5 ${isActive(item.path)
                  ? 'text-primary-fixed bg-white/10 border-l-4 border-l-primary-fixed'
                  : 'text-inverse-on-surface/70 hover:bg-white/5 hover:text-inverse-on-surface'
                  }`}
              >
                <span className={isActive(item.path) ? 'text-primary-fixed' : 'text-inverse-on-surface/50'}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <nav
        className={`hidden lg:flex flex-col h-screen fixed left-0 top-0 bg-inverse-surface text-inverse-on-surface z-40 transition-all duration-300 ease-in-out border-r border-outline/10 ${isCollapsed ? 'w-20' : 'w-72'
          }`}
      >
        <div className={`px-6 pt-8 mb-12 transition-all duration-300 ${isCollapsed ? 'opacity-0 invisible h-0 mb-0' : 'opacity-100'}`}>
          <h1 className="font-noto-serif text-2xl font-bold tracking-tight whitespace-nowrap text-white">Arquivo Imoto</h1>
          <p className="text-inverse-on-surface/50 text-sm font-noto-serif italic whitespace-nowrap">Legado e Memória</p>
        </div>

        {isCollapsed && (
          <div className="flex justify-center pt-8 mb-12">
            <div className="hanko-seal scale-75 border border-white/20">
              <span>井</span>
              <span>本</span>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-grow overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.label : ''}
              className={`flex items-center gap-4 py-4 transition-all duration-300 font-noto-serif font-medium group ${isActive(item.path)
                ? 'text-primary-fixed border-l-4 border-primary-fixed bg-white/10'
                : 'text-inverse-on-surface/60 hover:bg-white/5 hover:text-white'
                } ${isCollapsed ? 'justify-center px-0' : 'px-8'}`}
            >
              <span className={`${isActive(item.path) ? 'text-primary-fixed' : 'text-inverse-on-surface/40 group-hover:text-primary-fixed'} transition-transform duration-300 ${!isCollapsed && 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className={`transition-all duration-300 whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                {item.label}
              </span>
            </Link>
          ))}

          {/* Admin Section */}
          {(isAuthenticated && isAdmin) && (
            <div className={`mt-8 mb-4 px-8 flex flex-col gap-4 ${isCollapsed ? 'hidden' : ''}`}>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-inverse-on-surface/30">Administração</span>
              <div className="flex flex-col gap-1">
                <Link to="/admin/tree" className="text-sm font-noto-serif flex items-center gap-3 text-inverse-on-surface/50 hover:text-primary-fixed transition-colors">
                  <Settings size={14} /> Árvore
                </Link>
                <Link to="/admin/archive" className="text-sm font-noto-serif flex items-center gap-3 text-inverse-on-surface/50 hover:text-primary-fixed transition-colors">
                  <Settings size={14} /> Acervo
                </Link>
                <Link to="/admin/cataloging" className="text-sm font-noto-serif flex items-center gap-3 text-inverse-on-surface/50 hover:text-primary-fixed transition-colors">
                  <Settings size={14} /> Catalogação
                </Link>
                <Link to="/admin/users" className="text-sm font-noto-serif flex items-center gap-3 text-inverse-on-surface/50 hover:text-primary-fixed transition-colors mt-2 text-primary-fixed/80">
                  <Users size={14} /> Usuários
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-inverse-surface border border-outline/30 rounded-full p-1 text-inverse-on-surface hover:text-primary-fixed transition-colors shadow-xl z-50"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className={`mt-auto p-6 border-t border-white/5 shrink-0 transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className={`hanko-seal transition-all duration-300 border border-white/10 ${isCollapsed ? 'scale-75' : ''}`}>
                <span>井</span>
                <span>本</span>
              </div>
              <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                <p className="text-xs font-bold uppercase tracking-widest whitespace-nowrap text-white">Família Imoto</p>
                <p className="text-[10px] text-inverse-on-surface/50 whitespace-nowrap">Japão &gt; Brasil</p>
              </div>
            </div>

            <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 h-0 overflow-hidden m-0' : 'opacity-100 mt-2'}`}>
              {isAuthenticated ? (
                <div className="flex items-center justify-between bg-black/20 px-3 py-2 rounded-lg border border-white/5">
                  <div className="text-xs">
                    <span className="text-white block font-medium truncate w-24">{user?.name?.split(' ')[0]}</span>
                    <span className="text-primary-fixed/80 text-[10px] uppercase">{user?.role}</span>
                  </div>
                  <button onClick={logout} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-500/10 rounded transition-colors">Sair</button>
                </div>
              ) : (
                <Link to="/login" className="block text-center text-xs text-primary-fixed border border-primary-fixed/30 py-2 rounded-lg hover:bg-primary-fixed/10 transition-colors w-full">
                  Fazer Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main
        className={`flex-grow w-full h-[calc(100vh-73px)] mt-[73px] lg:h-screen lg:mt-0 overflow-y-auto transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'
          }`}
      >
        {children}
      </main>

      {/* Global Collaboration Button (FAB) */}
      <button
        onClick={() => setIsCollabOpen(true)}
        title="Colaborar com o Memorial"
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-on-primary flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all z-[1000] group"
      >
        <HeartHandshake size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="text-[8px] font-bold uppercase tracking-widest mt-1">Colaborar</span>
      </button>

      {/* Global Collaboration Modal */}
      <CollaborationModal isOpen={isCollabOpen} onClose={() => setIsCollabOpen(false)} />
    </div>
  );
};

export default Layout;
