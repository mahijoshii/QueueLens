from app.models.request import InferenceRequest
from app.models.worker import Worker
from app.schedulers.base import BaseScheduler


class RoundRobinScheduler(BaseScheduler):
    name = "round_robin"

    def __init__(self) -> None:
        self.next_worker_index = 0

    def choose_worker(
        self,
        request: InferenceRequest,
        workers: list[Worker],
        tick_count: int,
    ) -> Worker | None:
        # Round robin rotates through workers so work is spread evenly over time.
        if not workers:
            return None

        for offset in range(len(workers)):
            index = (self.next_worker_index + offset) % len(workers)
            worker = workers[index]
            if worker.is_idle:
                self.next_worker_index = (index + 1) % len(workers)
                return worker

        return None
