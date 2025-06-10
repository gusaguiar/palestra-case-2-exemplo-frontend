
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
  const timeCounterRef = useRef(0);

  // Função para formatar tempo no eixo X
  const formatTime = (tickItem: string) => {
    if (tickItem === 'Agora') return 'Agora';
    return tickItem;
  };

  // Função para formatar valores do eixo Y com unidades
  const formatTemperature = (value: number) => `${value.toFixed(0)}K`;
  const formatTorque = (value: number) => `${value.toFixed(0)}Nm`;
  const formatSpeed = (value: number) => `${(value/1000).toFixed(1)}k rpm`;

  // Inicializar dados históricos na primeira renderização
  useEffect(() => {
    if (historicalData.length === 0) {
      const initialData: HistoricalDataPoint[] = [];
      
      // Gerar 23 pontos históricos iniciais
      for (let i = 23; i >= 1; i--) {
        const baseTemp = data.processTemperature + (Math.random() - 0.5) * 0.5;
        const baseTorque = data.torque + (Math.random() - 0.5) * 2;
        const baseSpeed = data.rotationalSpeed + (Math.random() - 0.5) * 50;
        
        initialData.push({
          time: `${i}h`,
          temperature: Math.max(307, Math.min(311, baseTemp)),
          torque: Math.max(3, Math.min(70, baseTorque)),
          speed: Math.max(1300, Math.min(3000, baseSpeed)),
          timestamp: Date.now() - (i * 3600000) // 1 hora atrás por ponto
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
      timeCounterRef.current = 0;
    }
  }, [data, historicalData.length]);

  // Adicionar novos pontos quando os dados mudam
  useEffect(() => {
    if (!lastDataRef.current || historicalData.length === 0) return;

    // Verificar se os dados mudaram significativamente
    const hasSignificantChange = 
      Math.abs(data.processTemperature - lastDataRef.current.processTemperature) > 0.1 ||
      Math.abs(data.torque - lastDataRef.current.torque) > 0.5 ||
      Math.abs(data.rotationalSpeed - lastDataRef.current.rotationalSpeed) > 10;

    if (hasSignificantChange) {
      setHistoricalData(prevData => {
        const newData = [...prevData];
        
        // Remover o ponto "Agora" anterior se existir
        if (newData[newData.length - 1]?.time === 'Agora') {
          const lastPoint = newData.pop()!;
          // Converter o último ponto para um ponto histórico
          timeCounterRef.current++;
          newData.push({
            ...lastPoint,
            time: timeCounterRef.current === 1 ? '1min' : `${timeCounterRef.current}min`
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
        
        // Manter apenas os últimos 24 pontos
        return newData.slice(-24);
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
          <span>Últimas 24 horas • Atualização automática</span>
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
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  tickFormatter={formatTime}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 0.5', 'dataMax + 0.5']}
                  tickFormatter={formatTemperature}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#temperatureGradient)" 
                  strokeWidth={2.5}
                  dot={{ fill: '#3b82f6', strokeWidth: 0, r: 2 }}
                  activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: 'white' }}
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
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  tickFormatter={formatTime}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 2', 'dataMax + 2']}
                  tickFormatter={formatTorque}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="torque" 
                  stroke="#7c3aed" 
                  strokeWidth={2.5}
                  dot={{ fill: '#7c3aed', strokeWidth: 0, r: 2 }}
                  activeDot={{ r: 4, stroke: '#7c3aed', strokeWidth: 2, fill: 'white' }}
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
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  tickFormatter={formatTime}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 50', 'dataMax + 50']}
                  tickFormatter={formatSpeed}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="speed" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#speedGradient)" 
                  strokeWidth={2.5}
                  dot={{ fill: '#10b981', strokeWidth: 0, r: 2 }}
                  activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
