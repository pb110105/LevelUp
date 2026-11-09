
import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  PanResponder,
  StyleSheet,
} from 'react-native';

import GlassCard from './GlassCard';
import { COLORS } from '../constants/theme';
import type { Task } from '../types';

type Props = {
  task: Task;
  done: boolean;
  count: number;
  onPress: () => void;
  onDelete: () => void;
};

const DELETE_WIDTH = 92;

export default function TaskCard({
  task,
  done,
  count,
  onPress,
  onDelete,
}: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const opened = useRef(false);

  const animateTo = (position: number) => {
    Animated.spring(translateX, {
      toValue: position,
      useNativeDriver: true,
      tension: 90,
      friction: 12,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 12 &&
          Math.abs(gesture.dx) >
            Math.abs(gesture.dy) * 1.25,

        onPanResponderMove: (_, gesture) => {
          const start = opened.current ? -DELETE_WIDTH : 0;

          const next = Math.max(
            -DELETE_WIDTH,
            Math.min(0, start + gesture.dx)
          );

          translateX.setValue(next);
        },

        onPanResponderRelease: (_, gesture) => {
          const shouldOpen = opened.current
            ? gesture.dx < 35
            : gesture.dx < -40;

          opened.current = shouldOpen;
          animateTo(shouldOpen ? -DELETE_WIDTH : 0);
        },

        onPanResponderTerminate: () => {
          animateTo(opened.current ? -DELETE_WIDTH : 0);
        },
      }),
    [translateX]
  );

  const handlePress = () => {
    if (opened.current) {
      opened.current = false;
      animateTo(0);
      return;
    }

    onPress();
  };

  const handleDelete = () => {
    opened.current = false;
    animateTo(0);
    onDelete();
  };

  const positive = task.points > 0;

  return (
    <View style={styles.container}>
      {/* Nút xóa nằm phía sau */}
      <View style={styles.deleteBackground}>
        <Pressable
          style={styles.deleteButton}
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel={`Xóa nhiệm vụ ${task.name}`}
        >
          <Text style={styles.deleteText}>Xóa</Text>
        </Pressable>
      </View>

      {/* Thẻ nhiệm vụ có thể kéo ngang */}
      <Animated.View
        style={[
          styles.foreground,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <Pressable onPress={handlePress}>
          <GlassCard style={styles.card}>
            <View
              style={[
                styles.checkbox,
                done && styles.checked,
              ]}
            >
              {done && (
                <Text style={styles.tick}>✓</Text>
              )}
            </View>

            <View style={styles.content}>
              <Text
                style={styles.name}
                numberOfLines={2}
              >
                {task.name}
              </Text>

              <Text style={styles.hint}>
                {count > 0
                  ? `Đã thực hiện ${count} lần · Chạm để ghi nhận tiếp`
                  : positive
                    ? 'Chạm để hoàn thành'
                    : 'Chạm để ghi nhận'}
              </Text>
            </View>

            <Text
              style={[
                styles.points,
                !positive && styles.negative,
              ]}
            >
              {positive ? '+' : '−'}
              {Math.abs(task.points)}
            </Text>
          </GlassCard>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 82,
  },

  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_WIDTH,
    backgroundColor: '#B54A54',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },

  deleteButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  foreground: {
    backgroundColor: '#182235',
    borderRadius: 20,
  },

  card: {
    padding: 17,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 82,
  },

  checkbox: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checked: {
    backgroundColor: COLORS.gold,
    borderColor: COLORS.gold,
  },

  tick: {
    color: COLORS.darkText,
    fontWeight: '900',
  },

  content: {
    flex: 1,
    marginHorizontal: 13,
  },

  name: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },

  hint: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 5,
    lineHeight: 16,
  },

  points: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '700',
  },

  negative: {
    color: COLORS.red,
  },
});
