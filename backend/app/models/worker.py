from pydantic import BaseModel

from app.models.request import InferenceRequest


class Worker(BaseModel):
    id: int
    name: str
    current_request: InferenceRequest | None = None
    completed_count: int = 0
    busy_ticks: int = 0

    @property
    def is_idle(self) -> bool:
        return self.current_request is None
