import React from 'react';
import { Client, Product, Order } from '../types';

interface Props {
  clients: Client[];
  products: Product[];
  orders: Order[];
}

const DashboardMode: React.FC<Props> = ({ clients, products, orders }) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgCheck = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const stats = [
    { label: 'Всего заказов', value: orders.length.toString(), change: '+5%', color: 'text-blue-400' },
    { label: 'Выручка', value: `₽${(totalRevenue / 1000).toFixed(1)}к`, change: '+8%', color: 'text-green-400' },
    { label: 'Клиенты', value: clients.length.toString(), change: '+2', color: 'text-purple-400' },
    { label: 'Средний чек', value: `₽${(avgCheck / 1000).toFixed(1)}к`, change: '-2%', color: 'text-orange-400' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Обзор деятельности</h2>
        <p className="text-sm text-gray-400">Актуальная аналитика вашего бизнеса в реальном времени</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border-white/5 hover:border-blue-500/30 transition-all group cursor-default">
            <div className="text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-widest">{stat.label}</div>
            <div className={`text-3xl font-bold ${stat.color} mb-1 group-hover:scale-105 transition-transform origin-left`}>
              {stat.value}
            </div>
            <div className="text-[10px] text-green-500 font-medium">
              Обновлено сейчас
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-3xl border-white/5 min-h-[300px]">
          <h3 className="text-lg font-semibold mb-6">Динамика по категориям</h3>
          <div className="space-y-4">
            {['Видеокарты', 'Процессоры', 'Сборки'].map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{cat}</span>
                  <span className="text-blue-400 font-bold">{(70 - i * 15)}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${70 - i * 15}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border-white/5">
          <h3 className="text-lg font-semibold mb-6">Последние действия</h3>
          <div className="space-y-4">
            {orders.slice(0, 3).map((o, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Заказ {o.id}</div>
                  <div className="text-[10px] text-gray-500">{o.clientName} • {o.items[0]}</div>
                </div>
                <div className="text-[10px] text-gray-600 italic">Сегодня</div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-xs text-gray-500 text-center py-8 italic">Нет недавних заказов</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMode;
