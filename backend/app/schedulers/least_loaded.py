from app.models.request import InferenceRequest
from app.models.worker import Worker
from app.schedulers.base import BaseScheduler


class LeastLoadedScheduler(BaseScheduler):
    name = "least_loaded"

    def choose_worker(
        self,
        request: InferenceRequest,
        workers: list[Worker],
        tick_count: int,
    ) -> Worker | None:
        # Least loaded prefers the idle worker that has completed the fewest jobs.
        idle_workers = [worker for worker in workers if worker.is_idle]
        if not idle_workers:
            return None

        return min(idle_workers, key=lambda worker: worker.completed_count)
