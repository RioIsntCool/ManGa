import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Content } from '../types';

interface PanelContentProps {
  content: Content;
  onUpdate: (text: string) => void;
  onDelete: () => void;
  isActive: boolean;
}

export const PanelContent: React.FC<PanelContentProps> = ({
  content,
  onUpdate,
  onDelete,
  isActive,
}) => {
  return (
    <div className="mb-3 pl-4 border-l-2 border-gray-700">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span
          className={`text-sm ${
            content.type === 'dialogue' ? 'text-blue-400' : 'text-green-400'
          }`}
        >
          {content.type === 'dialogue' ? 'Dialogue' : 'Action'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 text-red-400 hover:text-red-300 transition-colors rounded-full hover:bg-gray-600"
          title="Delete section"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <textarea
        value={content.text}
        onChange={(e) => onUpdate(e.target.value)}
        className="w-full bg-gray-700 text-white p-3 rounded resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
        rows={2}
        placeholder={
          content.type === 'dialogue' ? "Character's dialogue..." : 'Action description...'
        }
        autoFocus={isActive}
      />
    </div>
  );
};