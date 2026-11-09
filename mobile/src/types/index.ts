
export type Task = {
  id: string;
  name: string;
  points: number;
  custom: boolean;
};

export type Progress = {
  aura: number;
  xp: number;
  completed: string[];
  dailyCounts?: Record<string, number>;
  date: string;
  tasks: Task[];
};

export type Tab = 'home' | 'create';
export type TaskKind = 'positive' | 'negative';
