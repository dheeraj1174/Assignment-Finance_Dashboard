import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg">
            <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-text-secondary animate-pulse">Loading FinBoard...</p>
            </div>
        </div>
    );
}
