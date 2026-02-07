
import React, { useState } from 'react';
import { Client } from '../types';

interface Props {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  isAuthenticated: boolean;
}

const ClientsMode: React.FC<Props> = ({ clients, setClients, isAuthenticated }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'lead' as Client['status']
  });

  const filtered = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    if (!isAuthenticated) return;
    e.preventDefault();
    if (editingClient) {
      setClients(prev => prev.map(c => c.id === editingClient.id ? { ...editingClient, ...formData } : c));
    } else {
      const newClient: Client = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        totalOrders: 0
      };
      setClients(prev => [...prev, newClient]);
    }
    closeModal();
  };

  const openModal = (client?: Client) => {
    if (!isAuthenticated) return;
    if (client) {
      setEditingClient(client);
      setFormData({ name: client.name, email: client.email, phone: client.phone, status: client.status });
    } else {
      setEditingClient(null);
      setFormData({ name: '', email: '', phone: '', status: 'lead' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const deleteClient = (id: string) => {
    if (!isAuthenticated) return;
    if (confirm('Удалить клиента?')) {
      setClients(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">База клиентов</h2>
          <p className="text-sm text-gray-400">Управление контактами и статусами</p>
        </div>
        {isAuthenticated && (
          <button 
            onClick={() => openModal()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/20"
          >
            + Добавить клиента
          </button>
        )}
      </div>

      <div className="mb-6 relative">
        <input 
          type="text"
          placeholder="Поиск по ФИО или Email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      <div className="flex-1 overflow-y-auto glass rounded-2xl border-white/5">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-[11px] text-gray-500 uppercase tracking-wider">
              <th className="p-4 font-bold">Имя / Компания</th>
              <th className="p-4 font-bold">Контакты</th>
              <th className="p-4 font-bold">Заказы</th>
              <th className="p-4 font-bold">Статус</th>
              {isAuthenticated && <th className="p-4 font-bold text-right">Действия</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="font-medium text-gray-200">{c.name}</div>
                  <div className="text-[10px] text-gray-500">ID: {c.id}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm">{c.email}</div>
                  <div className="text-[10px] text-gray-500">{c.phone}</div>
                </td>
                <td className="p-4 text-sm font-medium">{c.totalOrders}</td>
                <td className="p-4">
                  <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold ${
                    c.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    c.status === 'lead' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {c.status}
                  </span>
                </td>
                {isAuthenticated && (
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openModal(c)} className="text-blue-400 hover:text-blue-300 text-xs">Изменить</button>
                    <button onClick={() => deleteClient(c.id)} className="text-red-400 hover:text-red-300 text-xs">Удалить</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-dark w-full max-w-md p-8 rounded-3xl shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-6">{editingClient ? 'Редактировать клиента' : 'Новый клиент'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">ФИО / Название</label>
                <input 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Email</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Телефон</label>
                <input 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Статус</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-blue-500 appearance-none text-slate-300"
                >
                  <option value="lead">Лид (Потенциальный)</option>
                  <option value="active">Активный</option>
                  <option value="inactive">Неактивный</option>
                </select>
              </div>
              <div className="flex space-x-3 mt-8">
                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">Отмена</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-all shadow-lg shadow-blue-600/20">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsMode;
