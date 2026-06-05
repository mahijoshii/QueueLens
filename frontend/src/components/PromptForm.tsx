import { FormEvent, useState } from "react";

interface PromptFormProps {
  onSubmit: (prompt: string) => Promise<void>;
}

export default function PromptForm({ onSubmit }: PromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!prompt.trim()) {
      return;
    }

    setIsSubmitting(true);
    await onSubmit(prompt);
    setPrompt("");
    setIsSubmitting(false);
  }

  return (
    <form className="panel control-panel" onSubmit={handleSubmit}>
      <h2>Submit prompt</h2>
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Ask the model to summarize, explain, generate, or classify..."
      />
      <button type="submit" disabled={isSubmitting || !prompt.trim()}>
        Add request
      </button>
    </form>
  );
}
