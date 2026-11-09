
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Progress } from '../types';
import {
  DEFAULT_TASKS,
  createInitialProgress,
} from '../constants/tasks';
import { today } from '../utils/date';

export const STORAGE_KEY = 'levelup_progress_v3';
export const OLD_STORAGE_KEY = 'levelup_progress_v2';

// Chuyển dữ liệu từ phiên bản cũ sang cấu trúc mới
function migrateOld(data: any): Progress {
  return {
    aura: Number(data.aura) || 0,
    xp: Number(data.xp) || 0,
    date: data.date || today(),
    completed: Array.isArray(data.completed)
      ? data.completed.map(
          (id: number) => `default-${id}`
        )
      : [],
    tasks: [...DEFAULT_TASKS],
  };
}

// Đọc dữ liệu người dùng
export async function loadProgress(): Promise<Progress> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY);

  let progress: Progress;

  if (saved) {
    progress = JSON.parse(saved) as Progress;
  } else {
    const old = await AsyncStorage.getItem(OLD_STORAGE_KEY);

    progress = old
      ? migrateOld(JSON.parse(old))
      : createInitialProgress();
  }

  if (!Array.isArray(progress.tasks)) {
    progress.tasks = [...DEFAULT_TASKS];
  }

  // Làm mới trạng thái, không xóa điểm Aura hoặc XP

    if (progress.date !== today()) {
    progress = {
        ...progress,
        date: today(),
        completed: [],
        dailyCounts: {},
    };
    } else {
    // Dữ liệu từ phiên bản cũ:
    // mỗi nhiệm vụ đã hoàn thành được tính là 1 lần.
    const existingCounts = progress.dailyCounts ?? {};

    progress = {
        ...progress,
        dailyCounts: Object.fromEntries(
        (progress.completed ?? []).map(id => [
            id,
            Math.max(1, existingCounts[id] ?? 1),
        ])
        ),
    };
    }


  return progress;
}

// Lưu dữ liệu người dùng
export async function saveProgress(
  progress: Progress
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(progress)
  );
}
