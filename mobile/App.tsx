
import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';

import HomeScreen from './src/screens/HomeScreen';
import CreateTaskScreen from './src/screens/CreateTaskScreen';

import BottomNavigation from './src/components/BottomNavigation';
import GlassCard from './src/components/GlassCard';

import { useLevelUp } from './src/hooks/useLevelUp';
import { COLORS, GRADIENT } from './src/constants/theme';

import type { Tab } from './src/types';

function MainApp() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  // Toàn bộ dữ liệu ứng dụng dùng chung một hook
  const levelUp = useLevelUp();

  // Đang tải dữ liệu từ bộ nhớ
  if (levelUp.loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingLogo}>
          LEVELUP
        </Text>

        <Text style={styles.loadingSubtitle}>
          Loading your journey...
        </Text>
      </View>
    );
  }

  // Tránh thao tác khi dữ liệu chưa thể đọc hoặc lưu
  if (levelUp.storageError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>
          LEVELUP
        </Text>

        <Text style={styles.errorMessage}>
          {levelUp.storageError}
        </Text>

        <Text style={styles.errorHint}>
          Dữ liệu chưa bị xóa. Hãy kiểm tra
          bộ nhớ thiết bị và khởi động lại ứng dụng.
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={GRADIENT}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Các lớp sáng tạo chiều sâu cho nền */}
      <View
        pointerEvents="none"
        style={styles.circleOne}
      />

      <View
        pointerEvents="none"
        style={styles.circleTwo}
      />

      <View
        pointerEvents="none"
        style={styles.circleThree}
      />

      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'bottom']}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
        >
          {/* Header dùng chung */}
          <View style={styles.header}>
            <View>
              <Text style={styles.logo}>
                LEVELUP
              </Text>

              <Text style={styles.tagline}>
                Level up your life
              </Text>
            </View>

            <GlassCard style={styles.avatar}>
              <Text style={styles.avatarText}>
                A
              </Text>
            </GlassCard>
          </View>

          {/* Nội dung tab */}
          <View style={styles.screenContainer}>
            {activeTab === 'home' ? (
              <HomeScreen
                levelUp={levelUp}
                onCreateTask={() =>
                  setActiveTab('create')
                }
              />
            ) : (
              <CreateTaskScreen
                levelUp={levelUp}
                onTaskCreated={() =>
                  setActiveTab('home')
                }
              />
            )}
          </View>

          {/* Thanh điều hướng dưới cùng */}
          <BottomNavigation
            activeTab={activeTab}
            onChangeTab={setActiveTab}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  loading: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingLogo: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 5,
  },

  loadingSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 15,
  },

  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  errorTitle: {
    color: COLORS.gold,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: 4,
  },

  errorMessage: {
    color: COLORS.red,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
  },

  errorHint: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 15,
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logo: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 4,
  },

  tagline: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: '700',
  },

  screenContainer: {
    flex: 1,
  },

  circleOne: {
    position: 'absolute',
    top: 90,
    right: -85,
    width: 260,
    height: 260,
    borderRadius: 150,
    backgroundColor: 'rgba(125,162,225,0.15)',
  },

  circleTwo: {
    position: 'absolute',
    top: 470,
    left: -110,
    width: 300,
    height: 300,
    borderRadius: 160,
    backgroundColor: 'rgba(161,120,215,0.12)',
  },

  circleThree: {
    position: 'absolute',
    bottom: 75,
    right: -30,
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: 'rgba(216,187,142,0.08)',
  },
});
