interface TrafficControlsProps {
  onGenerateTraffic: (count: number) => Promise<void>;
  onReset: () => Promise<void>;
}

export default function TrafficControls({
  onGenerateTraffic,
  onReset,
}: TrafficControlsProps) {
  return (
    <section className="panel control-panel">
      <h2>Traffic</h2>
      <div className="button-row">
        <button type="button" onClick={() => onGenerateTraffic(6)}>
          Generate traffic
        </button>
        <button className="secondary" type="button" onClick={onReset}>
          Reset simulation
        </button>
      </div>
    </section>
  );
}
