import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#07120e] p-4">
          <div className="max-w-md w-full rounded-2xl border border-red-500/25 bg-slate-900/90 p-8 shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
            <div className="mb-4 flex justify-center">
              <div className="text-5xl">⚠️</div>
            </div>
            <h1 className="mb-2 text-center text-2xl font-bold text-slate-50">Something went wrong</h1>
            <p className="mb-6 text-center text-slate-300">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <details className="mb-6 rounded-xl border border-slate-700 bg-slate-950/80 p-4 text-sm text-slate-300">
              <summary className="mb-2 cursor-pointer font-semibold text-slate-100">Error details</summary>
              <pre className="mt-2 max-h-48 overflow-auto text-xs text-slate-300">
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
