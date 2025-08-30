const LikeErrorBoundary = ({ children, onRetry }) => {
    const [hasError, setHasError] = useState(false);

    const resetError = () => {
        setHasError(false);
        onRetry();
    };

    return (
        <>
            {hasError ? (
                <div className="text-red-500 text-sm mt-2">
                    Failed to update like.{' '}
                    <button
                        onClick={resetError}
                        className="text-[#D4AF37] underline"
                    >
                        Try again
                    </button>
                </div>
            ) : (
                <ErrorBoundary
                    onError={() => setHasError(true)}
                    fallback={null}
                >
                    {children}
                </ErrorBoundary>
            )}
        </>
    );
};