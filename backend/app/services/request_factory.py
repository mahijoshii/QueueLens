import random
import time

from app.models.request import InferenceRequest


SAMPLE_PROMPTS = [
    "Summarize this research paper in plain English.",
    "Write a Python function that validates an email address.",
    "Explain backpropagation using a simple analogy.",
    "Create a study plan for a machine learning interview.",
    "Draft a friendly customer support reply.",
    "Compare batch processing and streaming systems.",
]


class RequestFactory:
    def __init__(self) -> None:
        self.next_id = 1

    def create_request(self, prompt: str) -> InferenceRequest:
        request_id = self.next_id
        self.next_id += 1

        estimated_tokens = self._estimate_tokens(prompt)
        estimated_processing_time = self._estimate_processing_time(estimated_tokens)

        return InferenceRequest(
            id=request_id,
            prompt=prompt,
            created_at=time.time(),
            estimated_tokens=estimated_tokens,
            estimated_processing_time=estimated_processing_time,
            remaining_processing_time=estimated_processing_time,
        )

    def create_fake_requests(self, count: int) -> list[InferenceRequest]:
        return [
            self.create_request(random.choice(SAMPLE_PROMPTS))
            for _ in range(max(1, min(count, 20)))
        ]

    def reset(self) -> None:
        self.next_id = 1

    def _estimate_tokens(self, prompt: str) -> int:
        words = prompt.split()
        return max(8, len(words) * random.randint(2, 4))

    def _estimate_processing_time(self, estimated_tokens: int) -> int:
        return max(2, min(12, round(estimated_tokens / 8)))
