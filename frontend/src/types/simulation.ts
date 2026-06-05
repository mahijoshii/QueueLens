export type RequestStatus = "queued" | "running" | "completed";

export type SchedulingStrategy = "round_robin" | "least_loaded" | "shortest_queue";

export interface InferenceRequest {
  id: number;
  prompt: string;
  created_at: number;
  estimated_tokens: number;
  estimated_processing_time: number;
  remaining_processing_time: number;
  status: RequestStatus;
  started_at: number | null;
  completed_at: number | null;
  assigned_worker_id: number | null;
}

export interface Worker {
  id: number;
  name: string;
  current_request: InferenceRequest | null;
  completed_count: number;
  busy_ticks: number;
}

export interface SimulationMetrics {
  queue_length: number;
  completed_requests: number;
  average_latency: number;
  throughput: number;
  worker_utilization: number;
}

export interface SimulationState {
  queue: InferenceRequest[];
  workers: Worker[];
  completed_requests: InferenceRequest[];
  metrics: SimulationMetrics;
  selected_strategy: SchedulingStrategy;
  tick_count: number;
}
