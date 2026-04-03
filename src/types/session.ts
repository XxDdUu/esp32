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
