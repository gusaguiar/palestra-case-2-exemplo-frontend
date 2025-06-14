
import { Thermometer, Gauge, Wrench, Heart, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SensorData } from '@/types/sensor';

interface SensorCardsProps {
  data: SensorData;
}

export const SensorCards = ({ data }: SensorCardsProps) => {
  const sensorConfig = [
    {
      title: 'Temperatura do Ar',
      value: `${data.airTemperature.toFixed(1)}`,
      unit: 'K',
      icon: Thermometer,
      status: data.airTemperature > 299.5 ? 'warning' : 'healthy',
      change: Math.random() > 0.5 ? '+0.3%' : '-0.1%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
    },
    {
      title: 'Temperatura Processo',
      value: `${data.processTemperature.toFixed(1)}`,
      unit: 'K',
      icon: Thermometer,
      status: data.processTemperature > 309.5 ? 'critical' : data.processTemperature > 309.0 ? 'warning' : 'healthy',
      change: Math.random() > 0.5 ? '+0.2%' : '-0.1%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
    },
    {
      title: 'Velocidade Rotacional',
      value: `${data.rotationalSpeed.toFixed(0)}`,
      unit: 'rpm',
      icon: Gauge,
      status: data.rotationalSpeed > 2000 ? 'critical' : data.rotationalSpeed > 1600 ? 'warning' : 'healthy',
      change: Math.random() > 0.5 ? '-0.5%' : '+1.2%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
    },
    {
      title: 'Torque',
      value: `${data.torque.toFixed(1)}`,
      unit: 'Nm',
      icon: Wrench,
      status: data.torque > 60 ? 'critical' : 
              data.torque > 50 ? 'warning' : 
              data.torque < 8 ? 'critical' :
              data.torque < 15 ? 'warning' : 'healthy',
      change: Math.random() > 0.5 ? '+1.8%' : '-0.8%',
      trend: Math.random() > 0.5 ? 'up' : 'down',
    },
    {
      title: 'Status da Máquina',
      value: data.machineStatus === 'healthy' ? 'Saudável' : 
             data.machineStatus === 'warning' ? 'Atenção' : 'Crítico',
      unit: '',
      icon: Heart,
      status: data.machineStatus,
      change: '',
      trend: data.machineStatus === 'critical' ? 'down' : data.machineStatus === 'warning' ? 'down' : 'up',
    }
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'healthy':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          text: 'Normal',
        };
      case 'warning':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          text: 'Atenção',
        };
      case 'critical':
        return {
          badge: 'bg-red-50 text-red-700 border-red-200',
          text: 'Crítico',
        };
      default:
        return {
          badge: 'bg-slate-50 text-slate-700 border-slate-200',
          text: 'Indefinido',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
      {sensorConfig.map((sensor, index) => {
        const Icon = sensor.icon;
        const TrendIcon = sensor.trend === 'up' ? TrendingUp : TrendingDown;
        const statusConfig = getStatusConfig(sensor.status);
        
        return (
          <Card 
            key={index} 
            className="group relative overflow-hidden bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border border-slate-200"
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-700 group-hover:text-slate-800 transition-colors">
                  {sensor.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-[10px] font-medium ${statusConfig.badge} shadow-sm`}>
                    {statusConfig.text}
                  </Badge>
                  <Icon className="w-4 h-4 text-slate-500 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">{sensor.value}</span>
                  <span className="text-sm font-medium text-slate-600">{sensor.unit}</span>
                </div>
                {sensor.change && (
                  <div className="flex items-center space-x-1">
                    <TrendIcon className={`w-3 h-3 ${sensor.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`} />
                    <span className={`text-xs font-medium ${sensor.trend === 'up' ? 'text-emerald-700' : 'text-red-600'}`}>
                      {sensor.change}
                    </span>
                    <span className="text-xs text-slate-500">vs 24h</span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Card>
        );
      })}
    </div>
  );
};
