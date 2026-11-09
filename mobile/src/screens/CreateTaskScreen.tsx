
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Keyboard,
} from 'react-native';

import GlassCard from '../components/GlassCard';
import { COLORS } from '../constants/theme';

import type { TaskKind } from '../types';
import type { useLevelUp } from '../hooks/useLevelUp';

type LevelUpState = ReturnType<typeof useLevelUp>;

type Props = {
  levelUp: LevelUpState;
  onTaskCreated: () => void;
};

export default function CreateTaskScreen({
  levelUp,
  onTaskCreated,
}: Props) {
  const [name, setName] = useState('');
  const [points, setPoints] = useState('20');

  const [kind, setKind] =
    useState<TaskKind>('positive');

  const handleCreate = () => {
    const amount = Number(
      points.trim().replace(',', '.')
    );

    const success = levelUp.createTask({
      name,
      points: amount,
      kind,
    });

    if (success) {
      Keyboard.dismiss();

      setName('');
      setPoints('20');
      setKind('positive');

      onTaskCreated();
    }
  };

  const positive = kind === 'positive';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heading}>
        <Text style={styles.title}>
          Create a Quest
        </Text>

        <Text style={styles.subtitle}>
          Tạo nhiệm vụ của riêng bạn.
          Nhiệm vụ sẽ xuất hiện mỗi ngày.
        </Text>
      </View>

      <GlassCard style={styles.formCard}>
        {/* Tên nhiệm vụ */}
        <Text style={styles.label}>
          TÊN NHIỆM VỤ
        </Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ví dụ: Học tiếng Anh 30 phút"
          placeholderTextColor={COLORS.muted}
          maxLength={100}
          autoCapitalize="sentences"
        />

        {/* Loại nhiệm vụ */}
        <Text style={styles.label}>
          LOẠI NHIỆM VỤ
        </Text>

        <View style={styles.typeRow}>
          <Pressable
            onPress={() => setKind('positive')}
            style={[
              styles.typeButton,
              positive && styles.typeActive,
            ]}
          >
            <Text
              style={[
                styles.typeText,
                positive && styles.typeTextActive,
              ]}
            >
              + Tích cực
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setKind('negative')}
            style={[
              styles.typeButton,
              !positive && styles.typeActive,
            ]}
          >
            <Text
              style={[
                styles.typeText,
                !positive && styles.typeTextActive,
              ]}
            >
              − Tiêu cực
            </Text>
          </Pressable>
        </View>

        {/* Số điểm Aura */}
        <Text style={styles.label}>
          SỐ ĐIỂM AURA
        </Text>

        <TextInput
          style={styles.input}
          value={points}
          onChangeText={setPoints}
          placeholder="20"
          placeholderTextColor={COLORS.muted}
          keyboardType="number-pad"
          maxLength={5}
        />

        {/* Xem trước */}
        <View style={styles.preview}>
          <Text style={styles.previewLabel}>
            Điểm Aura khi ghi nhận
          </Text>

          <Text
            style={[
              styles.previewValue,
              !positive && styles.negative,
            ]}
          >
            {positive ? '+' : '−'}
            {points || '0'} ✦
          </Text>
        </View>

        {/* Tạo nhiệm vụ */}
        <Pressable
          onPress={handleCreate}
          style={styles.createButton}
        >
          <Text style={styles.createButtonText}>
            + TẠO NHIỆM VỤ
          </Text>
        </Pressable>
      </GlassCard>

      {/* Thông tin */}
      <GlassCard style={styles.noteCard}>
        <Text style={styles.noteTitle}>
          ✦ Daily Quest
        </Text>

        <Text style={styles.noteText}>
          Nhiệm vụ được lưu lâu dài và làm mới
          trạng thái mỗi ngày.
          {'\n\n'}
          Nhiệm vụ tích cực cộng Aura và XP.
          Nhiệm vụ tiêu cực chỉ trừ Aura.
          {'\n\n'}
          Điểm đã tích lũy không bị xóa khi
          bắt đầu ngày mới.
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
    paddingTop: 20,
    paddingBottom: 36,
  },

  heading: {
    marginBottom: 25,
  },

  title: {
    color: COLORS.white,
    fontSize: 29,
    fontWeight: '700',
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 10,
  },

  formCard: {
    padding: 22,
  },

  label: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 10,
    marginBottom: 12,
  },

  input: {
    color: COLORS.white,
    fontSize: 15,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 22,
  },

  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },

  typeButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
  },

  typeActive: {
    backgroundColor: 'rgba(232,214,174,0.20)',
    borderColor: COLORS.gold,
  },

  typeText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: '600',
  },

  typeTextActive: {
    color: COLORS.white,
  },

  preview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 23,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 14,
  },

  previewLabel: {
    color: COLORS.muted,
    fontSize: 12,
    flex: 1,
  },

  previewValue: {
    color: COLORS.gold,
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 10,
  },

  negative: {
    color: COLORS.red,
  },

  createButton: {
    backgroundColor: COLORS.gold,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },

  createButtonText: {
    color: COLORS.darkText,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },

  noteCard: {
    marginTop: 22,
    padding: 20,
  },

  noteTitle: {
    color: COLORS.gold,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },

  noteText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 20,
  },
});
