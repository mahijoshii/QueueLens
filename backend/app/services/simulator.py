import time

from app.models.metrics import SimulationMetrics
from app.models.request import InferenceRequest, RequestStatus
from app.models.worker import Worker
from app.schedulers.base import BaseScheduler
from app.schedulers.least_loaded import LeastLoadedScheduler
from app.schedulers.round_robin import RoundRobinScheduler
from app.schedulers.shortest_queue import ShortestQueueScheduler
from app.services.metrics_service import MetricsService
from app.services.request_factory import RequestFactory


class InferenceSimulator:
    def __init__(self) -> None:
        self.request_factory = RequestFactory()
        self.metrics_service = MetricsService()
        self.schedulers: dict[str, BaseScheduler] = {
            "round_robin": RoundRobinScheduler(),
            "least_loaded": LeastLoadedScheduler(),
            "shortest_queue": ShortestQueueScheduler(),
        }
        self.reset()

    def reset(self) -> dict:
        self.queue: list[InferenceRequest] = []
        self.completed_requests: list[InferenceRequest] = []
        self.workers = [
            Worker(id=1, name="GPU Worker 1"),
            Worker(id=2, name="GPU Worker 2"),
            Worker(id=3, name="GPU Worker 3"),
        ]
        self.selected_strategy = "round_robin"
        self.tick_count = 0
        self.request_factory.reset()
        return self.snapshot()

    def add_request(self, prompt: str) -> dict:
        self.queue.append(self.request_factory.create_request(prompt))
        return self.snapshot()

    def generate_traffic(self, count: int = 5) -> dict:
        self.queue.extend(self.request_factory.create_fake_requests(count))
        return self.snapshot()

    def set_strategy(self, strategy: str) -> dict:
        if strategy not in self.schedulers:
            raise ValueError(f"Unknown strategy: {strategy}")

        self.selected_strategy = strategy
        return self.snapshot()

    def tick(self) -> dict:
        self.tick_count += 1
        self._assign_queued_requests()
        self._advance_running_requests()
        return self.snapshot()

    def snapshot(self) -> dict:
        metrics = self._current_metrics()
        return {
            "queue": self.queue,
            "workers": self.workers,
            "completed_requests": self.completed_requests,
            "metrics": metrics,
            "selected_strategy": self.selected_strategy,
            "tick_count": self.tick_count,
        }

    def _assign_queued_requests(self) -> None:
        scheduler = self.schedulers[self.selected_strategy]

        while self.queue and any(worker.is_idle for worker in self.workers):
            next_request = self.queue[0]
            worker = scheduler.choose_worker(next_request, self.workers, self.tick_count)
            if worker is None:
                return

            assigned_request = self.queue.pop(0)
            assigned_request.status = RequestStatus.RUNNING
            assigned_request.started_at = time.time()
            assigned_request.assigned_worker_id = worker.id
            worker.current_request = assigned_request

    def _advance_running_requests(self) -> None:
        for worker in self.workers:
            request = worker.current_request
            if request is None:
                continue

            worker.busy_ticks += 1
            request.remaining_processing_time -= 1

            if request.remaining_processing_time <= 0:
                request.status = RequestStatus.COMPLETED
                request.completed_at = time.time()
                worker.current_request = None
                worker.completed_count += 1
                self.completed_requests.insert(0, request)

    def _current_metrics(self) -> SimulationMetrics:
        return self.metrics_service.calculate(
            queue=self.queue,
            completed_requests=self.completed_requests,
            workers=self.workers,
            tick_count=self.tick_count,
        )
