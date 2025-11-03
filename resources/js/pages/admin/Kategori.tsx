import React, { useEffect, useState } from 'react';
import { Button } from '@/Components/ui/button';

const KategoriAdmin = () => {
  const [items, setItems] = useState<string[]>(() => {
    try { const raw = localStorage.getItem('admin_kategori'); if (raw) return JSON.parse(raw); } catch {}
    return ['Makanan', 'Minuman'];
  });

  useEffect(() => { try { localStorage.setItem('admin_kategori', JSON.stringify(items)); } catch {} }, [items]);

  const add = () => setItems(prev => [...prev, `Kategori ${prev.length + 1}`]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Kategori</h1>
          <p className="text-sm text-muted-foreground">Daftar kategori menu</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={add}>Tambah</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="bg-white border rounded-md overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((k, idx) => (
              <tr key={idx} className="border-t even:bg-gray-50">
                <td className="p-3">{idx + 1}</td>
                <td className="p-3">{k}</td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => { const name = prompt('Edit kategori', k); if (name) setItems(prev => prev.map((it, i) => i === idx ? name : it)); }}>Edit</Button>
                  <Button size="sm" className="ml-2" onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KategoriAdmin;
