import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; message: string };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Ismeretlen hiba' };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('App hiba:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center">
          <div className="glass rounded-3xl p-8 max-w-md shadow-card">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Valami hiba történt</h1>
            <p className="text-sm text-gray-500 mb-1">Az alkalmazás nem tudott betöltődni.</p>
            <p className="text-xs text-rose-500 font-mono break-all mb-5">{this.state.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold shadow-soft active:scale-95"
            >
              Újratöltés
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
