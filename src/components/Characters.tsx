import React from 'react';
import { UserPlus } from 'lucide-react';

export const Characters: React.FC = () => {
  return (
    <div className="text-center py-12">
      <UserPlus className="w-16 h-16 mx-auto text-gray-600 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-400 mb-2">No Characters Yet</h2>
      <p className="text-gray-500">
        Character management features coming soon...
      </p>
    </div>
  );
};