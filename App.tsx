
import React, { useState } from 'react';
import { AppMode, Client, Product, Order } from './types';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import DashboardMode from './components/DashboardMode';
import ClientsMode from './components/ClientsMode';
import ProductsMode from './components/ProductsMode';
import OrdersMode from './components/OrdersMode';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem('crm_auth') === 'true'
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.DASHBOARD);
  
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Иванов Иван Сергеевич', email: 'ivanov@mail.ru', phone: '+7 (900) 123-45-67', totalOrders: 5, status: 'active' },
    { id: '2', name: 'Петров Петр Алексеевич', email: 'petrov@gmail.com', phone: '+7 (911) 222-33-44', totalOrders: 1, status: 'lead' },
    { id: '3', name: 'Сидоров Алексей Викторович', email: 'sidor@yandex.ru', phone: '+7 (922) 555-66-77', totalOrders: 12, status: 'active' },
    { id: '4', name: 'ООО "ГеймингХаус"', email: 'corp@gaminghouse.ru', phone: '+7 (495) 777-00-11', totalOrders: 2, status: 'active' },
    { id: '5', name: 'Елена прекрасная', email: 'elena@gmail.com', phone: '+7 (955) 111-22-33', totalOrders: 0, status: 'lead' },
    { id: '6', name: 'Дмитрий Волков', email: 'volkov_d@bk.ru', phone: '+7 (999) 000-01-02', totalOrders: 3, status: 'inactive' },
    { id: '7', name: 'Мария Кузнецова', email: 'masha_k@mail.ru', phone: '+7 (905) 555-44-33', totalOrders: 8, status: 'active' },
    { id: '8', name: 'Игорь Техноблогер', email: 'tech@youtube.com', phone: '+7 (901) 999-88-77', totalOrders: 1, status: 'lead' },
  ]);

  const [products, setProducts] = useState<Product[]>([
    { id: 'p1', name: 'NVIDIA RTX 4090 24GB Rog Strix', category: 'Видеокарты', price: 215000, stock: 2 },
    { id: 'p2', name: 'Intel Core i9-14900K Box', category: 'Процессоры', price: 68000, stock: 5 },
    { id: 'p3', name: 'AMD Ryzen 9 7950X3D', category: 'Процессоры', price: 72000, stock: 3 },
    { id: 'p4', name: 'ASUS ROG Z790 HERO', category: 'Материнские платы', price: 58000, stock: 4 },
    { id: 'p5', name: 'Kingston Fury DDR5 64GB (2x32) 6000MHz', category: 'ОЗУ', price: 24500, stock: 12 },
    { id: 'p6', name: 'Samsung 990 Pro 2TB NVMe', category: 'Накопители', price: 19800, stock: 15 },
    { id: 'p7', name: 'be quiet! Dark Power 13 1000W', category: 'БП', price: 22000, stock: 6 },
    { id: 'p8', name: 'Lian Li O11 Dynamic EVO White', category: 'Корпуса', price: 18500, stock: 8 },
    { id: 'p9', name: 'NVIDIA RTX 4080 Super Founders Edition', category: 'Видеокарты', price: 135000, stock: 4 },
    { id: 'p10', name: 'DeepCool LS720 ARGB 360mm', category: 'Охлаждение', price: 11200, stock: 10 },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD-101', clientId: '1', clientName: 'Иванов Иван', items: ['RTX 4090'], total: 215000, status: 'Completed', date: '2025-05-10' },
    { id: 'ORD-102', clientId: '3', clientName: 'Сидоров Алексей', items: ['i9-14900K', 'Z790 HERO'], total: 126000, status: 'Shipped', date: '2025-05-12' },
    { id: 'ORD-103', clientId: '4', clientName: 'ГеймингХаус', items: ['5x RTX 4080 Super'], total: 675000, status: 'Assembling', date: '2025-05-14' },
  ]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('crm_auth', 'true');
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('crm_auth');
  };

  const renderContent = () => {
    switch (activeMode) {
      case AppMode.DASHBOARD: 
        return <DashboardMode clients={clients} products={products} orders={orders} />;
      case AppMode.CLIENTS: 
        return <ClientsMode clients={clients} setClients={setClients} isAuthenticated={isAuthenticated} />;
      case AppMode.PRODUCTS: 
        return <ProductsMode products={products} setProducts={setProducts} isAuthenticated={isAuthenticated} />;
      case AppMode.ORDERS: 
        return <OrdersMode orders={orders} setOrders={setOrders} clients={clients} products={products} isAuthenticated={isAuthenticated} />;
      default: 
        return <DashboardMode clients={clients} products={products} orders={orders} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0f18] text-gray-100 overflow-hidden text-sm">
      <Sidebar 
        activeMode={activeMode} 
        onModeChange={setActiveMode} 
        onLogout={handleLogout} 
        isAuthenticated={isAuthenticated}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-900 to-[#0a0f18]">
        {renderContent()}
      </main>

      {isLoginModalOpen && (
        <Login 
          onLogin={handleLogin} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
