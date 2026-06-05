interface HeaderProps {
  tickCount: number;
}

export default function Header({ tickCount }: HeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">AI inference simulator</p>
        <h1>QueueLens</h1>
      </div>
      <div className="tick-pill">Tick {tickCount}</div>
    </header>
  );
}
