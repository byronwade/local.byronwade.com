"use client";

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              Component Error
            </span>
          </div>
          <p className="text-sm text-red-700 dark:text-red-300">
            This section encountered an error and couldn't load properly.
          </p>
          {this.props.fallback && this.props.fallback(this.state.error)}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
