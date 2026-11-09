
import { Task, Progress } from '../types';
import { today } from '../utils/date';

export const DEFAULT_TASKS: Task[] = [
  {
    id: 'default-1',
    name: 'Tập thể dục 30 phút',
    points: 30,
    custom: false,
  },
  {
    id: 'default-2',
    name: 'Học kỹ năng mới',
    points: 25,
    custom: false,
  },
  {
    id: 'default-3',
    name: 'Đọc sách 15 phút',
    points: 15,
    custom: false,
  },
  {
    id: 'default-4',
    name: 'Uống đủ nước',
    points: 10,
    custom: false,
  },
  {
    id: 'default-5',
    name: 'Ngủ đúng giờ',
    points: 20,
    custom: false,
  },
];

export const createInitialProgress = (): Progress => ({
  aura: 0,
  xp: 0,
  completed: [],
  dailyCounts: {},
  date: today(),
  tasks: [...DEFAULT_TASKS],
});
