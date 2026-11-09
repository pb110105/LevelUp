
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import GlassCard from './GlassCard';
import { COLORS } from '../constants/theme';
import type { Tab } from '../types';

type Props = {
  activeTab: Tab;
  onChangeTab: (tab: Tab) => void;
};

export default function BottomNavigation({
  activeTab,
  onChangeTab,
}: Props) {
  return (
    <View style={styles.outer}>
      <GlassCard style={styles.bar}>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{
            selected: activeTab === 'home',
          }}
          onPress={() => onChangeTab('home')}
          style={[
            styles.item,
            activeTab === 'home' && styles.active,
          ]}
        >
          <Ionicons
            name={
              activeTab === 'home'
                ? 'home'
                : 'home-outline'
            }
            size={22}
            color={COLORS.white}
          />
          <Text style={styles.label}>Hôm nay</Text>
        </Pressable>

        <Pressable
          accessibilityRole="tab"
          accessibilityState={{
            selected: activeTab === 'create',
          }}
          onPress={() => onChangeTab('create')}
          style={[
            styles.item,
            activeTab === 'create' && styles.active,
          ]}
        >
          <Ionicons
            name={
              activeTab === 'create'
                ? 'add-circle'
                : 'add-circle-outline'
            }
            size={23}
            color={COLORS.white}
          />
          <Text style={styles.label}>
            Tạo nhiệm vụ
          </Text>
        </Pressable>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 6,
  },
  bar: {
    borderRadius: 35,
    padding: 7,
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 28,
  },
  active: {
    backgroundColor: COLORS.glassStrong,
  },
  label: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});
