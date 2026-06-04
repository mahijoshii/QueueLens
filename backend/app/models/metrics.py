from pydantic import BaseModel


class SimulationMetrics(BaseModel):
    queue_length: int
    completed_requests: int
    average_latency: float
    throughput: float
    worker_utilization: float
