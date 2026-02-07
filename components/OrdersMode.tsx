
import React, { useState } from 'react';
import { Order, Client, Product } from '../types';

interface Props {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  clients: Client[];
  products: Product[];
  isAuthenticated: boolean;
}

const OrdersMode: React.FC<Props> = ({ orders, setOrders, clients, products, isAuthenticated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    productId: '',
    status: 'Pending' as Order['status']
  });

  const getStatusColor = (status: Order['status']) => {
    switch(status) {
      case 'Completed': return 'bg-green-500/20 text-green-400 border border-green-500/20';
      case 'Assembling': return 'bg-blue-500/20 text-blue-400 border border-blue-500/20';
      case 'Pending': return 'bg-orange-500/20 text-orange-400 border border-orange-500/20';
      case 'Shipped': return 'bg-purple-500/20 text-purple-400 border border-purple-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/20';
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    if (!isAuthenticated) return;
    e.preventDefault();
    const client = clients.find(c => c.id === formData.clientId);
    const product = products.find(p => p.id === formData.productId);
    
    if (!client || !product) return;

    const newOrder: Order = {
      id: 'ORD-' + (orders.length + 101),
      clientId: client.id,
      clientName: client.name,
      items: [product.name],
      total: product.price,
      status: formData.status,
      date: new Date().toISOString().split('T')[0]
    };

    setOrders(prev => [newOrder, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Журнал заказов</h2>
          <p className="text-sm text-gray-400">Контроль продаж и выполнения сборок</p>
        </div>
        {isAuthenticated && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-600/20"
          >
            + Создать заказ
          </button>
        )}
      </div>

      <div className="space-y-4 overflow-y-auto pr-2">
        {orders.map(o => (
          <div key={o.id} className="glass p-6 rounded-2xl border-white/5 flex items-center hover:bg-white/5 transition-all group">
            <div className="w-16 h-16 rounded-xl bg-blue-600/10 flex flex-col items-center justify-center border border-blue-500/20 mr-6">
              <span className="text-[10px] uppercase font-bold text-blue-400">ID</span>
              <span className="text-sm font-bold">{o.id.split('-')[1]}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-bold text-gray-200 group-hover:text-blue-300 transition-colors">{o.clientName}</h4>
                <span className="text-[10px] text-gray-600">•</span>
                <span className="text-[10px] text-gray-500">{o.date}</span>
              </div>
              <div className="text-xs text-gray-400 truncate max-w-md italic">
                {o.items.join(', ')}
              </div>
            </div>

            <div className="text-right mr-12">
              <div className="text-lg font-bold text-white">₽{o.total.toLocaleString()}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-tighter">Оплата получена</div>
            </div>

            <div className="w-32">
              <span className={`block text-center text-[9px] py-1.5 px-3 rounded-lg font-bold uppercase tracking-widest ${getStatusColor(o.status)}`}>
                {o.status}
              </span>
            </div>
            {isAuthenticated && (
              <button 
                onClick={() => setOrders(prev => prev.filter(item => item.id !== o.id))}
                className="ml-4 p-2 text-gray-600 hover:text-red-400 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-dark w-full max-w-md p-8 rounded-3xl border border-white/10 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-6">Новый заказ</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Выбрать клиента</label>
                <select required value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none appearance-none text-slate-300">
                  <option value="">Выберите из базы...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Выбрать товар</label>
                <select required value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none appearance-none text-slate-300">
                  <option value="">Выберите товар...</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} — ₽{p.price.toLocaleString()}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Статус выполнения</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none appearance-none text-slate-300">
                  <option value="Pending">Ожидает</option>
                  <option value="Assembling">Сборка</option>
                  <option value="Shipped">Отправлен</option>
                  <option value="Completed">Завершен</option>
                </select>
              </div>
              <div className="flex space-x-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">Отмена</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition-all">Создать</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersMode;
