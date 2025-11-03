import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/Components/ui/button';

type ArtikelRow = { id: number; date: string; status: 'PUBLISHED' | 'DRAFT'; judul: string; featured: boolean; category: string };

const sample: ArtikelRow[] = [
  { id: 1, date: '12 July 2016', status: 'PUBLISHED', judul: 'Another article', featured: false, category: 'Siete' },
  { id: 2, date: '24 July 2016', status: 'PUBLISHED', judul: 'Some article', featured: true, category: 'Cinco' },
  { id: 3, date: '24 July 2016', status: 'PUBLISHED', judul: 'Some article', featured: true, category: 'Cinco' },
  { id: 4, date: '24 July 2016', status: 'PUBLISHED', judul: 'Some article', featured: true, category: 'Cinco' },
  { id: 5, date: '24 July 2016', status: 'PUBLISHED', judul: 'Some article', featured: true, category: 'Cinco' },
];

const ArtikelAdmin = () => {
  const [rows, setRows] = useState<ArtikelRow[]>(() => {
    try { const raw = localStorage.getItem('admin_artikel'); if (raw) return JSON.parse(raw); } catch {}
    return sample;
  });

  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ date: '', status: 'DRAFT', judul: '', featured: false, category: '' });

  useEffect(() => { try { localStorage.setItem('admin_artikel', JSON.stringify(rows)); } catch {} }, [rows]);

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(r => r.judul.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const visible = filtered.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ date: new Date().toISOString().slice(0,10), status: 'DRAFT', judul: '', featured: false, category: '' });
    setShowForm(true);
    setPage(1);
  };

  const handleDelete = (id: number) => setRows(prev => prev.filter(r => r.id !== id));

  const handleEdit = (row: ArtikelRow) => {
    setEditingId(row.id);
    // try to normalize date to yyyy-mm-dd for input
    let iso = '';
    try { iso = new Date(row.date).toISOString().slice(0,10); } catch { iso = '' }
    setForm({ date: iso || new Date().toISOString().slice(0,10), status: row.status, judul: row.judul, featured: !!row.featured, category: row.category });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    if (!form.judul) {
      alert('Judul harus diisi');
      return;
    }

    if (editingId) {
      setRows(prev => prev.map(r => r.id === editingId ? { ...r, date: form.date, status: form.status as any, judul: form.judul, featured: form.featured, category: form.category } : r));
    } else {
      const newItem: ArtikelRow = { id: Date.now(), date: form.date, status: form.status as any, judul: form.judul, featured: form.featured, category: form.category };
      setRows(prev => [newItem, ...prev]);
      setPage(1);
    }

    // close form
    setShowForm(false);
    setEditingId(null);
    setForm({ date: '', status: 'DRAFT', judul: '', featured: false, category: '' });
  };

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Articles</h1>
          <p className="text-sm text-muted-foreground">All articles in the database.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-purple-600 text-white" onClick={openCreateForm}>+ Add article</Button>
        </div>
      </div>

      <div className="bg-white border rounded-md p-4">
        {showForm && (
          <div className="bg-gray-50 border rounded-md p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">{editingId ? `Mengedit article #${editingId}` : 'Tambah Artikel'}</div>
              {editingId && <div className="text-sm text-muted-foreground">ID: {editingId}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm">Date</label>
                <input type="date" className="w-full border rounded-md p-2" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm">Status</label>
                <select className="w-full border rounded-md p-2" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Featured</label>
                <div className="flex items-center gap-2">
                  <input id="featured" type="checkbox" checked={form.featured} onChange={(e) => setForm(f => ({ ...f, featured: e.target.checked }))} />
                  <label htmlFor="featured">Featured</label>
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="text-sm">Title</label>
                <input className="w-full border rounded-md p-2" value={form.judul} onChange={(e) => setForm(f => ({ ...f, judul: e.target.value }))} />
              </div>
              <div className="md:col-span-3">
                <label className="text-sm">Category</label>
                <input className="w-full border rounded-md p-2" value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setForm({ date: '', status: 'DRAFT', judul: '', featured: false, category: '' }); }}>Cancel</Button>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <label className="text-sm">Show</label>
            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="border rounded-md p-1">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <label className="text-sm">records per page</label>
          </div>

          <div className="flex items-center gap-2">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search:" className="border rounded-md p-1 text-sm" />
          </div>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Title</th>
                <th className="p-2">Featured</th>
                <th className="p-2">Category</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(r => (
                <tr key={r.id} className="border-t even:bg-gray-50">
                  <td className="p-2 align-top">{(() => { try { return new Date(r.date).toLocaleDateString('en-GB'); } catch { return r.date; } })()}</td>
                  <td className="p-2 align-top"><span className="text-sm font-semibold">{r.status}</span></td>
                  <td className="p-2 align-top">{r.judul}</td>
                  <td className="p-2 align-top text-center">{r.featured ? '✓' : ''}</td>
                  <td className="p-2 align-top">{r.category}</td>
                  <td className="p-2 align-top text-right">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(r)}>Edit</Button>
                    <Button size="sm" className="ml-2" onClick={() => handleDelete(r.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={6} className="p-4 text-center text-sm text-muted-foreground">No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">Showing {visible.length} of {filtered.length} records</div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
            <div className="px-2">Page {page} / {totalPages}</div>
            <Button size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtikelAdmin;
