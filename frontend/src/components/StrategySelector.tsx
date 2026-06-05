import { SchedulingStrategy } from "../types/simulation";

const strategies: Array<{ value: SchedulingStrategy; label: string }> = [
  { value: "round_robin", label: "Round robin" },
  { value: "least_loaded", label: "Least loaded" },
  { value: "shortest_queue", label: "Shortest queue" },
];

interface StrategySelectorProps {
  selectedStrategy: SchedulingStrategy;
  onChange: (strategy: SchedulingStrategy) => Promise<void>;
}

export default function StrategySelector({
  selectedStrategy,
  onChange,
}: StrategySelectorProps) {
  return (
    <section className="panel control-panel">
      <h2>Scheduler</h2>
      <div className="strategy-list">
        {strategies.map((strategy) => (
          <button
            className={selectedStrategy === strategy.value ? "selected" : ""}
            key={strategy.value}
            type="button"
            onClick={() => onChange(strategy.value)}
          >
            {strategy.label}
          </button>
        ))}
      </div>
    </section>
  );
}
