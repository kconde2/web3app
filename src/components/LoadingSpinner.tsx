'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}

export function LoadingSpinner({
  size = 'md',
  message = 'Chargement...',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`}></div>
      {message && (
        <p className={`text-gray-600 ${textSizeClasses[size]}`}>
          {message}
        </p>
      )}
    </div>
  )
}

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Récupération du solde en cours...' }: LoadingStateProps) {
  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
        <div className="text-center">
          <LoadingSpinner size="lg" message={message} />
          <div className="mt-4 space-y-2">
            <div className="text-sm text-gray-500">
              Connexion à la blockchain...
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
