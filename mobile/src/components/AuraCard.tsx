
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import GlassCard from './GlassCard';
import { COLORS } from '../constants/theme';

type Props = {
  aura: number;
  level: number;
  levelXp: number;
  levelProgress: number;
};

export default function AuraCard({
  aura,
  level,
  levelXp,
  levelProgress,
}: Props) {
  const progress = Math.max(
    0,
    Math.min(100, levelProgress)
  );

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.eyebrow}>CURRENT AURA</Text>

      <Text style={styles.aura}>
        {aura.toLocaleString('vi-VN')}
      </Text>

      <Text style={styles.auraLabel}>
        ✦ Aura Points
      </Text>

      <View style={styles.divider} />

      <View style={styles.levelRow}>
        <View>
          <Text style={styles.muted}>Level</Text>
          <Text style={styles.level}>{level}</Text>
        </View>

        <View style={styles.right}>
          <Text style={styles.muted}>XP Progress</Text>
          <Text style={styles.xp}>
            {levelXp} / 100 XP
          </Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${progress}%` },
          ]}
        />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
  },
  eyebrow: {
    color: COLORS.muted,
    letterSpacing: 2,
    fontSize: 11,
  },
  aura: {
    color: COLORS.white,
    fontSize: 58,
    fontWeight: '700',
    marginTop: 14,
  },
  auraLabel: {
    color: COLORS.gold,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.line,
    marginVertical: 24,
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  muted: {
    color: COLORS.muted,
    fontSize: 12,
  },
  level: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: '700',
    marginTop: 7,
  },
  right: {
    alignItems: 'flex-end',
  },
  xp: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
  },
  progressTrack: {
    height: 8,
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.gold,
    borderRadius: 10,
  },
});
