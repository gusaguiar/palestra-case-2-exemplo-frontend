
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
    machineStatus: 'healthy'
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
    
    // Verificação de temperatura do processo
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

    // Verificação de torque alto
    if (data.torque > 55) {
      newNotifications.push({
        id: `torque-high-${Date.now()}`,
        type: data.torque > 60 ? 'critical' : 'warning',
        title: 'Sobrecarga Mecânica',
        message: `Torque de ${data.torque.toFixed(1)}Nm detectado. Possível sobrecarga do sistema`,
        timestamp: 'Agora',
        sensor: 'Sensor de Torque'
      });
    }

    // NOVA: Verificação de torque baixo
    if (data.torque < 15) {
      newNotifications.push({
        id: `torque-low-${Date.now()}`,
        type: data.torque < 8 ? 'critical' : 'warning',
        title: 'Torque Baixo Detectado',
        message: `Torque de ${data.torque.toFixed(1)}Nm está muito baixo. Possível problema de acoplamento ou carga`,
        timestamp: 'Agora',
        sensor: 'Sensor de Torque'
      });
    }

    // Verificação de velocidade excessiva
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

    // MELHORADA: Verificação de desacoplamento (mais sensível)
    if (data.rotationalSpeed > 1800 && data.torque < 12) {
      newNotifications.push({
        id: `decouple-${Date.now()}`,
        type: 'critical',
        title: 'Desacoplamento Detectado',
        message: `Alta velocidade (${data.rotationalSpeed}rpm) com baixo torque (${data.torque.toFixed(1)}Nm) indica possível desacoplamento`,
        timestamp: 'Agora',
        sensor: 'Sistema de Acoplamento'
      });
    }

    // NOVA: Verificação de velocidade baixa com torque normal (possível travamento)
    if (data.rotationalSpeed < 1200 && data.torque > 40) {
      newNotifications.push({
        id: `blockage-${Date.now()}`,
        type: 'critical',
        title: 'Possível Travamento',
        message: `Baixa velocidade (${data.rotationalSpeed}rpm) com alto torque (${data.torque.toFixed(1)}Nm) indica possível travamento`,
        timestamp: 'Agora',
        sensor: 'Sistema de Monitoramento'
      });
    }

    // Notificação do modelo preditivo
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
        // Valores base para condições normais
        const baseAirTemp = 298.1;
        const baseProcessTemp = 308.5;
        const baseSpeed = 1400; 
        const baseTorque = 35;
        
        // Variações para condições normais
        let newAirTemp = baseAirTemp + (Math.random() * 1.5);
        let newProcessTemp = baseProcessTemp + (Math.random() * 2.0);
        let newSpeed = baseSpeed + (Math.random() * 600);
        let newTorque = baseTorque + (Math.random() * 17.5);
        
        // 15% chance de anomalia
        const hasAnomaly = Math.random() < 0.15;
        
        if (hasAnomaly) {
          const anomalyType = Math.random();
          if (anomalyType < 0.3) {
            // Caso 1: Alta velocidade com baixo torque (desacoplamento)
            newSpeed = 2500 + (Math.random() * 750);
            newTorque = 3 + (Math.random() * 5);
          } else if (anomalyType < 0.6) {
            // Caso 2: Alto torque (sobrecarga)
            newTorque = 60 + (Math.random() * 15);
            newSpeed = 1300 + (Math.random() * 200);
          } else {
            // Caso 3: Torque muito baixo (problema de acoplamento/carga)
            newTorque = 2 + (Math.random() * 8);
            newSpeed = 1200 + (Math.random() * 400);
          }
          
          // Ocasionalmente adicionar anomalia de temperatura
          if (Math.random() < 0.25) {
            newProcessTemp = 310 + (Math.random() * 1.5);
          }
        }

        return {
          ...prev,
          airTemperature: Math.max(296.5, Math.min(301.5, newAirTemp)),
          processTemperature: Math.max(306.5, Math.min(312, newProcessTemp)),
          rotationalSpeed: Math.max(1200, Math.min(3300, newSpeed)),
          torque: Math.max(2, Math.min(75, newTorque)),
          machineStatus: 'healthy' // Will be updated after ML prediction
        };
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Atualizar predição ML baseada nos dados atuais
  useEffect(() => {
    const updatePrediction = () => {
      let riskScore = 0;
      const factors: string[] = [];

      // Análise de temperatura
      if (sensorData.processTemperature > 309.0) {
        riskScore += sensorData.processTemperature > 309.8 ? 0.45 : 0.30;
        factors.push('Temperatura elevada');
      }
      
      // Análise de torque alto
      if (sensorData.torque > 55) {
        riskScore += sensorData.torque > 65 ? 0.50 : 0.35;
        factors.push('Sobrecarga mecânica');
      }

      // NOVA: Análise de torque baixo
      if (sensorData.torque < 15) {
        riskScore += sensorData.torque < 8 ? 0.40 : 0.25;
        factors.push('Torque insuficiente');
      }
      
      // Análise de velocidade
      if (sensorData.rotationalSpeed > 2000) {
        riskScore += sensorData.rotationalSpeed > 2800 ? 0.55 : 0.40;
        factors.push('Velocidade excessiva');
      }

      // MELHORADA: Combinação crítica - desacoplamento (mais sensível)
      if (sensorData.torque < 12 && sensorData.rotationalSpeed > 1800) {
        riskScore += 0.45;
        factors.push('Desacoplamento detectado');
      }

      // NOVA: Combinação crítica - possível travamento
      if (sensorData.rotationalSpeed < 1200 && sensorData.torque > 40) {
        riskScore += 0.40;
        factors.push('Possível travamento');
      }

      // Pequenas variações para valores normais
      if (riskScore === 0) {
        riskScore = Math.random() * 0.25;
      }

      // Garantir que o riskScore esteja entre 0 e 1
      riskScore = Math.max(0, Math.min(1, riskScore));

      // Status baseado no risco
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (riskScore > 0.50) {
        status = 'critical';
      } else if (riskScore > 0.20) {
        status = 'warning';
      }

      const newPrediction = {
        probability: riskScore,
        status,
        factors
      };

      setMlPrediction(newPrediction);

      // Atualizar o status da máquina
      setSensorData(prev => ({
        ...prev,
        machineStatus: status
      }));
      
      // Gerar notificações
      const newNotifications = generateNotifications(sensorData, newPrediction);
      setNotifications(newNotifications);
    };

    updatePrediction();
  }, [sensorData.airTemperature, sensorData.processTemperature, sensorData.rotationalSpeed, sensorData.torque]);

  return {
    sensorData,
    mlPrediction,
    notifications
  };
};
