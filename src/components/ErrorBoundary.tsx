import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-5">
          <div className="max-w-md mx-auto space-y-6 text-center">
            <div>
              <h1 className="text-3xl font-bold mb-3">Terjadi Kesalahan</h1>
              <p className="text-slate-400 mb-4">
                Aplikasi mengalami masalah. Silakan muat ulang halaman atau hubungi dukungan.
              </p>
              {this.state.error && (
                <details className="mt-4 p-4 bg-slate-900 rounded-lg text-left text-xs text-slate-300 overflow-auto max-h-40">
                  <summary className="cursor-pointer font-mono font-semibold mb-2">
                    Detail Error
                  </summary>
                  <code className="block whitespace-pre-wrap break-words">
                    {this.state.error.message}
                  </code>
                </details>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-500 text-slate-950 font-semibold rounded-lg hover:opacity-90 transition"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
