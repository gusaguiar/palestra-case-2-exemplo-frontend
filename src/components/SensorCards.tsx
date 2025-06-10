
import { Thermometer, Gauge, Clock, Wrench, AlertTriangle } from 'lucide-react';
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
      value: `${data.airTemperature.toFixed(1)} K`,
      icon: Thermometer,
      status: data.airTemperature > 305 ? 'warning' : 'healthy',
      change: '+2.3%'
    },
    {
      title: 'Temperatura do Processo',
      value: `${data.processTemperature.toFixed(1)} K`,
      icon: Thermometer,
      status: data.processTemperature > 315 ? 'critical' : 'healthy',
      change: '+1.8%'
    },
    {
      title: 'Velocidade Rotacional',
      value: `${data.rotationalSpeed.toFixed(0)} rpm`,
      icon: Gauge,
      status: data.rotationalSpeed > 1600 ? 'warning' : 'healthy',
      change: '-0.5%'
    },
    {
      title: 'Torque',
      value: `${data.torque.toFixed(1)} Nm`,
      icon: Wrench,
      status: data.torque > 45 ? 'critical' : 'healthy',
      change: '+3.2%'
    },
    {
      title: 'Desgaste da Ferramenta',
      value: `${data.toolWear.toFixed(0)} min`,
      icon: Clock,
      status: data.toolWear > 200 ? 'critical' : data.toolWear > 150 ? 'warning' : 'healthy',
      change: '+12.1%'
    },
    {
      title: 'Status da Máquina',
      value: data.machineFailure ? 'Falha' : 'Operacional',
      icon: AlertTriangle,
      status: data.machineFailure ? 'critical' : 'healthy',
      change: ''
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sensorConfig.map((sensor, index) => {
        const Icon = sensor.icon;
        return (
          <Card 
            key={index} 
            className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {sensor.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getStatusColor(sensor.status)}`}>
                    {sensor.status === 'healthy' ? 'Normal' : 
                     sensor.status === 'warning' ? 'Atenção' : 'Crítico'}
                  </Badge>
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-slate-800">{sensor.value}</p>
                {sensor.change && (
                  <p className="text-sm text-slate-500">{sensor.change} vs período anterior</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
