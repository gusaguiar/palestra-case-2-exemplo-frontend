
import { useState, useEffect } from 'react';
import { SensorData, MLPrediction, Notification } from '@/types/sensor';

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    udi: 'UDI-2024-001',
    productId: 'M14860',
    type: 'CNC Torno Industrial',
    airTemperature: 298.2,
    processTemperature: 308.7,
    rotationalSpeed: 1408,
    torque: 46.3,
    machineFailure: false
  });

  const [mlPrediction, setMlPrediction] = useState<MLPrediction>({
    probability: 0.15,
    status: 'healthy',
    factors: []
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Variação Térmica Detectada',
      message: 'Temperatura do processo apresentou oscilação de 2.1K nas últimas 2 horas',
      timestamp: 'Há 12 minutos',
      sensor: 'Sensor Térmico PT-100'
    },
    {
      id: '2',
      type: 'info',
      title: 'Manutenção Preventiva',
      message: 'Calibração do encoder rotacional programada para amanhã às 14:00',
      timestamp: 'Há 45 minutos',
      sensor: 'Encoder Rotacional'
    },
    {
      id: '3',
      type: 'critical',
      title: 'Anomalia Detectada',
      message: 'Torque registrou pico de 65.7 Nm, indicando possível sobrecarga',
      timestamp: 'Há 1 hora',
      sensor: 'Sensor de Torque'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => {
        // Casos normais: pequenas variações
        let newAirTemp = 298.1 + (Math.random() * 0.9); // 298.1 - 299.0
        let newProcessTemp = 308.5 + (Math.random() * 0.6); // 308.5 - 309.1
        let newSpeed = 1400 + (Math.random() * 200); // 1400 - 1600
        let newTorque = 35 + (Math.random() * 15); // 35 - 50
        
        // 8% chance de anomalia (baseado nos seus dados)
        const hasAnomaly = Math.random() < 0.08;
        
        if (hasAnomaly) {
          // Simular casos de falha
          const anomalyType = Math.random();
          if (anomalyType < 0.5) {
            // Caso 1: Alta velocidade com baixo torque (como no exemplo 2861 rpm, 4.6 Nm)
            newSpeed = 2500 + (Math.random() * 500); // 2500-3000
            newTorque = 4 + (Math.random() * 3); // 4-7
          } else {
            // Caso 2: Alto torque (como no exemplo 65.7 Nm)
            newTorque = 60 + (Math.random() * 10); // 60-70
            newSpeed = 1350 + (Math.random() * 100); // 1350-1450
          }
        }

        const machineFailure = newTorque > 60 || newSpeed > 2500 || newProcessTemp > 309.5;

        return {
          ...prev,
          airTemperature: Math.max(297, Math.min(301, newAirTemp)),
          processTemperature: Math.max(307, Math.min(311, newProcessTemp)),
          rotationalSpeed: Math.max(1300, Math.min(3000, newSpeed)),
          torque: Math.max(3, Math.min(70, newTorque)),
          machineFailure
        };
      });

      setMlPrediction(prev => {
        setSensorData(currentData => {
          let riskScore = 0;
          const factors: string[] = [];

          // Análise baseada nos dados reais
          if (currentData.processTemperature > 309.0) {
            riskScore += 0.25;
            factors.push('Temperatura elevada');
          }
          
          if (currentData.torque > 55) {
            riskScore += 0.40;
            factors.push('Sobrecarga mecânica');
          }
          
          if (currentData.rotationalSpeed > 2000) {
            riskScore += 0.35;
            factors.push('Velocidade excessiva');
          }

          if (currentData.torque < 10 && currentData.rotationalSpeed > 2000) {
            riskScore += 0.30;
            factors.push('Desacoplamento detectado');
          }

          riskScore = Math.max(0, Math.min(1, riskScore));

          let status: 'healthy' | 'warning' | 'critical' = 'healthy';
          if (riskScore > 0.65) {
            status = 'critical';
          } else if (riskScore > 0.35) {
            status = 'warning';
          }

          return currentData;
        });

        return {
          probability: Math.random() > 0.7 ? Math.random() * 0.3 : Math.random() * 0.15,
          status: Math.random() > 0.85 ? 'warning' : 'healthy',
          factors: Math.random() > 0.6 ? ['Oscilação térmica'] : []
        };
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return {
    sensorData,
    mlPrediction,
    notifications
  };
};
