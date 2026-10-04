import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
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
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-slate-950 text-slate-100">
          <div className="w-full max-w-lg p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-bold text-white font-display">
              {this.props.fallbackTitle || 'Se produjo un inconveniente en la vista'}
            </h3>

            <p className="text-xs text-slate-400 font-mono">
              {this.state.error?.message || 'Error inesperado de renderizado.'}
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recargar Vista</span>
              </button>

              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Ir a Portada</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
