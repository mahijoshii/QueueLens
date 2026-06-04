from abc import ABC, abstractmethod

from app.models.request import InferenceRequest
from app.models.worker import Worker


class BaseScheduler(ABC):
    name: str

    @abstractmethod
    def choose_worker(
        self,
        request: InferenceRequest,
        workers: list[Worker],
        tick_count: int,
    ) -> Worker | None:
        """Return the worker that should receive the request, or None if all are busy."""
