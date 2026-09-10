import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App crashed", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="w-full max-w-md border border-slate-200 bg-white p-6 rounded-sm shadow-sm space-y-4">
            <h1 className="text-lg font-semibold text-slate-900">Something went wrong</h1>
            <p className="text-sm text-slate-600 break-words">
              {this.state.error.message || "Unknown error"}
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-slate-900 text-white text-sm rounded-sm"
              onClick={() => {
                this.setState({ error: null });
                window.location.assign("/");
              }}
            >
              Back to app home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
