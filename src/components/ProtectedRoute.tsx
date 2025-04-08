
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate, loading]);

  if (loading) {
    return (
      <div className="p-4 w-full max-w-6xl mx-auto">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-64 w-full mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
