import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SensorData } from '@/types/sensor';
import { TrendingUp, Activity, Zap } from 'lucide-react';

interface ChartsSectionProps {
  data: SensorData;
}

export const ChartsSection = ({ data }: ChartsSectionProps) => {
  const generateHistoricalData = (currentValue: number, label: string, trend: 'stable' | 'increasing' | 'decreasing' = 'stable') => {
    const data = [];
    let baseValue = currentValue;
    
    for (let i = 23; i >= 0; i--) {
      if (trend === 'increasing') {
        baseValue = currentValue - (i * 0.05);
      } else if (trend === 'decreasing') {
        baseValue = currentValue + (i * 0.03);
      }
      
      const variance = baseValue * 0.02;
      const value = baseValue + (Math.random() - 0.5) * variance;
      
      data.push({
        time: i === 0 ? 'Agora' : `${i}h`,
        value: Math.max(0, value),
        [label]: Math.max(0, value)
      });
    }
    return data.reverse();
  };

  const temperatureData = generateHistoricalData(data.processTemperature, 'temperature', 'stable');
  const torqueData = generateHistoricalData(data.torque, 'torque', 'stable');
  const speedData = generateHistoricalData(data.rotationalSpeed, 'speed', 'stable');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-semibold text-foreground">{`${label}`}</p>
          <p className="text-sm text-primary font-medium">
            {`${payload[0].value.toFixed(1)} ${payload[0].name === 'temperature' ? 'K' : payload[0].name === 'speed' ? 'rpm' : 'Nm'}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Tendências Históricas</h2>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Activity className="w-4 h-4" />
          <span>Últimas 24 horas • Atualização automática</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Temperature Chart */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-ocean/10 via-white to-blue-ocean/5 border border-blue-ocean/20 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-ocean/20">
                  <TrendingUp className="w-4 h-4 text-blue-ocean" />
                </div>
                <span>Temperatura do Processo</span>
              </CardTitle>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Atual</p>
                <p className="text-sm font-bold text-blue-ocean">{data.processTemperature.toFixed(1)} K</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={temperatureData}>
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--blue-ocean))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--blue-ocean))" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="hsl(var(--blue-ocean))" 
                  fillOpacity={1} 
                  fill="url(#temperatureGradient)" 
                  strokeWidth={2.5}
                  dot={{ fill: 'hsl(var(--blue-ocean))', strokeWidth: 0, r: 2 }}
                  activeDot={{ r: 4, stroke: 'hsl(var(--blue-ocean))', strokeWidth: 2, fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Torque Chart */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-pale/30 via-white to-green-pale/10 border border-green-pale/40 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-green-pale/50">
                  <Zap className="w-4 h-4 text-navy-dark" />
                </div>
                <span>Torque</span>
              </CardTitle>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Atual</p>
                <p className="text-sm font-bold text-navy-dark">{data.torque.toFixed(1)} Nm</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={torqueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="torque" 
                  stroke="hsl(var(--navy-dark))" 
                  strokeWidth={2.5}
                  dot={{ fill: 'hsl(var(--navy-dark))', strokeWidth: 0, r: 2 }}
                  activeDot={{ r: 4, stroke: 'hsl(var(--navy-dark))', strokeWidth: 2, fill: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Speed Chart */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-teal-bright/10 via-white to-teal-bright/5 border border-teal-bright/20 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-foreground flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-teal-bright/20">
                  <Activity className="w-4 h-4 text-teal-bright" />
                </div>
                <span>Velocidade Rotacional</span>
              </CardTitle>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Atual</p>
                <p className="text-sm font-bold text-teal-bright">{data.rotationalSpeed.toFixed(0)} rpm</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={speedData}>
                <defs>
                  <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--teal-bright))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--teal-bright))" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 100', 'dataMax + 100']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="hsl(var(--teal-bright))" 
                  fillOpacity={1} 
                  fill="url(#speedGradient)" 
                  strokeWidth={2.5}
                  dot={{ fill: 'hsl(var(--teal-bright))', strokeWidth: 0, r: 2 }}
                  activeDot={{ r: 4, stroke: 'hsl(var(--teal-bright))', strokeWidth: 2, fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
