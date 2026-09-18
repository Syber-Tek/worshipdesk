import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/plus-jakarta-sans/800.css'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('WorshipDesk ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-surface text-text-primary flex flex-col items-center justify-center p-8 select-none font-sans">
          <div className="max-w-lg w-full bg-panel border border-border rounded-xl p-6 space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-xl bg-live/10 border border-live/30 flex items-center justify-center text-live font-bold text-lg mx-auto">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-text-primary">
              WorshipDesk Application Error
            </h2>
            <p className="text-xs text-dim leading-relaxed">
              An unexpected issue occurred while rendering the interface:
            </p>
            <div className="bg-surface border border-border p-3 rounded text-left overflow-x-auto max-h-36">
              <code className="text-[11px] text-live font-mono break-all">
                {this.state.error?.toString() || 'Unknown Error'}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-accent hover:bg-accent/90 text-bg font-bold text-xs rounded transition shadow cursor-pointer"
            >
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
