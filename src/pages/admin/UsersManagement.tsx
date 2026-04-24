import React, { useState, useEffect } from 'react';
import { fetchUsers, updateUserStatus } from '../../lib/api';
import { Users, CheckCircle2, XCircle, Clock, ShieldAlert } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err: any) {
      setError('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleStatusChange = async (userId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    if (processingIds.includes(userId)) return;
    
    try {
      setProcessingIds(prev => [...prev, userId]);
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar status do usuário.');
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== userId));
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-on-surface-variant font-noto-serif italic text-lg animate-pulse">Consultando arquivos da comunidade...</p>
    </div>
  );
  
  if (error) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="bg-error/10 p-4 rounded-full shadow-lg">
        <XCircle className="text-error" size={48} />
      </div>
      <h2 className="text-2xl font-noto-serif font-bold text-on-surface">{error}</h2>
      <button onClick={loadUsers} className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-container transition-all shadow-md">Tentar novamente</button>
    </div>
  );

  return (
    <div className="p-4 lg:p-10 max-w-7xl mx-auto space-y-10 pb-32">
      {/* Premium Header Section */}
      <div className="relative overflow-hidden bg-inverse-surface rounded-[40px] p-10 lg:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -ml-20 -mb-20"></div>
        
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="flex items-center gap-6">
            <div className="bg-primary p-5 rounded-3xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <Users className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-noto-serif font-bold text-white tracking-tight leading-tight">Membros da Família</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="h-px w-8 bg-primary/50"></span>
                <p className="text-inverse-on-surface/50 font-noto-serif italic text-base lg:text-lg">Gestão de identidades e acessos ao memorial digital.</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
             <div className="bg-white/5 backdrop-blur-xl px-8 py-5 rounded-[24px] border border-white/10 text-center min-w-[120px] shadow-lg">
                <span className="block text-4xl font-bold text-white leading-none mb-2">{users.length}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-inverse-on-surface/40 font-bold">Inscritos</span>
             </div>
             <div className="bg-primary/20 backdrop-blur-xl px-8 py-5 rounded-[24px] border border-primary/30 text-center min-w-[120px] shadow-lg">
                <span className="block text-4xl font-bold text-primary-fixed-dim leading-none mb-2">{users.filter(u => u.status === 'PENDING').length}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary-fixed/40 font-bold">Pendentes</span>
             </div>
          </div>
        </div>
      </div>

      {/* Elegant Content Table */}
      <div className="bg-white rounded-[40px] border border-outline/10 shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline/5">
                <th className="px-8 py-7 text-[11px] uppercase tracking-[0.25em] font-black text-on-surface-variant/40 font-sans">Identidade Digital</th>
                <th className="px-8 py-7 text-[11px] uppercase tracking-[0.25em] font-black text-on-surface-variant/40 font-sans">Autoridade</th>
                <th className="px-8 py-7 text-[11px] uppercase tracking-[0.25em] font-black text-on-surface-variant/40 font-sans text-center">Status</th>
                <th className="px-8 py-7 text-[11px] uppercase tracking-[0.25em] font-black text-on-surface-variant/40 font-sans">Data de Ingresso</th>
                <th className="px-8 py-7 text-[11px] uppercase tracking-[0.25em] font-black text-on-surface-variant/40 font-sans text-right">Ações de Moderação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/5">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
                       <div className="p-6 bg-surface-container rounded-full grayscale opacity-20">
                          <Users size={80} />
                       </div>
                       <p className="text-on-surface-variant/40 italic font-noto-serif text-xl">O arquivo de usuários está vazio no momento.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={user.id} className="group hover:bg-surface-container-lowest transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary font-bold text-xl border border-outline/10 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          {user.status === 'APPROVED' && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <CheckCircle2 size={10} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface text-xl leading-tight group-hover:text-primary transition-colors">{user.name}</div>
                          <div className="text-sm text-on-surface-variant/50 font-medium mt-0.5">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] border transition-all ${
                        user.role === 'ADMIN' 
                          ? 'bg-primary/5 text-primary border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:border-primary' 
                          : 'bg-secondary/5 text-secondary border-secondary/20 group-hover:bg-secondary group-hover:text-white group-hover:border-secondary'
                      }`}>
                        {user.role === 'ADMIN' ? <ShieldAlert size={14} /> : <Users size={14} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold border transition-all duration-500 ${
                          user.status === 'APPROVED' ? 'bg-green-500/5 text-green-700 border-green-500/20 group-hover:bg-green-500 group-hover:text-white' :
                          user.status === 'REJECTED' ? 'bg-error/5 text-error border-error/20 group-hover:bg-error group-hover:text-white' :
                          'bg-amber-500/5 text-amber-700 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white'
                        }`}>
                          {user.status === 'APPROVED' && <CheckCircle2 size={16} />}
                          {user.status === 'REJECTED' && <XCircle size={16} />}
                          {user.status === 'PENDING' && <Clock size={16} />}
                          {user.status === 'APPROVED' ? 'Ativo' : user.status === 'REJECTED' ? 'Bloqueado' : 'Pendente'}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm text-on-surface font-bold">
                          {new Date(user.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-on-surface-variant/40 font-medium uppercase tracking-widest">Data de registro</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-3 transition-all duration-300">
                        {processingIds.includes(user.id) ? (
                          <div className="flex items-center gap-2 px-6 py-2.5 text-primary text-xs font-bold bg-primary/5 rounded-2xl border border-primary/10">
                            <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            Processando...
                          </div>
                        ) : (
                          <>
                            {user.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleStatusChange(user.id, 'APPROVED')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-green-100 text-green-700 hover:bg-green-600 hover:text-white rounded-2xl transition-all shadow-md active:scale-95 font-bold text-xs"
                              >
                                <CheckCircle2 size={18} /> Aprovar
                              </button>
                            )}
                            {user.status !== 'REJECTED' && user.role !== 'ADMIN' && (
                              <button
                                onClick={() => handleStatusChange(user.id, 'REJECTED')}
                                className="flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-700 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-md active:scale-95 font-bold text-xs"
                              >
                                <XCircle size={18} /> Bloquear
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Premium Footer */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-surface-container-low/30 p-10 rounded-[40px] border border-outline/5 shadow-inner">
         <div className="flex items-center gap-4">
            <div className="hanko-seal scale-75 opacity-40">
               <span>井</span>
               <span>本</span>
            </div>
            <p className="text-sm font-noto-serif italic text-on-surface-variant/40 max-w-md">
               "A memória de uma família é o alicerce de sua identidade. Modere com sabedoria."
            </p>
         </div>
         <div className="flex gap-8">
            <div className="flex flex-col items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/30 text-center">Ativo</span>
            </div>
            <div className="flex flex-col items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/30 text-center">Pendente</span>
            </div>
            <div className="flex flex-col items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-error shadow-[0_0_10px_rgba(186,26,26,0.5)]"></div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/30 text-center">Bloqueado</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default UsersManagement;
