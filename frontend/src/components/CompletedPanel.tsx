import { InferenceRequest } from "../types/simulation";

interface CompletedPanelProps {
  completedRequests: InferenceRequest[];
}

export default function CompletedPanel({ completedRequests }: CompletedPanelProps) {
  return (
    <section className="panel completed-panel">
      <div className="panel-heading">
        <h2>Completed</h2>
        <span>{completedRequests.length} done</span>
      </div>
      <div className="request-list compact">
        {completedRequests.length === 0 ? (
          <p className="empty-state">Completed requests will appear here.</p>
        ) : (
          completedRequests.slice(0, 12).map((request) => (
            <article className="request-card completed" key={request.id}>
              <div className="request-title">Request #{request.id}</div>
              <p>{request.prompt}</p>
              <div className="request-meta">
                <span>{request.estimated_tokens} tokens</span>
                <span>GPU {request.assigned_worker_id}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
