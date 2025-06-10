import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SensorData } from '@/types/sensor';
import { TrendingUp, Activity, Zap, Clock } from 'lucide-react';

interface ChartsSectionProps {
  data: SensorData;
}

export const ChartsSection = ({ data }: ChartsSectionProps) => {
  // Generate more realistic historical data with trends
  const generateHistoricalData = (currentValue: number, label: string, trend: 'stable' | 'increasing' | 'decreasing' = 'stable') => {
    const data = [];
    let baseValue = currentValue;
    
    for (let i = 23; i >= 0; i--) {
      if (trend === 'increasing') {
        baseValue = currentValue - (i * 0.1);
      } else if (trend === 'decreasing') {
        baseValue = currentValue + (i * 0.08);
      }
      
      const variance = baseValue * 0.05;
      const value = baseValue + (Math.random() - 0.5) * variance;
      
      data.push({
        time: i === 0 ? 'Agora' : `${i}h`,
        value: Math.max(0, value),
        [label]: Math.max(0, value)
      });
    }
    return data.reverse();
  };

  const temperatureData = generateHistoricalData(data.processTemperature, 'temperature', 'increasing');
  const torqueData = generateHistoricalData(data.torque, 'torque', 'stable');
  const speedData = generateHistoricalData(data.rotationalSpeed, 'speed', 'stable');
  const wearData = generateHistoricalData(data.toolWear, 'wear', 'increasing');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="text-sm font-semibold text-slate-900">{`${label}`}</p>
          <p className="text-sm text-blue-600 font-medium">
            {`${payload[0].value.toFixed(1)} ${payload[0].name === 'temperature' ? 'K' : payload[0].name === 'speed' ? 'rpm' : payload[0].name === 'torque' ? 'Nm' : 'min'}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Tendências Históricas</h2>
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Activity className="w-4 h-4" />
          <span>Últimas 24 horas • Atualização automática</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 border border-blue-200/40 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-100">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <span>Temperatura do Processo</span>
              </CardTitle>
              <div className="text-right">
                <p className="text-xs text-slate-500">Atual</p>
                <p className="text-sm font-bold text-blue-600">{data.processTemperature.toFixed(1)} K</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={temperatureData}>
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#temperatureGradient)" 
                  strokeWidth={2.5}
                  dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Torque Chart */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 border border-amber-200/40 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-100">
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <span>Torque</span>
              </CardTitle>
              <div className="text-right">
                <p className="text-xs text-slate-500">Atual</p>
                <p className="text-sm font-bold text-amber-600">{data.torque.toFixed(1)} Nm</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={torqueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="torque" 
                  stroke="#f59e0b" 
                  strokeWidth={2.5}
                  dot={{ fill: '#f59e0b', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 4, stroke: '#f59e0b', strokeWidth: 2, fill: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Speed Chart */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 border border-emerald-200/40 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-100">
                  <Activity className="w-4 h-4 text-emerald-600" />
                </div>
                <span>Velocidade Rotacional</span>
              </CardTitle>
              <div className="text-right">
                <p className="text-xs text-slate-500">Atual</p>
                <p className="text-sm font-bold text-emerald-600">{data.rotationalSpeed.toFixed(0)} rpm</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={speedData}>
                <defs>
                  <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 20', 'dataMax + 20']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#speedGradient)" 
                  strokeWidth={2.5}
                  dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tool Wear Chart */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-red-50/50 via-white to-red-50/30 border border-red-200/40 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-red-100">
                  <Clock className="w-4 h-4 text-red-600" />
                </div>
                <span>Desgaste da Ferramenta</span>
              </CardTitle>
              <div className="text-right">
                <p className="text-xs text-slate-500">Atual</p>
                <p className="text-sm font-bold text-red-600">{data.toolWear.toFixed(0)} min</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={wearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 'dataMax + 10']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="wear" 
                  stroke="#ef4444" 
                  strokeWidth={2.5}
                  dot={{ fill: '#ef4444', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 4, stroke: '#ef4444', strokeWidth: 2, fill: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
