import { useEffect, useState } from "react";

import {
  generateTraffic,
  getSimulation,
  resetSimulation,
  setStrategy,
  submitPrompt,
  tickSimulation,
} from "./api/client";
import CompletedPanel from "./components/CompletedPanel";
import Header from "./components/Header";
import MetricsPanel from "./components/MetricsPanel";
import PromptForm from "./components/PromptForm";
import QueuePanel from "./components/QueuePanel";
import StrategySelector from "./components/StrategySelector";
import TrafficControls from "./components/TrafficControls";
import WorkerPanel from "./components/WorkerPanel";
import { SchedulingStrategy, SimulationState } from "./types/simulation";

export default function App() {
  const [simulation, setSimulation] = useState<SimulationState | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    refreshSimulation();
  }, []);

  useEffect(() => {
    const timerId = window.setInterval(async () => {
      await runApiCall(() => tickSimulation());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  async function refreshSimulation() {
    await runApiCall(() => getSimulation());
  }

  async function handleSubmitPrompt(prompt: string) {
    await runApiCall(() => submitPrompt(prompt));
  }

  async function handleGenerateTraffic(count: number) {
    await runApiCall(() => generateTraffic(count));
  }

  async function handleStrategyChange(strategy: SchedulingStrategy) {
    await runApiCall(() => setStrategy(strategy));
  }

  async function handleReset() {
    await runApiCall(() => resetSimulation());
  }

  async function runApiCall(action: () => Promise<SimulationState>) {
    try {
      const nextSimulation = await action();
      setSimulation(nextSimulation);
      setError("");
    } catch {
      setError("Could not reach the QueueLens API. Start the FastAPI backend on port 8000.");
    }
  }

  if (!simulation) {
    return (
      <main className="app-shell">
        <Header tickCount={0} />
        <p className="status-message">Loading simulation...</p>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <Header tickCount={simulation.tick_count} />
      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-grid">
        <aside className="left-column">
          <PromptForm onSubmit={handleSubmitPrompt} />
          <StrategySelector
            selectedStrategy={simulation.selected_strategy}
            onChange={handleStrategyChange}
          />
          <TrafficControls onGenerateTraffic={handleGenerateTraffic} onReset={handleReset} />
        </aside>

        <section className="middle-column">
          <QueuePanel queue={simulation.queue} />
          <WorkerPanel workers={simulation.workers} />
        </section>

        <aside className="right-column">
          <MetricsPanel metrics={simulation.metrics} />
          <CompletedPanel completedRequests={simulation.completed_requests} />
        </aside>
      </div>
    </main>
  );
}
