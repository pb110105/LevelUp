
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';

import AuraCard from '../components/AuraCard';
import TaskCard from '../components/TaskCard';
import GlassCard from '../components/GlassCard';

import { COLORS } from '../constants/theme';
import type { Task } from '../types';
import type { useLevelUp } from '../hooks/useLevelUp';

type LevelUpState = ReturnType<typeof useLevelUp>;

type Props = {
  levelUp: LevelUpState;
  onCreateTask: () => void;
};

export default function HomeScreen({
  levelUp,
  onCreateTask,
}: Props) {
  const {
    progress,
    aura,
    level,
    levelXp,
    levelProgress,
    tasks,
    completedToday,
    completedCount,
    totalTasks,
    completeTask,
    deleteTask,
  } = levelUp;


const handleTaskPress = (task: Task) => {
  // Hành động tiêu cực cần xác nhận trước khi trừ Aura
  if (task.points < 0) {
    Alert.alert(
      'Xác nhận trừ Aura',
      `Ghi nhận "${task.name}" và trừ ${Math.abs(task.points)} Aura?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => completeTask(task),
        },
      ]
    );
    return;
  }

  // Hành động tích cực: có thể ghi nhận nhiều lần
  completeTask(task);
};


  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Thông tin Aura và cấp độ */}
      <AuraCard
        aura={aura}
        level={level}
        levelXp={levelXp}
        levelProgress={levelProgress}
      />

      {/* Tiêu đề danh sách nhiệm vụ */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.title}>
            Today's Quests
          </Text>

          <Text style={styles.subtitle}>
            Nhiệm vụ lặp lại mỗi ngày
          </Text>
        </View>

        <GlassCard style={styles.counter}>
          <Text style={styles.counterText}>
            {completedCount}/{totalTasks}
          </Text>
        </GlassCard>
      </View>

      {/* Danh sách nhiệm vụ */}
      
{tasks.length > 0 ? (
  tasks.map(task => {
    const done = completedToday.includes(task.id);

    const count =
      progress.dailyCounts?.[task.id] ??
      (done ? 1 : 0);

    return (
      <TaskCard
        key={task.id}
        task={task}
        done={done}
        count={count}
        onPress={() => handleTaskPress(task)}
        onDelete={() => deleteTask(task)}
      />
    );
  })
) : (
  <GlassCard style={styles.emptyCard}>
    <Text style={styles.emptyTitle}>
      Chưa có nhiệm vụ nào
    </Text>

    <Text style={styles.emptyText}>
      Hãy tạo nhiệm vụ đầu tiên để bắt đầu
      hành trình LevelUp của bạn.
    </Text>

    <Pressable
      style={styles.emptyButton}
      onPress={onCreateTask}
    >
      <Text style={styles.emptyButtonText}>
        + Tạo nhiệm vụ
      </Text>
    </Pressable>
  </GlassCard>
)}


      {/* Nút tạo thêm nhiệm vụ */}
      {tasks.length > 0 && (
        <Pressable
          onPress={onCreateTask}
          style={styles.addTaskButton}
        >
          <Text style={styles.addTaskText}>
            + Thêm nhiệm vụ mới
          </Text>
        </Pressable>
      )}

      <Text style={styles.hint}>
        Vuốt nhiệm vụ sang trái để xoá
      </Text>

      {/* Lời nhắc mỗi ngày */}
      <GlassCard style={styles.reminder}>
        <Text style={styles.reminderTitle}>
          ✦ Daily Reminder
        </Text>

        <Text style={styles.reminderText}>
          Mỗi hành động nhỏ hôm nay đều góp phần
          tạo nên phiên bản tốt hơn của bạn.
        </Text>
      </GlassCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 15,
    paddingBottom: 36,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 16,
  },

  title: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: '700',
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
  },

  counter: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 25,
  },

  counterText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '700',
  },

  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },

  emptyTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
  },

  emptyText: {
    color: COLORS.muted,
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 21,
  },

  emptyButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginTop: 20,
  },

  emptyButtonText: {
    color: COLORS.darkText,
    fontWeight: '700',
  },

  addTaskButton: {
    padding: 17,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.line,
    alignItems: 'center',
    marginTop: 5,
  },

  addTaskText: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '600',
  },

  hint: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 18,
  },

  reminder: {
    padding: 20,
    marginTop: 25,
  },

  reminderTitle: {
    color: COLORS.gold,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },

  reminderText: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 21,
  },
});
