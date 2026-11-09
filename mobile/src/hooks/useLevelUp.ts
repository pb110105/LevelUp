
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState } from 'react-native';

import { Progress, Task, TaskKind } from '../types';
import { createInitialProgress } from '../constants/tasks';
import { loadProgress, saveProgress } from '../services/storage';
import { today } from '../utils/date';
import {
  calculateLevel,
  calculateLevelXP,
  calculateLevelProgress,
} from '../utils/progression';

type CreateTaskInput = {
  name: string;
  points: number;
  kind: TaskKind;
};

export function useLevelUp() {
  const [progress, setProgress] = useState<Progress>(
    createInitialProgress
  );

  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(
    null
  );

  const loadedRef = useRef(false);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());

  // 1. Đọc dữ liệu đã lưu khi mở ứng dụng
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const saved = await loadProgress();

        if (!mounted) return;

        setProgress(saved);
        loadedRef.current = true;
      } catch (error) {
        if (!mounted) return;

        setStorageError(
          'Không thể đọc dữ liệu LevelUp. Vui lòng kiểm tra bộ nhớ.'
        );

        Alert.alert(
          'Lỗi dữ liệu',
          'Không thể tải tiến độ. Ứng dụng sẽ không ghi đè dữ liệu cũ.'
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Lưu dữ liệu sau mỗi thay đổi
  useEffect(() => {
    if (!loadedRef.current || loading || storageError) return;

    // Xếp hàng các lần ghi để tránh ghi đè sai thứ tự.
    saveQueueRef.current = saveQueueRef.current
      .catch(() => undefined)
      .then(() => saveProgress(progress));

    saveQueueRef.current.catch(() => {
      setStorageError('Không thể lưu tiến độ LevelUp.');
    });
  }, [progress, loading, storageError]);

  // 3. Làm mới trạng thái nhiệm vụ mỗi ngày
 
const refreshDailyTasks = useCallback(() => {
  setProgress(prev => {
    const currentDay = today();

    if (prev.date === currentDay) return prev;

    return {
      ...prev,
      date: currentDay,
      completed: [],
      dailyCounts: {},
    };
  });
}, []);

  // Kiểm tra khi ứng dụng hoạt động lại
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      state => {
        if (state === 'active') {
          refreshDailyTasks();
        }
      }
    );

    // Kiểm tra cả khi ứng dụng đang mở qua nửa đêm
    const timer = setInterval(refreshDailyTasks, 60000);

    return () => {
      subscription.remove();
      clearInterval(timer);
    };
  }, [refreshDailyTasks]);

  // 4. Hoàn thành nhiệm vụ
 
const completeTask = useCallback((task: Task) => {
  setProgress(prev => {
    const currentDay = today();

    const completed =
      prev.date === currentDay ? prev.completed : [];

    const counts =
      prev.date === currentDay
        ? (prev.dailyCounts ?? {})
        : {};

    // Kiểm tra nhiệm vụ còn tồn tại
    const existingTask = prev.tasks.find(
      item => item.id === task.id
    );

    if (!existingTask) return prev;

    const oldCount =
      counts[task.id] ??
      (completed.includes(task.id) ? 1 : 0);

    return {
      ...prev,
      date: currentDay,

      // Mỗi lần nhấn đều cộng/trừ Aura
      aura: prev.aura + existingTask.points,

      // Chỉ điểm tích cực được cộng XP
      xp: prev.xp + Math.max(0, existingTask.points),

      // Giữ danh sách nhiệm vụ đã làm ít nhất 1 lần
      completed: completed.includes(task.id)
        ? completed
        : [...completed, task.id],

      // Ghi nhận tổng số lần trong ngày
      dailyCounts: {
        ...counts,
        [task.id]: oldCount + 1,
      },
    };
  });
}, []);

  // 5. Tạo nhiệm vụ tùy chỉnh
  const createTask = useCallback(
    ({ name, points, kind }: CreateTaskInput): boolean => {
      const title = name.trim();

      if (!title) {
        Alert.alert(
          'Thiếu tên nhiệm vụ',
          'Vui lòng nhập tên nhiệm vụ.'
        );
        return false;
      }

      if (
        !Number.isFinite(points) ||
        !Number.isInteger(points) ||
        points < 1 ||
        points > 10000
      ) {
        Alert.alert(
          'Điểm Aura không hợp lệ',
          'Vui lòng nhập số nguyên từ 1 đến 10.000.'
        );
        return false;
      }

      const signedPoints =
        kind === 'positive' ? points : -points;

      const newTask: Task = {
        id: `custom-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        name: title,
        points: signedPoints,
        custom: true,
      };

      setProgress(prev => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
      }));

      return true;
    },
    []
  );

  // 6. Xóa nhiệm vụ tự tạo

const deleteTask = useCallback((task: Task) => {
  Alert.alert(
    'Xóa nhiệm vụ?',
    `Bạn có chắc muốn xóa "${task.name}"?`,
    [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          setProgress(prev => {
            const nextCounts = {
              ...(prev.dailyCounts ?? {}),
            };

            delete nextCounts[task.id];

            return {
              ...prev,
              tasks: prev.tasks.filter(
                item => item.id !== task.id
              ),
              completed: prev.completed.filter(
                id => id !== task.id
              ),
              dailyCounts: nextCounts,
            };
          });
        },
      },
    ]
  );
}, []);

  // 7. Các chỉ số nhân vật
  const level = calculateLevel(progress.xp);
  const levelXp = calculateLevelXP(progress.xp);
  const levelProgress = calculateLevelProgress(progress.xp);

  const completedToday =
    progress.date === today() ? progress.completed : [];

  const totalTasks = progress.tasks.length;
  const completedCount = completedToday.length;

  return {
    // Trạng thái
    progress,
    loading,
    storageError,

    // Chỉ số
    aura: progress.aura,
    xp: progress.xp,
    level,
    levelXp,
    levelProgress,

    // Nhiệm vụ
    tasks: progress.tasks,
    completedToday,
    totalTasks,
    completedCount,

    // Chức năng
    completeTask,
    createTask,
    deleteTask,
    refreshDailyTasks,
  };
}
