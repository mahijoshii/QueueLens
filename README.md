# QueueLens

QueueLens is an interactive full-stack simulator for AI inference queues. A user submits fake prompts, the backend turns them into inference requests, and three simulated GPU workers process those requests over time.

The goal is to make the moving parts of an inference system easier to see: queued requests, running jobs, worker utilization, latency, throughput, and scheduling strategy.

## Why queues and schedulers matter

AI inference systems often receive more requests than the GPUs can handle at once. A queue protects the system from overload by holding requests until compute is available. A scheduler decides which worker should receive the next request, which affects latency, fairness, throughput, and utilization.

QueueLens keeps the simulation simple enough to explain in an interview while still showing the core tradeoffs behind real inference platforms.

## Project structure

```text
backend/
  app/
    main.py
    models/
    services/
    schedulers/
    api/
frontend/
  src/
    api/
    components/
    styles/
    types/
```

## Run the backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs at:

```text
http://127.0.0.1:8000
```

Useful endpoints:

- `GET /simulation`
- `POST /requests`
- `POST /traffic`
- `POST /strategy`
- `POST /tick`
- `POST /reset`

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite app runs at:

```text
http://localhost:5173
```

## Scheduler explanations

### Round robin

Round robin rotates through the workers in order. It is easy to reason about and spreads assignments evenly over time.

### Least loaded

Least loaded picks the idle worker that has completed the fewest requests. This helps balance total completed work across workers.

### Shortest queue

This simulator uses one shared request queue instead of a separate queue per worker. In that setup, the shortest-queue scheduler chooses the idle worker with the least recorded busy time, which approximates sending new work toward the least-used worker.

## How the simulation works

The frontend calls `POST /tick` every second. Each tick:

1. Assigns queued requests to idle GPU workers.
2. Decrements the remaining processing time for running requests.
3. Moves finished requests to the completed list.
4. Recalculates queue length, completed count, average latency, throughput, and utilization.

Simulation state is stored in memory in the FastAPI process. There is no database yet.

## Sample resume bullets

- Built QueueLens, a full-stack AI inference simulator using React, TypeScript, FastAPI, and in-memory simulation state.
- Implemented queueing, worker assignment, request lifecycle states, and scheduler strategies including round robin, least loaded, and shortest queue.
- Designed a dashboard that visualizes queued prompts, GPU worker activity, completed requests, latency, throughput, and utilization in real time.
- Structured the project with small backend services, scheduler classes, typed frontend API clients, and reusable React components.

## How to explain this in an interview

QueueLens simulates what happens after a user sends a prompt to an AI system. The request enters a queue, waits for an available GPU worker, runs for an estimated amount of time, and then moves into the completed list.

The main design idea is separation of responsibility. The backend owns the simulation state and scheduling logic. The frontend only displays the current state and sends user actions like submit prompt, generate traffic, change scheduler, tick, and reset.

The schedulers are intentionally simple. Round robin focuses on fairness, least loaded balances completed work, and shortest queue approximates choosing the least busy worker. In a real production system, the next step would be adding priorities, batching, cancellation, streaming output, persistence, and richer metrics.

## Future improvements

- Add per-worker queues to make shortest-queue scheduling more realistic.
- Add request priorities for paid tiers or urgent workloads.
- Simulate batching so multiple prompts can share a GPU pass.
- Add streaming tokens and cancellation.
- Persist runs in a database for historical analysis.
- Add charts for latency percentiles and throughput over time.
- Add tests for scheduler behavior and simulator ticks.
