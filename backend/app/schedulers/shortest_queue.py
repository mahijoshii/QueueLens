from app.models.request import InferenceRequest
from app.models.worker import Worker
from app.schedulers.base import BaseScheduler


class ShortestQueueScheduler(BaseScheduler):
    name = "shortest_queue"

    def choose_worker(
        self,
        request: InferenceRequest,
        workers: list[Worker],
        tick_count: int,
    ) -> Worker | None:
        # This simulation has one shared queue, so the best local choice is the
        # idle worker with the least remaining work. Idle workers have zero.
        idle_workers = [worker for worker in workers if worker.is_idle]
        if not idle_workers:
            return None

        return min(idle_workers, key=lambda worker: worker.busy_ticks)
