
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface MLPredictionProps {
  prediction: {
    probability: number;
    status: 'healthy' | 'warning' | 'critical';
    factors: string[];
  };
}

export const MLPrediction = ({ prediction }: MLPredictionProps) => {
  const getStatusConfig = () => {
    switch (prediction.status) {
      case 'healthy':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200',
          badgeColor: 'bg-green-100 text-green-800',
          message: 'Sistema Operando Normalmente'
        };
      case 'warning':
        return {
          icon: TrendingUp,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200',
          badgeColor: 'bg-yellow-100 text-yellow-800',
          message: 'Atenção: Risco Moderado de Falha'
        };
      case 'critical':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
          badgeColor: 'bg-red-100 text-red-800',
          message: 'Alerta: Alto Risco de Falha'
        };
      default:
        return {
          icon: CheckCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 border-gray-200',
          badgeColor: 'bg-gray-100 text-gray-800',
          message: 'Status Desconhecido'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Card className={`${config.bgColor} border-2 shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon className={`w-8 h-8 ${config.color}`} />
            <div>
              <h3 className="text-xl font-bold text-slate-800">{config.message}</h3>
              <p className="text-sm text-slate-600">Predição ML baseada em dados atuais</p>
            </div>
          </div>
          <Badge className={config.badgeColor}>
            Probabilidade: {(prediction.probability * 100).toFixed(1)}%
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Risco de Falha</span>
              <span>{(prediction.probability * 100).toFixed(1)}%</span>
            </div>
            <Progress 
              value={prediction.probability * 100} 
              className="h-3"
            />
          </div>

          {prediction.factors.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Principais Fatores de Risco:</p>
              <div className="flex flex-wrap gap-2">
                {prediction.factors.map((factor, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
