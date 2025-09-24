import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="text-center">
        <div className="mb-8">
          <ApperIcon name="AlertCircle" className="h-24 w-24 text-slate-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
          <p className="text-xl text-slate-600">Page not found</p>
        </div>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          <ApperIcon name="Home" className="h-4 w-4 mr-2" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;