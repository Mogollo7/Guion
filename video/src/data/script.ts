import guion from './guion.json';

export type Speaker = 'salome' | 'daniela' | 'juan' | 'maria';
export type Plano = { id: string; speaker: Speaker; text: string; plate: string };

export const SPEAKERS = guion.speakers as Record<Speaker, { name: string; role: string; chapter: string }>;
export const PLANOS = guion.planos as Plano[];
export const WORDS_PER_SEC = guion.wordsPerSec;
export const wordCount = (t: string) => t.split(/\s+/).filter(Boolean).length;
