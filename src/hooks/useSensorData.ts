
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
    probability: 0.12,
    status: 'healthy',
    factors: []
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Função para gerar notificações baseadas nos dados atuais
  const generateNotifications = (data: SensorData, prediction: MLPrediction): Notification[] => {
    const newNotifications: Notification[] = [];
    
    if (data.processTemperature > 309.0) {
      newNotifications.push({
        id: `temp-${Date.now()}`,
        type: data.processTemperature > 309.5 ? 'critical' : 'warning',
        title: 'Temperatura Elevada Detectada',
        message: `Temperatura do processo em ${data.processTemperature.toFixed(1)}K está acima do limite operacional de 309.0K`,
        timestamp: 'Agora',
        sensor: 'Sensor Térmico PT-100'
      });
    }

    if (data.torque > 55) {
      newNotifications.push({
        id: `torque-${Date.now()}`,
        type: data.torque > 60 ? 'critical' : 'warning',
        title: 'Sobrecarga Mecânica',
        message: `Torque de ${data.torque.toFixed(1)}Nm detectado. Possível sobrecarga do sistema`,
        timestamp: 'Agora',
        sensor: 'Sensor de Torque'
      });
    }

    if (data.rotationalSpeed > 2000) {
      newNotifications.push({
        id: `speed-${Date.now()}`,
        type: 'critical',
        title: 'Velocidade Excessiva',
        message: `Velocidade rotacional de ${data.rotationalSpeed}rpm está muito alta. Risco de falha mecânica`,
        timestamp: 'Agora',
        sensor: 'Encoder Rotacional'
      });
    }

    if (data.rotationalSpeed > 2000 && data.torque < 10) {
      newNotifications.push({
        id: `decouple-${Date.now()}`,
        type: 'critical',
        title: 'Desacoplamento Detectado',
        message: `Alta velocidade (${data.rotationalSpeed}rpm) com baixo torque (${data.torque.toFixed(1)}Nm) indica possível desacoplamento`,
        timestamp: 'Agora',
        sensor: 'Sistema de Acoplamento'
      });
    }

    if (prediction.status === 'warning' && newNotifications.length === 0) {
      newNotifications.push({
        id: `ml-warning-${Date.now()}`,
        type: 'info',
        title: 'Modelo Preditivo - Atenção',
        message: `Sistema de ML detectou ${(prediction.probability * 100).toFixed(1)}% de probabilidade de falha`,
        timestamp: 'Agora',
        sensor: 'Sistema de ML'
      });
    }

    return newNotifications;
  };

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
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Atualizar predição ML baseada nos dados atuais
  useEffect(() => {
    const updatePrediction = () => {
      let riskScore = 0;
      const factors: string[] = [];

      // Análise baseada nos dados reais
      if (sensorData.processTemperature > 309.0) {
        riskScore += sensorData.processTemperature > 309.5 ? 0.35 : 0.20;
        factors.push('Temperatura elevada');
      }
      
      if (sensorData.torque > 55) {
        riskScore += sensorData.torque > 60 ? 0.45 : 0.25;
        factors.push('Sobrecarga mecânica');
      }
      
      if (sensorData.rotationalSpeed > 2000) {
        riskScore += 0.40;
        factors.push('Velocidade excessiva');
      }

      if (sensorData.torque < 10 && sensorData.rotationalSpeed > 2000) {
        riskScore += 0.35;
        factors.push('Desacoplamento detectado');
      }

      // Pequenas variações para valores normais
      if (riskScore === 0) {
        riskScore = Math.random() * 0.15; // 0-15% para casos normais
      }

      riskScore = Math.max(0, Math.min(1, riskScore));

      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (riskScore > 0.65) {
        status = 'critical';
      } else if (riskScore > 0.30) {
        status = 'warning';
      }

      const newPrediction = {
        probability: riskScore,
        status,
        factors
      };

      setMlPrediction(newPrediction);
      
      // Gerar notificações baseadas nos dados e predição
      const newNotifications = generateNotifications(sensorData, newPrediction);
      setNotifications(newNotifications);
    };

    updatePrediction();
  }, [sensorData]);

  return {
    sensorData,
    mlPrediction,
    notifications
  };
};
