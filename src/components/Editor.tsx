import React, { useState, useEffect } from 'react';
import { Download, Upload, Save } from 'lucide-react';
import { Panel } from './Panel';
import type { Panel as PanelType, Project } from '../types';

interface EditorProps {
  panels: PanelType[];
  setPanels: React.Dispatch<React.SetStateAction<PanelType[]>>;
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
}

export const Editor: React.FC<EditorProps> = ({
  panels,
  setPanels,
  projectName,
  setProjectName,
}) => {
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [spaceCount, setSpaceCount] = useState(0);
  const [lastSpaceTime, setLastSpaceTime] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        setPanels(prev => [...prev, { id: Date.now().toString(), content: [] }]);
        setCurrentPanelIndex(prev => prev + 1);
      }

      if (e.key === ' ' && !e.repeat) {
        e.preventDefault();
        const now = Date.now();

        if (lastSpaceTime && now - lastSpaceTime < 300) {
          setSpaceCount(prev => prev + 1);
          
          if (spaceCount === 1) {
            addContent(currentPanelIndex, 'action');
            setSpaceCount(0);
            setLastSpaceTime(null);
          }
        } else {
          setSpaceCount(1);
          setLastSpaceTime(now);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setTimeout(() => {
          if (spaceCount === 2) {
            addContent(currentPanelIndex, 'dialogue');
          }
          setSpaceCount(0);
          setLastSpaceTime(null);
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [lastSpaceTime, currentPanelIndex, spaceCount]);

  const addContent = (panelIndex: number, type: 'dialogue' | 'action') => {
    setPanels(prev => {
      const newPanels = [...prev];
      const currentPanel = newPanels[panelIndex];
      newPanels[panelIndex] = {
        ...currentPanel,
        content: [
          ...currentPanel.content,
          { id: Date.now().toString(), type, text: '' },
        ],
      };
      return newPanels;
    });
  };

  const deleteContent = (panelIndex: number, contentIndex: number) => {
    setPanels(prev => {
      const newPanels = [...prev];
      const currentPanel = newPanels[panelIndex];
      newPanels[panelIndex] = {
        ...currentPanel,
        content: currentPanel.content.filter((_, i) => i !== contentIndex),
      };
      return newPanels;
    });
  };

  const updateContent = (panelIndex: number, contentIndex: number, text: string) => {
    setPanels(prev => {
      const newPanels = [...prev];
      newPanels[panelIndex].content[contentIndex].text = text;
      return newPanels;
    });
  };

  const deletePanel = (index: number) => {
    setPanels(prev => prev.filter((_, i) => i !== index));
    if (currentPanelIndex >= index) {
      setCurrentPanelIndex(prev => Math.max(0, prev - 1));
    }
  };

  const saveProject = () => {
    const project: Project = {
      id: Date.now().toString(),
      name: projectName,
      panels,
      characters: [],
      lastModified: Date.now()
    };

    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}.manga.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadProject = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const project: Project = JSON.parse(e.target?.result as string);
        setPanels(project.panels);
        setProjectName(project.name);
        setCurrentPanelIndex(0);
      } catch (error) {
        alert('Error loading project file. Please make sure it\'s a valid .manga.json file.');
      }
    };
    reader.readAsText(file);
  };

  const exportScript = () => {
    const script = panels
      .map((panel, index) => {
        const content = panel.content
          .map(item => `${item.type.toUpperCase()}: ${item.text}`)
          .join('\n');
        return `PANEL ${index + 1}:\n${content}\n`;
      })
      .join('\n---\n\n');

    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-end gap-4 mb-6">
        <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors cursor-pointer">
          <Upload className="w-4 h-4" />
          Load Project
          <input
            type="file"
            accept=".manga.json"
            onChange={loadProject}
            className="hidden"
          />
        </label>
        <button
          onClick={saveProject}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Project
        </button>
        <button
          onClick={exportScript}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Script
        </button>
      </div>

      <div className="space-y-6">
        {panels.map((panel, panelIndex) => (
          <Panel
            key={panel.id}
            panel={panel}
            panelIndex={panelIndex}
            isActive={currentPanelIndex === panelIndex}
            onDelete={deletePanel}
            onContentUpdate={updateContent}
            onContentDelete={deleteContent}
            onContentAdd={addContent}
            onClick={() => setCurrentPanelIndex(panelIndex)}
          />
        ))}
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Press ENTER to create a new panel</p>
        <p>Double SPACE for action, Triple SPACE for dialogue</p>
      </div>
    </div>
  );
};