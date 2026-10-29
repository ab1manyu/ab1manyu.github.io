import { Component } from "react";

/**
 * Catches render errors in its subtree and shows a recoverable fallback
 * instead of a blank screen. Pass `resetKey` (e.g. the pathname) to clear the
 * error automatically when the user navigates away.
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <main
        role="alert"
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <div className="font-mono text-xs text-defense-accent">
          RUNTIME_ERROR
        </div>
        <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
        <p className="max-w-md text-sm text-gray-400">
          This section failed to load. You can try again or head back home.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="px-4 py-2 border border-defense-border rounded font-mono text-xs text-white hover:border-defense-accent transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-4 py-2 border border-defense-border rounded font-mono text-xs text-white hover:border-defense-accent transition-colors"
          >
            Home
          </a>
        </div>
      </main>
    );
  }
}
