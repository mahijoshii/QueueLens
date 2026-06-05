import { SimulationMetrics } from "../types/simulation";

interface MetricsPanelProps {
  metrics: SimulationMetrics;
}

export default function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <section className="panel">
      <h2>Metrics</h2>
      <div className="metrics-grid">
        <Metric label="Queue length" value={metrics.queue_length} />
        <Metric label="Completed" value={metrics.completed_requests} />
        <Metric label="Avg latency" value={`${metrics.average_latency}s`} />
        <Metric label="Throughput" value={`${metrics.throughput}/tick`} />
        <Metric label="Utilization" value={`${metrics.worker_utilization}%`} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
