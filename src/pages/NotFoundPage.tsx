import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-9xl font-bold text-primary-500">404</h1>
      <h2 className="text-3xl font-semibold mt-4 mb-6 text-center">Page Not Found</h2>
      <p className="text-slate-600 text-center max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={18} className="mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;