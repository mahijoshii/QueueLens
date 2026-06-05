import { SchedulingStrategy, SimulationState } from "../types/simulation";

const API_BASE_URL = "http://127.0.0.1:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export function getSimulation(): Promise<SimulationState> {
  return request<SimulationState>("/simulation");
}

export function submitPrompt(prompt: string): Promise<SimulationState> {
  return request<SimulationState>("/requests", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}

export function generateTraffic(count: number): Promise<SimulationState> {
  return request<SimulationState>("/traffic", {
    method: "POST",
    body: JSON.stringify({ count }),
  });
}

export function setStrategy(strategy: SchedulingStrategy): Promise<SimulationState> {
  return request<SimulationState>("/strategy", {
    method: "POST",
    body: JSON.stringify({ strategy }),
  });
}

export function tickSimulation(): Promise<SimulationState> {
  return request<SimulationState>("/tick", { method: "POST" });
}

export function resetSimulation(): Promise<SimulationState> {
  return request<SimulationState>("/reset", { method: "POST" });
}
