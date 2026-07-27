import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-mono">
          <div className="max-w-lg p-6 bg-slate-900 border border-rose-500/40 rounded-2xl shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-rose-400">⚠️ Application Runtime Exception</h2>
            <p className="text-xs text-slate-300">An unexpected rendering error occurred:</p>
            <pre className="p-3 bg-slate-950 rounded-xl text-xs text-rose-300 overflow-x-auto whitespace-pre-wrap border border-rose-500/20">
              {this.state.error?.toString()}
            </pre>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl"
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
