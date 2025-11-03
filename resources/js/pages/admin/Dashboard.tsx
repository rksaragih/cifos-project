import React from 'react';
import { Card } from '@/Components/ui/card';

const Dashboard = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Reservasi</div>
          <div className="text-2xl font-bold mt-2">--</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Menu</div>
          <div className="text-2xl font-bold mt-2">--</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Artikel</div>
          <div className="text-2xl font-bold mt-2">--</div>
        </Card>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-4">Recent reservations (placeholder)</h2>
        <p className="text-sm text-muted-foreground">This area will show recent reservations and quick actions.</p>
      </div>
    </div>
  );
};

export default Dashboard;
