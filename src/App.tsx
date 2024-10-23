import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { Editor } from './components/Editor';
import { Characters } from './components/Characters';
import type { Panel as PanelType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'characters'>('editor');
  const [panels, setPanels] = useState<PanelType[]>([{ id: '1', content: [] }]);
  const [projectName, setProjectName] = useState<string>('Untitled Project');

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Pencil className="w-8 h-8 text-yellow-400" />
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-yellow-400">ManGa</h1>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-transparent text-gray-400 text-sm focus:outline-none focus:text-yellow-400 hover:text-yellow-400 transition-colors"
              />
            </div>
          </div>
        </header>

        <div className="mb-6">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex gap-4">
              <button
                onClick={() => setActiveTab('editor')}
                className={`py-2 px-4 font-medium transition-colors ${
                  activeTab === 'editor'
                    ? 'text-yellow-400 border-b-2 border-yellow-400'
                    : 'text-gray-400 hover:text-yellow-400'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab('characters')}
                className={`py-2 px-4 font-medium transition-colors ${
                  activeTab === 'characters'
                    ? 'text-yellow-400 border-b-2 border-yellow-400'
                    : 'text-gray-400 hover:text-yellow-400'
                }`}
              >
                Characters
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'editor' ? (
          <Editor
            panels={panels}
            setPanels={setPanels}
            projectName={projectName}
            setProjectName={setProjectName}
          />
        ) : (
          <Characters />
        )}
      </div>
    </div>
  );
}

export default App;