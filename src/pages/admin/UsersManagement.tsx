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
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert('Erro ao atualizar status do usuário.');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Carregando usuários...</div>;
  if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-imoto-900/50 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="bg-imoto-600/20 p-3 rounded-xl border border-imoto-500/30">
            <Users className="text-imoto-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Controle de Acessos</h1>
            <p className="text-sm text-gray-400">Gerencie quem pode acessar e editar a plataforma.</p>
          </div>
        </div>
      </div>

      <div className="bg-imoto-900/50 rounded-2xl border border-white/10 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 border-b border-white/10 text-sm font-medium text-gray-400">
                <th className="p-4">Usuário</th>
                <th className="p-4">Cargo</th>
                <th className="p-4">Status</th>
                <th className="p-4">Data de Cadastro</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {user.role === 'ADMIN' && <ShieldAlert size={14} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.status === 'APPROVED' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        user.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {user.status === 'APPROVED' && <CheckCircle2 size={14} />}
                        {user.status === 'REJECTED' && <XCircle size={14} />}
                        {user.status === 'PENDING' && <Clock size={14} />}
                        {user.status === 'APPROVED' ? 'Aprovado' : user.status === 'REJECTED' ? 'Rejeitado' : 'Pendente'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {user.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleStatusChange(user.id, 'APPROVED')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg text-sm transition-colors"
                        >
                          <CheckCircle2 size={16} /> Aprovar
                        </button>
                      )}
                      {user.status !== 'REJECTED' && user.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleStatusChange(user.id, 'REJECTED')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm transition-colors"
                        >
                          <XCircle size={16} /> Rejeitar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
