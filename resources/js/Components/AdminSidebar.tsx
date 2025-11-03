import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, FileText, Grid, List, Tag } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: Grid },
    { to: '/admin/reservasi', label: 'Reservasi', icon: List },
    { to: '/admin/menu', label: 'Menu', icon: Layout },
    { to: '/admin/kategori', label: 'Kategori', icon: Tag },
    { to: '/admin/artikel', label: 'Artikel', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white border-r min-h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-bold">K</div>
          <div>
            <div className="text-sm font-semibold">KOPIKU</div>
            <div className="text-xs text-muted-foreground">Dashboard</div>
          </div>
        </div>

        <nav className="space-y-1">
          {links.map((l) => {
            const Icon = l.icon as any;
            const active = location.pathname === l.to || (l.to === '/admin' && location.pathname === '/admin');
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
