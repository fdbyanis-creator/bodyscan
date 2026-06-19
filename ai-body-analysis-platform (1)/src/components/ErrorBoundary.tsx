import { Component, type ReactNode } from "react";

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-100">
          <div className="max-w-lg rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
            <h1 className="text-xl font-bold text-red-300">Une erreur est survenue</h1>
            <pre className="mt-3 overflow-auto whitespace-pre-wrap text-xs text-red-200">
              {this.state.error.message}
              {"\n\n"}
              {this.state.error.stack}
            </pre>
            <button
              onClick={() => location.reload()}
              className="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-900"
            >
              Recharger
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
