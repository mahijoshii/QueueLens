import { InferenceRequest } from "../types/simulation";

interface QueuePanelProps {
  queue: InferenceRequest[];
}

export default function QueuePanel({ queue }: QueuePanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Request queue</h2>
        <span>{queue.length} waiting</span>
      </div>
      <div className="request-list">
        {queue.length === 0 ? (
          <p className="empty-state">No queued requests.</p>
        ) : (
          queue.map((request) => (
            <article className="request-card" key={request.id}>
              <div className="request-title">Request #{request.id}</div>
              <p>{request.prompt}</p>
              <div className="request-meta">
                <span>{request.estimated_tokens} tokens</span>
                <span>{request.estimated_processing_time}s estimate</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
