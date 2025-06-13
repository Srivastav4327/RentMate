interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner = ({ size = 'medium' }: LoadingSpinnerProps) => {
  const sizeClass = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-2',
    large: 'w-12 h-12 border-3',
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`${sizeClass[size]} rounded-full border-solid border-gray-200 border-t-primary-500 animate-spin`} 
        role="status" 
        aria-label="loading"
      />
    </div>
  );
};

export default LoadingSpinner;