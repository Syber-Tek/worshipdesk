import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
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
    console.error('Church Presenter ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-[#0B0C0E] text-[#EDEDEE] flex flex-col items-center justify-center p-8 select-none font-sans">
          <div className="max-w-lg w-full bg-[#141518] border border-[#26282E] rounded-xl p-6 space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 rounded-xl bg-[#E5484D]/10 border border-[#E5484D]/30 flex items-center justify-center text-[#E5484D] font-bold text-lg mx-auto">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-[#EDEDEE]">
              Church Presenter Application Error
            </h2>
            <p className="text-xs text-[#9B9CA3] leading-relaxed">
              An unexpected issue occurred while rendering the interface:
            </p>
            <div className="bg-[#0B0C0E] border border-[#26282E] p-3 rounded text-left overflow-x-auto max-h-36">
              <code className="text-[11px] text-[#E5484D] font-mono break-all">
                {this.state.error?.toString() || 'Unknown Error'}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#D4A94A] hover:bg-[#D4A94A]/90 text-[#0B0C0E] font-bold text-xs rounded transition shadow cursor-pointer"
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
