from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from app.services.simulator import InferenceSimulator


router = APIRouter()
simulator = InferenceSimulator()


class PromptPayload(BaseModel):
    prompt: str


class TrafficPayload(BaseModel):
    count: int = 5


class StrategyPayload(BaseModel):
    strategy: str


@router.get("/simulation")
def get_simulation() -> dict:
    return simulator.snapshot()


@router.post("/requests")
def create_request(payload: PromptPayload) -> dict:
    prompt = payload.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    return simulator.add_request(prompt)


@router.post("/traffic")
def generate_traffic(payload: TrafficPayload) -> dict:
    return simulator.generate_traffic(payload.count)


@router.post("/strategy")
def set_strategy(payload: StrategyPayload) -> dict:
    try:
        return simulator.set_strategy(payload.strategy)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.post("/tick")
def tick() -> dict:
    return simulator.tick()


@router.post("/reset")
def reset() -> dict:
    return simulator.reset()
