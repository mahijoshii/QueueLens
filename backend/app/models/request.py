from enum import Enum
from pydantic import BaseModel


class RequestStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"


class InferenceRequest(BaseModel):
    id: int
    prompt: str
    created_at: float
    estimated_tokens: int
    estimated_processing_time: int
    remaining_processing_time: int
    status: RequestStatus = RequestStatus.QUEUED
    started_at: float | None = None
    completed_at: float | None = None
    assigned_worker_id: int | None = None
