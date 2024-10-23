import React from 'react';
import { Trash2, BookOpenCheck, MessageSquare, Play } from 'lucide-react';
import { PanelContent } from './PanelContent';
import type { Panel as PanelType } from '../types';

interface PanelProps {
  panel: PanelType;
  panelIndex: number;
  isActive: boolean;
  onDelete: (index: number) => void;
  onContentUpdate: (panelIndex: number, contentIndex: number, text: string) => void;
  onContentDelete: (panelIndex: number, contentIndex: number) => void;
  onContentAdd: (panelIndex: number, type: 'dialogue' | 'action') => void;
  onClick: () => void;
}

export const Panel: React.FC<PanelProps> = ({
  panel,
  panelIndex,
  isActive,
  onDelete,
  onContentUpdate,
  onContentDelete,
  onContentAdd,
  onClick,
}) => {
  return (
    <div
      className={`p-6 rounded-lg ${
        isActive ? 'bg-gray-800 border-2 border-yellow-400' : 'bg-gray-800'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-yellow-400">
          Panel {panelIndex + 1}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContentAdd(panelIndex, 'dialogue');
            }}
            className="p-2 text-blue-400 hover:text-blue-300 transition-colors rounded hover:bg-gray-700"
            title="Add dialogue"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContentAdd(panelIndex, 'action');
            }}
            className="p-2 text-green-400 hover:text-green-300 transition-colors rounded hover:bg-gray-700"
            title="Add action"
          >
            <Play className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(panelIndex);
            }}
            className="p-2 text-red-400 hover:text-red-300 transition-colors rounded hover:bg-gray-700"
            title="Delete panel"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {panel.content.map((content, contentIndex) => (
        <PanelContent
          key={content.id}
          content={content}
          onUpdate={(text) => onContentUpdate(panelIndex, contentIndex, text)}
          onDelete={() => onContentDelete(panelIndex, contentIndex)}
          isActive={isActive}
        />
      ))}

      {panel.content.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          <BookOpenCheck className="w-6 h-6 mx-auto mb-2" />
          <p>Use the buttons above or keyboard shortcuts:</p>
          <p>Double SPACE for action, Triple SPACE for dialogue</p>
        </div>
      )}
    </div>
  );
};