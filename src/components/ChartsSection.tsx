
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SensorData } from '@/types/sensor';
import { TrendingUp, Activity, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface ChartsSectionProps {
  data: SensorData;
}

interface HistoricalDataPoint {
  time: string;
  temperature: number;
  torque: number;
  speed: number;
  timestamp: number;
}

export const ChartsSection = ({ data }: ChartsSectionProps) => {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const lastDataRef = useRef<SensorData | null>(null);
  const intervalCountRef = useRef(0);

  // Função para formatar tempo no eixo X (a cada 30s)
  const formatTime = (tickItem: string) => {
    if (tickItem === 'Agora') return 'Agora';
    if (tickItem.includes('min')) {
      const minutes = parseInt(tickItem);
      return `${minutes}m`;
    }
    if (tickItem.includes('s')) {
      const seconds = parseInt(tickItem);
      return `${seconds}s`;
    }
    return tickItem;
  };

  // Função para formatar valores do eixo Y com unidades
  const formatTemperature = (value: number) => `${value.toFixed(1)}K`;
  const formatTorque = (value: number) => `${value.toFixed(1)}Nm`;
  const formatSpeed = (value: number) => `${(value/1000).toFixed(1)}k`;

  // Inicializar dados históricos na primeira renderização (15 minutos = 30 pontos a cada 30s)
  useEffect(() => {
    if (historicalData.length === 0) {
      const initialData: HistoricalDataPoint[] = [];
      
      // Gerar 29 pontos históricos iniciais (14.5 minutos)
      for (let i = 29; i >= 1; i--) {
        const seconds = i * 30;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        let timeLabel;
        if (minutes > 0 && remainingSeconds === 0) {
          timeLabel = `${minutes}min`;
        } else if (minutes > 0) {
          timeLabel = `${minutes}m${remainingSeconds}s`;
        } else {
          timeLabel = `${remainingSeconds}s`;
        }
        
        const baseTemp = data.processTemperature + (Math.random() - 0.5) * 0.3;
        const baseTorque = data.torque + (Math.random() - 0.5) * 1.5;
        const baseSpeed = data.rotationalSpeed + (Math.random() - 0.5) * 30;
        
        initialData.push({
          time: timeLabel,
          temperature: Math.max(307.5, Math.min(310.5, baseTemp)),
          torque: Math.max(5, Math.min(65, baseTorque)),
          speed: Math.max(1350, Math.min(2800, baseSpeed)),
          timestamp: Date.now() - (seconds * 1000)
        });
      }
      
      // Adicionar ponto atual
      initialData.push({
        time: 'Agora',
        temperature: data.processTemperature,
        torque: data.torque,
        speed: data.rotationalSpeed,
        timestamp: Date.now()
      });
      
      setHistoricalData(initialData);
      lastDataRef.current = data;
      intervalCountRef.current = 0;
    }
  }, [data, historicalData.length]);

  // Adicionar novos pontos a cada mudança significativa nos dados
  useEffect(() => {
    if (!lastDataRef.current || historicalData.length === 0) return;

    // Verificar se os dados mudaram significativamente
    const hasSignificantChange = 
      Math.abs(data.processTemperature - lastDataRef.current.processTemperature) > 0.05 ||
      Math.abs(data.torque - lastDataRef.current.torque) > 0.3 ||
      Math.abs(data.rotationalSpeed - lastDataRef.current.rotationalSpeed) > 5;

    if (hasSignificantChange) {
      setHistoricalData(prevData => {
        const newData = [...prevData];
        
        // Remover o ponto "Agora" anterior se existir
        if (newData[newData.length - 1]?.time === 'Agora') {
          const lastPoint = newData.pop()!;
          // Converter o último ponto para um ponto histórico
          intervalCountRef.current++;
          const seconds = intervalCountRef.current * 30;
          
          let timeLabel;
          if (seconds < 60) {
            timeLabel = `${seconds}s`;
          } else {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            if (remainingSeconds === 0) {
              timeLabel = `${minutes}min`;
            } else {
              timeLabel = `${minutes}m${remainingSeconds}s`;
            }
          }
          
          newData.push({
            ...lastPoint,
            time: timeLabel
          });
        }
        
        // Adicionar novo ponto atual
        newData.push({
          time: 'Agora',
          temperature: data.processTemperature,
          torque: data.torque,
          speed: data.rotationalSpeed,
          timestamp: Date.now()
        });
        
        // Manter apenas os últimos 30 pontos (15 minutos)
        return newData.slice(-30);
      });
      
      lastDataRef.current = data;
    }
  }, [data, historicalData.length]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataKey = payload[0].dataKey;
      let unit = '';
      let value = payload[0].value;
      
      if (dataKey === 'temperature') {
        unit = 'K';
        value = value.toFixed(1);
      } else if (dataKey === 'torque') {
        unit = 'Nm';
        value = value.toFixed(1);
      } else if (dataKey === 'speed') {
        unit = 'rpm';
        value = value.toFixed(0);
      }
      
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="text-sm text-blue-600 font-medium">
            {`${value} ${unit}`}
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
          <span>Últimos 15 minutos • Atualização a cada 30s</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Temperature Chart */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 border border-blue-200/50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-blue-100/80">
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
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={9} 
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                  tickFormatter={formatTime}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 0.2', 'dataMax + 0.2']}
                  tickFormatter={formatTemperature}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#temperatureGradient)" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 0, r: 1.5 }}
                  activeDot={{ r: 3, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Torque Chart */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50/70 via-white to-violet-50/30 border border-violet-200/50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-violet-100/80">
                  <Zap className="w-4 h-4 text-violet-600" />
                </div>
                <span>Torque</span>
              </CardTitle>
              <div className="text-right">
                <p className="text-xs text-slate-500">Atual</p>
                <p className="text-sm font-bold text-violet-600">{data.torque.toFixed(1)} Nm</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                  tickFormatter={formatTime}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 1', 'dataMax + 1']}
                  tickFormatter={formatTorque}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="torque" 
                  stroke="#7c3aed" 
                  strokeWidth={2}
                  dot={{ fill: '#7c3aed', strokeWidth: 0, r: 1.5 }}
                  activeDot={{ r: 3, stroke: '#7c3aed', strokeWidth: 2, fill: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Speed Chart */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 border border-emerald-200/50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-100/80">
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
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                  tickFormatter={formatTime}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 25', 'dataMax + 25']}
                  tickFormatter={formatSpeed}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#speedGradient)" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 0, r: 1.5 }}
                  activeDot={{ r: 3, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
