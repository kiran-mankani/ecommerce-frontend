const ErrorState = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      <p style={{ color: "var(--color-danger)" }} className="text-sm font-medium">
        {message}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;