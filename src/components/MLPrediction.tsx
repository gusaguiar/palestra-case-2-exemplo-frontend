
import { AlertTriangle, CheckCircle, TrendingUp, Brain, Zap } from 'lucide-react';
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
          color: 'text-green-light',
          bgGradient: 'from-green-light/10 via-white to-green-light/5',
          borderColor: 'border-green-light/30',
          badgeColor: 'bg-green-light/20 text-navy-dark border-green-light/30',
          message: 'Sistema Operando Normalmente',
          description: 'Todas as condições dentro dos parâmetros esperados'
        };
      case 'warning':
        return {
          icon: TrendingUp,
          color: 'text-teal-bright',
          bgGradient: 'from-teal-bright/10 via-white to-teal-bright/5',
          borderColor: 'border-teal-bright/30',
          badgeColor: 'bg-teal-bright/20 text-navy-dark border-teal-bright/30',
          message: 'Atenção: Monitoramento Intensivo',
          description: 'Detectadas variações que podem indicar problemas futuros'
        };
      case 'critical':
        return {
          icon: AlertTriangle,
          color: 'text-red-600',
          bgGradient: 'from-red-50/70 via-white to-red-50/30',
          borderColor: 'border-red-200/60',
          badgeColor: 'bg-red-50 text-red-800 border-red-200/60',
          message: 'Alerta: Intervenção Recomendada',
          description: 'Alta probabilidade de falha detectada pelo modelo preditivo'
        };
      default:
        return {
          icon: CheckCircle,
          color: 'text-muted-foreground',
          bgGradient: 'from-muted/10 via-white to-muted/5',
          borderColor: 'border-muted/30',
          badgeColor: 'bg-muted/20 text-foreground border-muted/30',
          message: 'Status Indeterminado',
          description: 'Aguardando dados suficientes para análise'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;
  const probabilityPercent = prediction.probability * 100;

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-r ${config.bgGradient} backdrop-blur-sm border-2 ${config.borderColor} shadow-xl`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(69,196,176,0.15),transparent_50%)] opacity-30" />
      
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`p-3 rounded-2xl bg-card/90 ${config.color} shadow-lg`}>
                <Icon className="w-6 h-6" />
              </div>
              <Brain className="absolute -top-1 -right-1 w-4 h-4 text-blue-ocean bg-card rounded-full p-0.5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">{config.message}</h2>
              <p className="text-sm text-muted-foreground max-w-md">{config.description}</p>
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <Badge className={`${config.badgeColor} shadow-sm font-semibold px-3 py-1`}>
              <Zap className="w-3 h-3 mr-1" />
              {probabilityPercent.toFixed(1)}% risco
            </Badge>
            <p className="text-xs text-muted-foreground font-medium">Análise ML em tempo real</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-foreground">Probabilidade de Falha</span>
              <span className="text-sm font-bold text-foreground">{probabilityPercent.toFixed(1)}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={probabilityPercent} 
                className="h-2 bg-muted/30"
              />
              <div 
                className="absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r from-green-light via-teal-bright to-red-500 transition-all duration-500"
                style={{ width: `${probabilityPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>Baixo Risco</span>
              <span>Risco Moderado</span>
              <span>Alto Risco</span>
            </div>
          </div>

          {prediction.factors.length > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-semibold text-foreground mb-3">Principais Indicadores de Risco:</p>
              <div className="flex flex-wrap gap-2">
                {prediction.factors.map((factor, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs font-medium bg-card/60 border-border text-foreground hover:bg-card/80 transition-colors"
                  >
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
