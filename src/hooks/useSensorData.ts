
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
    
    // Ajustados os limites para notificações com base nas variações maiores
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
        // Aumento significativo das variações (25-50%)
        // Valores base para condições normais
        const baseAirTemp = 298.1;
        const baseProcessTemp = 308.5;
        const baseSpeed = 1400; 
        const baseTorque = 35;
        
        // Variações mais amplas para condições normais (25-50%)
        let newAirTemp = baseAirTemp + (Math.random() * 1.5); // ~0.5% variação
        let newProcessTemp = baseProcessTemp + (Math.random() * 2.0); // ~0.65% variação
        let newSpeed = baseSpeed + (Math.random() * 600); // ~43% variação
        let newTorque = baseTorque + (Math.random() * 17.5); // ~50% variação
        
        // 15% chance de anomalia (aumentado de 8%)
        const hasAnomaly = Math.random() < 0.15;
        
        if (hasAnomaly) {
          // Simular casos de falha com variações ainda mais extremas
          const anomalyType = Math.random();
          if (anomalyType < 0.5) {
            // Caso 1: Alta velocidade com baixo torque
            newSpeed = 2500 + (Math.random() * 750); // 2500-3250 (+30% do anterior)
            newTorque = 3 + (Math.random() * 5); // 3-8
          } else {
            // Caso 2: Alto torque
            newTorque = 60 + (Math.random() * 15); // 60-75 (+25% do anterior)
            newSpeed = 1300 + (Math.random() * 200); // 1300-1500
          }
          
          // Ocasionalmente adicionar anomalia de temperatura (25% das anomalias)
          if (Math.random() < 0.25) {
            newProcessTemp = 310 + (Math.random() * 1.5); // 310-311.5K (temperatura crítica)
          }
        }

        // Condições de falha ajustadas para os novos ranges
        const machineFailure = 
          newTorque > 65 || // Reduzido de 70 para detectar falhas mais cedo
          newSpeed > 2800 || // Reduzido de 3000 para detectar falhas mais cedo
          newProcessTemp > 309.8; // Reduzido de 310 para detectar falhas mais cedo

        return {
          ...prev,
          airTemperature: Math.max(296.5, Math.min(301.5, newAirTemp)), // Ampliado range
          processTemperature: Math.max(306.5, Math.min(312, newProcessTemp)), // Ampliado range
          rotationalSpeed: Math.max(1200, Math.min(3300, newSpeed)), // Ampliado range
          torque: Math.max(2, Math.min(75, newTorque)), // Ampliado range
          machineFailure
        };
      });
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Atualizar predição ML baseada nos dados atuais
  useEffect(() => {
    const updatePrediction = () => {
      let riskScore = 0;
      const factors: string[] = [];

      // Análise baseada nos dados com pesos ajustados
      // Temperatura
      if (sensorData.processTemperature > 309.0) {
        // Aumentado o peso da temperatura
        riskScore += sensorData.processTemperature > 309.8 ? 0.45 : 0.30;
        factors.push('Temperatura elevada');
      }
      
      // Torque
      if (sensorData.torque > 55) {
        // Aumentado o peso do torque
        riskScore += sensorData.torque > 65 ? 0.50 : 0.35;
        factors.push('Sobrecarga mecânica');
      }
      
      // Velocidade
      if (sensorData.rotationalSpeed > 2000) {
        // Aumentado o peso da velocidade
        riskScore += sensorData.rotationalSpeed > 2800 ? 0.55 : 0.40;
        factors.push('Velocidade excessiva');
      }

      // Combinação crítica: alta velocidade com baixo torque
      if (sensorData.torque < 10 && sensorData.rotationalSpeed > 2000) {
        // Aumentado o peso desta condição
        riskScore += 0.45;
        factors.push('Desacoplamento detectado');
      }

      // Pequenas variações para valores normais, mais amplas que antes
      if (riskScore === 0) {
        riskScore = Math.random() * 0.25; // 0-25% para casos normais
      }

      // Garantir que o riskScore esteja entre 0 e 1
      riskScore = Math.max(0, Math.min(1, riskScore));

      // Status ajustado para ser mais sensível a variações
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (riskScore > 0.60) { // Reduzido de 0.65
        status = 'critical';
      } else if (riskScore > 0.25) { // Reduzido de 0.30
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
