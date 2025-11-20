import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit3, Trash2, Check, X, Eye, EyeOff } from 'lucide-react';
import { usersAPI } from '../../services/api';
import { LABELS } from '../../utils/constants';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
    entryDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        entryDate: user.entry_date,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'client',
        entryDate: new Date().toISOString().split('T')[0],
      });
    }
    setShowModal(true);
    setShowPassword(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Se editando, só enviar senha se foi preenchida
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await usersAPI.update(editingUser.id, updateData);
        alert('Usuário atualizado com sucesso!');
      } else {
        await usersAPI.create(formData);
        alert('Usuário criado com sucesso!');
      }
      handleCloseModal();
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao salvar usuário');
    }
  };

  const handleToggleActive = async (user) => {
    try {
      if (user.is_active) {
        if (!confirm(`Deseja realmente desativar o usuário ${user.name}?`)) {
          return;
        }
        await usersAPI.delete(user.id);
        alert('Usuário desativado com sucesso!');
      } else {
        await usersAPI.activate(user.id);
        alert('Usuário reativado com sucesso!');
      }
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Erro ao alterar status do usuário');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="text-text-muted">Carregando usuários...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="bg-danger/10 border border-danger rounded-lg p-4">
          <p className="text-danger">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Users className="w-5 h-5" />
          Gerenciar Usuários
        </h3>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">
                Nome
              </th>
              <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">
                E-mail
              </th>
              <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">
                Tipo
              </th>
              <th className="text-left py-3 px-4 text-text-secondary font-medium text-sm">
                Data de Entrada
              </th>
              <th className="text-center py-3 px-4 text-text-secondary font-medium text-sm">
                Status
              </th>
              <th className="text-center py-3 px-4 text-text-secondary font-medium text-sm">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="table-row">
                <td className="py-3 px-4 text-text-primary font-medium">
                  {user.name}
                </td>
                <td className="py-3 px-4 text-text-secondary">
                  {user.email}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`badge ${
                      user.role === 'admin'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-success/10 text-success'
                    }`}
                  >
                    {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                  </span>
                </td>
                <td className="py-3 px-4 text-text-secondary">
                  {new Date(user.entry_date).toLocaleDateString('pt-BR')}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`badge ${
                      user.is_active
                        ? 'bg-success/10 text-success'
                        : 'bg-danger/10 text-danger'
                    }`}
                  >
                    {user.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="p-2 hover:bg-bg-tertiary rounded-lg transition-colors text-accent"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`p-2 hover:bg-bg-tertiary rounded-lg transition-colors ${
                        user.is_active ? 'text-danger' : 'text-success'
                      }`}
                      title={user.is_active ? 'Desativar' : 'Ativar'}
                    >
                      {user.is_active ? (
                        <Trash2 className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          Nenhum usuário encontrado
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-bg-secondary rounded-lg border border-border shadow-card w-full max-w-md">
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold text-text-primary">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Senha {editingUser && '(deixe em branco para manter)'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required={!editingUser}
                    className="input-field w-full pr-10"
                    placeholder={editingUser ? 'Nova senha (opcional)' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Tipo de Usuário
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="input-field w-full"
                >
                  <option value="client">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Data de Entrada
                  </label>
                  <input
                    type="date"
                    value={formData.entryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, entryDate: e.target.value })
                    }
                    required
                    className="input-field w-full"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingUser ? LABELS.save : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary"
                >
                  {LABELS.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
