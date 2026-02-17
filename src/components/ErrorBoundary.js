import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      errorId: Date.now().toString()
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // You could also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            
            <h1 className="text-xl font-semibold text-center text-gray-900 mb-2">
              Something went wrong
            </h1>
            
            <p className="text-gray-600 text-center mb-6">
              We're sorry, but something unexpected happened. The error has been logged and our team will look into it.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 p-4 bg-gray-100 rounded-lg">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="mt-2 text-xs text-gray-600">
                  <p className="font-medium mb-1">Error:</p>
                  <pre className="whitespace-pre-wrap mb-3 overflow-x-auto">
                    {this.state.error.toString()}
                  </pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <p className="font-medium mb-1">Component Stack:</p>
                      <pre className="whitespace-pre-wrap overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                  
                  <p className="font-medium mb-1 mt-3">Error ID:</p>
                  <code className="bg-gray-200 px-2 py-1 rounded">
                    {this.state.errorId}
                  </code>
                </div>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                <RefreshCw size={16} />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Reload Page
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                If this problem persists, please contact support.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Error ID: {this.state.errorId}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
