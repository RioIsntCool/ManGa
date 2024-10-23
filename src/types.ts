export interface Content {
  id: string;
  type: 'dialogue' | 'action';
  text: string;
  characterId?: string; // For dialogue type only
}

export interface Panel {
  id: string;
  content: Content[];
}

export interface Character {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  personality?: string;
  background?: string;
  relationships?: string;
  notes?: string;
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  characters: Character[];
  panels: Panel[];
  lastModified: number;
}