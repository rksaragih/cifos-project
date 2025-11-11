import React, { useEffect, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { useToast } from '@/hooks/use-toast';

type ReservasiRow = {
  id: string;
  kode: string;
  nomor_wa: string;
  jumlah: number;
  tanggal: string; // ISO
  jam: string;
  total_dp?: number;
  status_dp?: string;
  status_reservasi?: string;
};

const sample: ReservasiRow[] = [
  { id: '1', kode: 'R-001', nomor_wa: '081234567890', jumlah: 4, tanggal: '2025-11-05', jam: '19:00', total_dp: 50000, status_dp: 'lunas', status_reservasi: 'konfirmasi' },
  { id: '2', kode: 'R-002', nomor_wa: '081298765432', jumlah: 2, tanggal: '2025-11-07', jam: '12:00', total_dp: 0, status_dp: 'belum', status_reservasi: 'pending' },
];

const ReservasiAdmin = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<ReservasiRow[]>(() => {
    try {
      const raw = localStorage.getItem('admin_reservasi');
      if (raw) return JSON.parse(raw);
    } catch {}
    return sample;
  });

  useEffect(() => {
    try { localStorage.setItem('admin_reservasi', JSON.stringify(rows)); } catch {}
  }, [rows]);

  const handleDelete = (id: string) => {
    setRows((r) => r.filter(x => x.id !== id));
    toast({ title: 'Deleted', description: 'Reservation removed' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Daftar Reservasi</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-white border rounded-md px-2 py-1">
            <input placeholder="Search..." className="outline-none text-sm" onChange={(e) => { /* simple UI-only search can be added */ }} />
          </div>
          <Button className="bg-green-500 text-white hover:bg-green-600">+ Tambah</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="p-3 text-left">Order No</th>
              <th className="p-3 text-left">Nomor WA</th>
              <th className="p-3 text-left">Jumlah</th>
              <th className="p-3 text-left">Tanggal & Jam</th>
              <th className="p-3 text-left">Total DP</th>
              <th className="p-3 text-left">Status DP</th>
              <th className="p-3 text-left">Status Reservasi</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t even:bg-gray-50">
                <td className="p-3">{r.kode}</td>
                <td className="p-3">{r.nomor_wa}</td>
                <td className="p-3">{r.jumlah}</td>
                <td className="p-3">{r.tanggal} • {r.jam}</td>
                <td className="p-3">Rp {Number(r.total_dp || 0).toLocaleString('id-ID')}</td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${r.status_dp === 'lunas' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{r.status_dp}</span>
                </td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${r.status_reservasi === 'konfirmasi' ? 'bg-green-100 text-green-800' : r.status_reservasi === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{r.status_reservasi}</span>
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => toast({ title: 'View', description: 'View action (UI-only)' })}>View</Button>
                  <Button size="sm" className="ml-2" onClick={() => handleDelete(r.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 bg-gray-50 text-sm text-muted-foreground">Showing {rows.length} entries</div>
      </div>
    </div>
  );
};

export default ReservasiAdmin;
