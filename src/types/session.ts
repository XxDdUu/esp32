export interface DataPoint {
  t: number;
  flow: number;
  pressure: number;
}

export interface Metrics {
  FEV1: number;
  FVC: number;
  PEF: number;
  P_peak: number;
}

export interface Session {
  userId: string;
  createdAt: Date;
  metrics: Metrics;
  data: DataPoint[];
}
export interface Device {
  id: string;
  owner: string;
  key: string;
  createdAt: number;
  lastSeen?: number;
}