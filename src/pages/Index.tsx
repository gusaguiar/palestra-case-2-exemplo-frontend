
import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { SensorCards } from '@/components/SensorCards';
import { ChartsSection } from '@/components/ChartsSection';
import { MLPrediction } from '@/components/MLPrediction';
import { NotificationsSidebar } from '@/components/NotificationsSidebar';
import { useSensorData } from '@/hooks/useSensorData';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sensorData, mlPrediction, notifications } = useSensorData();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <DashboardHeader 
        onNotificationsClick={() => setSidebarOpen(true)}
        notificationCount={notifications.length}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* ML Prediction Banner */}
        <MLPrediction prediction={mlPrediction} />

        {/* Sensor Cards Grid */}
        <SensorCards data={sensorData} />

        {/* Charts Section */}
        <ChartsSection data={sensorData} />
      </main>

      {/* Notifications Sidebar */}
      <NotificationsSidebar 
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        notifications={notifications}
      />
    </div>
  );
};

export default Index;
