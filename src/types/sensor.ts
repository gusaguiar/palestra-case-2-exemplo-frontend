
export interface SensorData {
  udi: string;
  productId: string;
  type: string;
  airTemperature: number; // [K]
  processTemperature: number; // [K]
  rotationalSpeed: number; // [rpm]
  torque: number; // [Nm]
  machineStatus: 'healthy' | 'warning' | 'critical'; // Changed from boolean machineFailure
}

export interface MLPrediction {
  probability: number;
  status: 'healthy' | 'warning' | 'critical';
  factors: string[];
}

export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  sensor?: string;
}
