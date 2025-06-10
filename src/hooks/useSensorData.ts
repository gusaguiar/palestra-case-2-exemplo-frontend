
import { useState, useEffect } from 'react';
import { SensorData, MLPrediction, Notification } from '@/types/sensor';

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    udi: 'UDI-2024-001',
    productId: 'M14860',
    type: 'CNC Torno Industrial',
    airTemperature: 298.1,
    processTemperature: 308.6,
    rotationalSpeed: 1551,
    torque: 42.8,
    toolWear: 0,
    machineFailure: false
  });

  const [mlPrediction, setMlPrediction] = useState<MLPrediction>({
    probability: 0.23,
    status: 'healthy',
    factors: []
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Variação Térmica Detectada',
      message: 'Temperatura do processo apresentou oscilação de 4.2K nas últimas 2 horas',
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
      title: 'Desgaste Acelerado',
      message: 'Taxa de desgaste da ferramenta 23% acima do esperado para este ciclo',
      timestamp: 'Há 1 hora',
      sensor: 'Monitor de Desgaste'
    }
  ]);

  // Simulate more realistic sensor variations with occasional anomalies
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => {
        // Base variation factors
        const tempVariation = (Math.random() - 0.5) * 1.5;
        const speedVariation = (Math.random() - 0.5) * 30;
        const torqueVariation = (Math.random() - 0.5) * 3;
        
        // Introduce occasional anomalies (15% chance)
        const hasAnomaly = Math.random() < 0.15;
        const anomalyFactor = hasAnomaly ? (Math.random() > 0.5 ? 1.8 : -1.8) : 1;
        
        // More realistic sensor ranges and correlations
        const newAirTemp = Math.max(295, Math.min(310, prev.airTemperature + tempVariation));
        const newProcessTemp = Math.max(300, Math.min(325, prev.processTemperature + (tempVariation * 1.2) + (hasAnomaly ? anomalyFactor * 2 : 0)));
        const newSpeed = Math.max(1400, Math.min(1800, prev.rotationalSpeed + speedVariation + (hasAnomaly ? anomalyFactor * 50 : 0)));
        const newTorque = Math.max(35, Math.min(55, prev.torque + torqueVariation + (hasAnomaly ? anomalyFactor * 3 : 0)));
        const newToolWear = Math.max(0, prev.toolWear + Math.random() * 0.08 + (hasAnomaly ? 0.15 : 0));

        return {
          ...prev,
          airTemperature: newAirTemp,
          processTemperature: newProcessTemp,
          rotationalSpeed: newSpeed,
          torque: newTorque,
          toolWear: newToolWear,
          machineFailure: newToolWear > 250 || newProcessTemp > 320 || newTorque > 50
        };
      });

      // Update ML prediction with more sophisticated logic
      setMlPrediction(prev => {
        setSensorData(currentData => {
          // Risk factors calculation
          let riskScore = 0;
          const factors: string[] = [];

          // Temperature risk
          if (currentData.processTemperature > 315) {
            riskScore += 0.25;
            factors.push('Temperatura elevada');
          }
          if (currentData.airTemperature > 305) {
            riskScore += 0.15;
            factors.push('Aquecimento ambiente');
          }

          // Mechanical stress risk
          if (currentData.torque > 48) {
            riskScore += 0.30;
            factors.push('Sobrecarga mecânica');
          }
          if (currentData.rotationalSpeed > 1650) {
            riskScore += 0.20;
            factors.push('Velocidade excessiva');
          }

          // Wear risk
          if (currentData.toolWear > 180) {
            riskScore += 0.35;
            factors.push('Desgaste avançado');
          }

          // Add some randomness to simulate ML uncertainty
          riskScore += (Math.random() - 0.5) * 0.1;
          riskScore = Math.max(0, Math.min(1, riskScore));

          let status: 'healthy' | 'warning' | 'critical' = 'healthy';
          if (riskScore > 0.75) {
            status = 'critical';
          } else if (riskScore > 0.40) {
            status = 'warning';
          }

          return currentData;
        });

        // Calculate final risk based on current sensor state
        let finalRisk = 0;
        const finalFactors: string[] = [];

        // Recalculate with current data
        setSensorData(currentData => {
          if (currentData.processTemperature > 315) {
            finalRisk += 0.25;
            finalFactors.push('Temperatura elevada');
          }
          if (currentData.torque > 48) {
            finalRisk += 0.30;
            finalFactors.push('Sobrecarga mecânica');
          }
          if (currentData.toolWear > 180) {
            finalRisk += 0.35;
            finalFactors.push('Desgaste avançado');
          }
          if (currentData.rotationalSpeed > 1650) {
            finalRisk += 0.20;
            finalFactors.push('Velocidade excessiva');
          }

          finalRisk += (Math.random() - 0.5) * 0.08;
          finalRisk = Math.max(0, Math.min(1, finalRisk));

          return currentData;
        });

        let finalStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
        if (finalRisk > 0.75) {
          finalStatus = 'critical';
        } else if (finalRisk > 0.40) {
          finalStatus = 'warning';
        }

        return {
          probability: finalRisk,
          status: finalStatus,
          factors: finalFactors
        };
      });
    }, 4000); // Update every 4 seconds for more dynamic feel

    return () => clearInterval(interval);
  }, []);

  return {
    sensorData,
    mlPrediction,
    notifications
  };
};
