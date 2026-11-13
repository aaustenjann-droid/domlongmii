import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../store';
import { Trash2, Edit2, Plus } from 'lucide-react';

export default function ProductManager() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [pricePerKg, setPricePerKg] = useState<number | ''>('');
  const [pricePerTon, setPricePerTon] = useState<number | ''>('');

  const handlePricePerTonChange = (val: string) => {
    const num = val ? Number(val) : '';
    setPricePerTon(num);
    if (num !== '') {
      setPricePerKg(num / 1000);
    } else {
      setPricePerKg('');
    }
  };

  const handlePricePerKgChange = (val: string) => {
    const num = val ? Number(val) : '';
    setPricePerKg(num);
    if (num !== '') {
      setPricePerTon(num * 1000);
    } else {
      setPricePerTon('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || pricePerKg === '') return;

    if (editingId) {
      updateProduct({ id: editingId, name, unitPrice: Number(pricePerKg) });
      setEditingId(null);
    } else {
      addProduct({ name, unitPrice: Number(pricePerKg) });
    }
    setName('');
    setPricePerKg('');
    setPricePerTon('');
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPricePerKg(product.unitPrice);
    setPricePerTon(product.unitPrice * 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-khmer">
      <h2 className="text-2xl font-bold text-slate-900">គ្រប់គ្រងប្រភេទដំឡូង (Manage Products)</h2>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">ឈ្មោះប្រភេទ (Product Name)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white shadow-2xs outline-none text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="ឧ. ដំឡូងមីស្រស់"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">តម្លៃ/គីឡូ (Price/Kg - KHR)</label>
            <input
              type="number"
              value={pricePerKg}
              onChange={(e) => handlePricePerKgChange(e.target.value)}
              className="w-full px-3.5 py-2 font-mono font-medium border border-slate-300 rounded-xl bg-white shadow-2xs outline-none text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="260"
              required
              min="0"
              step="any"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">តម្លៃ/តោន (Price/Ton - KHR)</label>
            <input
              type="number"
              value={pricePerTon}
              onChange={(e) => handlePricePerTonChange(e.target.value)}
              className="w-full px-3.5 py-2 font-mono font-medium border border-slate-300 rounded-xl bg-white shadow-2xs outline-none text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              placeholder="260000"
              required
              min="0"
              step="any"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
            >
              {editingId ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-4 h-4" />}
              <span>{editingId ? 'កែប្រែ (Update)' : 'បន្ថែមមុខទំនិញ (Add Product)'}</span>
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setName('');
                  setPricePerKg('');
                  setPricePerTon('');
                }}
                className="h-10 px-4 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              >
                បោះបង់ (Cancel)
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* MOBILE PRODUCT CARDS */}
        <div className="block sm:hidden divide-y divide-slate-100">
          {products.map((product) => (
            <div key={product.id} className="p-4 space-y-3 bg-white">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900">{product.name}</h4>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="p-1.5 text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProduct(product.id)}
                    className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block uppercase">តម្លៃក្នុង ១គីឡូ</span>
                  <span className="font-semibold text-slate-900">
                    {new Intl.NumberFormat('km-KH', { style: 'currency', currency: 'KHR' }).format(product.unitPrice)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-sans block uppercase">តម្លៃក្នុង ១តោន</span>
                  <span className="font-semibold text-slate-900">
                    {new Intl.NumberFormat('km-KH', { style: 'currency', currency: 'KHR' }).format(product.unitPrice * 1000)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-xs font-semibold">
              មិនទាន់មានទំនិញនៅឡើយទេ
            </div>
          )}
        </div>

        {/* TABLE VIEW */}
        <div className="hidden sm:block overflow-x-hidden w-full">
          <table className="w-full text-left border-collapse text-xs font-khmer table-fixed">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider">
                <th className="p-3 w-[36%] truncate">ឈ្មោះប្រភេទ (Name)</th>
                <th className="p-3 w-[26%] truncate">តម្លៃ/គីឡូ (Price/Kg)</th>
                <th className="p-3 w-[26%] truncate">តម្លៃ/តោន (Price/Ton)</th>
                <th className="p-3 w-[12%] text-center truncate">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors font-medium">
                  <td className="p-3 text-slate-900 font-semibold truncate" title={product.name}>{product.name}</td>
                  <td className="p-3 text-slate-700 font-mono font-semibold truncate">
                    {new Intl.NumberFormat('km-KH', { style: 'currency', currency: 'KHR' }).format(product.unitPrice)}
                  </td>
                  <td className="p-3 text-slate-700 font-mono font-semibold truncate">
                    {new Intl.NumberFormat('km-KH', { style: 'currency', currency: 'KHR' }).format(product.unitPrice * 1000)}
                  </td>
                  <td className="p-3 text-center truncate">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-all cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400 font-semibold">
                    មិនទាន់មានទិន្នន័យ (No products found)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
