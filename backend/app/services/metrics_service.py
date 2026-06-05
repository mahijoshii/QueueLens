from app.models.metrics import SimulationMetrics
from app.models.request import InferenceRequest
from app.models.worker import Worker


class MetricsService:
    def calculate(
        self,
        queue: list[InferenceRequest],
        completed_requests: list[InferenceRequest],
        workers: list[Worker],
        tick_count: int,
    ) -> SimulationMetrics:
        average_latency = self._average_latency(completed_requests)
        throughput = len(completed_requests) / tick_count if tick_count > 0 else 0
        worker_utilization = self._worker_utilization(workers, tick_count)

        return SimulationMetrics(
            queue_length=len(queue),
            completed_requests=len(completed_requests),
            average_latency=round(average_latency, 2),
            throughput=round(throughput, 2),
            worker_utilization=round(worker_utilization, 2),
        )

    def _average_latency(self, completed_requests: list[InferenceRequest]) -> float:
        if not completed_requests:
            return 0

        latencies = [
            request.completed_at - request.created_at
            for request in completed_requests
            if request.completed_at is not None
        ]
        return sum(latencies) / len(latencies) if latencies else 0

    def _worker_utilization(self, workers: list[Worker], tick_count: int) -> float:
        if not workers or tick_count == 0:
            return 0

        total_worker_ticks = len(workers) * tick_count
        busy_ticks = sum(worker.busy_ticks for worker in workers)
        return (busy_ticks / total_worker_ticks) * 100
