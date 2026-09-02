import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-4 bg-slate-900/90 border border-white/10 p-8 rounded-3xl shadow-2xl">
            <span className="text-4xl">🎳</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Coś poszło nie tak</h2>
            <p className="text-sm text-slate-400">
              Wystąpił nieoczekiwany błąd. Kliknij poniżej, aby odświeżyć stronę.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white text-xs font-black uppercase tracking-widest cursor-pointer shadow-lg"
            >
              Odśwież stronę
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
