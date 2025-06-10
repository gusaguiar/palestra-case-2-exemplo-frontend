
import { useState, useEffect } from 'react';
import { SensorData, MLPrediction, Notification } from '@/types/sensor';

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorData>({
    udi: 'UDI-2024-001',
    productId: 'M14860',
    type: 'Machine Type A',
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
      title: 'Desvio na Temperatura',
      message: 'Temperatura do processo 5% acima da média histórica',
      timestamp: 'Há 15 minutos',
      sensor: 'Temperatura do Processo'
    },
    {
      id: '2',
      type: 'info',
      title: 'Calibração Programada',
      message: 'Sensor de torque agendado para calibração em 2 dias',
      timestamp: 'Há 1 hora',
      sensor: 'Sensor de Torque'
    },
    {
      id: '3',
      type: 'critical',
      title: 'Desgaste Elevado',
      message: 'Ferramenta atingiu 80% do limite de desgaste recomendado',
      timestamp: 'Há 2 horas',
      sensor: 'Desgaste da Ferramenta'
    }
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ...prev,
        airTemperature: prev.airTemperature + (Math.random() - 0.5) * 2,
        processTemperature: prev.processTemperature + (Math.random() - 0.5) * 3,
        rotationalSpeed: prev.rotationalSpeed + (Math.random() - 0.5) * 50,
        torque: prev.torque + (Math.random() - 0.5) * 5,
        toolWear: Math.max(0, prev.toolWear + Math.random() * 0.1)
      }));

      // Update ML prediction based on sensor values
      setMlPrediction(prev => {
        const newProbability = Math.max(0, Math.min(1, 
          prev.probability + (Math.random() - 0.5) * 0.05
        ));
        
        let status: 'healthy' | 'warning' | 'critical' = 'healthy';
        let factors: string[] = [];

        if (newProbability > 0.75) {
          status = 'critical';
          factors = ['Desgaste da ferramenta', 'Temperatura elevada', 'Torque irregular'];
        } else if (newProbability > 0.4) {
          status = 'warning';
          factors = ['Temperatura do processo', 'Velocidade instável'];
        }

        return {
          probability: newProbability,
          status,
          factors
        };
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    sensorData,
    mlPrediction,
    notifications
  };
};
