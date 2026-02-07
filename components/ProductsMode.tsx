
import React, { useState } from 'react';
import { Product } from '../types';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  isAuthenticated: boolean;
}

const ProductsMode: React.FC<Props> = ({ products, setProducts, isAuthenticated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Видеокарты',
    price: 0,
    stock: 0
  });

  const handleSave = (e: React.FormEvent) => {
    if (!isAuthenticated) return;
    e.preventDefault();
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...editingProduct, ...formData } : p));
    } else {
      const newProduct: Product = {
        id: 'p' + Math.random().toString(36).substr(2, 5),
        ...formData
      };
      setProducts(prev => [...prev, newProduct]);
    }
    closeModal();
  };

  const openModal = (product?: Product) => {
    if (!isAuthenticated) return;
    if (product) {
      setEditingProduct(product);
      setFormData({ name: product.name, category: product.category, price: product.price, stock: product.stock });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: 'Видеокарты', price: 0, stock: 0 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Каталог товаров</h2>
          <p className="text-sm text-gray-400">Управление ассортиментом и ценами</p>
        </div>
        {isAuthenticated && (
          <button 
            onClick={() => openModal()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition-all"
          >
            + Новый товар
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pr-2">
        {products.map(p => (
          <div key={p.id} className="glass p-5 rounded-2xl border-white/5 hover:border-blue-500/20 transition-all flex flex-col group">
            <div className="text-[10px] text-blue-400 font-bold uppercase mb-1">{p.category}</div>
            <h4 className="text-sm font-semibold mb-4 flex-1 group-hover:text-blue-300 transition-colors">{p.name}</h4>
            <div className="flex justify-between items-center mt-auto">
              <div className="text-lg font-bold">₽{p.price.toLocaleString()}</div>
              <div className={`text-[10px] px-2 py-0.5 rounded ${p.stock < 5 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {p.stock} шт
              </div>
            </div>
            {isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-white/5 flex space-x-2">
                <button 
                  onClick={() => openModal(p)}
                  className="flex-1 py-2 rounded-lg bg-white/5 text-[10px] hover:bg-blue-600/20 transition-all"
                >
                  Изменить
                </button>
                <button 
                  onClick={() => setProducts(prev => prev.filter(item => item.id !== p.id))}
                  className="flex-1 py-2 rounded-lg bg-white/5 text-[10px] hover:bg-red-600/20 transition-all text-gray-500 hover:text-red-400"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-dark w-full max-w-md p-8 rounded-3xl border border-white/10 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-6">{editingProduct ? 'Редактировать товар' : 'Новый товар'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Наименование</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Категория</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none appearance-none text-slate-300">
                    <option value="Видеокарты">Видеокарты</option>
                    <option value="Процессоры">Процессоры</option>
                    <option value="Материнские платы">Материнские платы</option>
                    <option value="ОЗУ">ОЗУ</option>
                    <option value="Готовые сборки">Готовые сборки</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Остаток (шт)</label>
                  <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Цена (₽)</label>
                <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none text-xl font-bold" />
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

export default ProductsMode;