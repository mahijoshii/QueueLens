import { Worker } from "../types/simulation";

interface WorkerPanelProps {
  workers: Worker[];
}

export default function WorkerPanel({ workers }: WorkerPanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>GPU workers</h2>
        <span>{workers.length} online</span>
      </div>
      <div className="worker-grid">
        {workers.map((worker) => {
          const request = worker.current_request;

          return (
            <article className={request ? "worker-card active" : "worker-card"} key={worker.id}>
              <div className="worker-header">
                <h3>{worker.name}</h3>
                <span>{request ? "Running" : "Idle"}</span>
              </div>
              {request ? (
                <>
                  <p>{request.prompt}</p>
                  <div className="progress-track">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${progressPercent(
                          request.remaining_processing_time,
                          request.estimated_processing_time,
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="request-meta">
                    <span>#{request.id}</span>
                    <span>{request.remaining_processing_time}s left</span>
                  </div>
                </>
              ) : (
                <p className="empty-state">Ready for the next request.</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function progressPercent(remaining: number, total: number) {
  const completed = total - remaining;
  return Math.max(8, Math.min(100, (completed / total) * 100));
}
