import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const TIMEFRAMES = ['Today', 'This Week', 'This Month'];

// Dummy data for charts based on timeframe
const CHART_DATA = {
  'Today': [
    { label: '8AM', value: 20 }, { label: '10AM', value: 45 }, { label: '12PM', value: 80 },
    { label: '2PM', value: 65 }, { label: '4PM', value: 110 }, { label: '6PM', value: 90 }
  ],
  'This Week': [
    { label: 'Mon', value: 120 }, { label: 'Tue', value: 150 }, { label: 'Wed', value: 180 },
    { label: 'Thu', value: 140 }, { label: 'Fri', value: 220 }, { label: 'Sat', value: 300 },
    { label: 'Sun', value: 250 }
  ],
  'This Month': [
    { label: 'W1', value: 800 }, { label: 'W2', value: 1200 }, 
    { label: 'W3', value: 950 }, { label: 'W4', value: 1400 }
  ]
};

const STATS_DATA = {
  'Today': { total: 'LKR 45,200', growth: '+12.5%', bills: 24, cash: '30K', card: '15.2K' },
  'This Week': { total: 'LKR 310,500', growth: '+8.2%', bills: 156, cash: '210K', card: '100.5K' },
  'This Month': { total: 'LKR 1,245,000', growth: '-2.1%', bills: 642, cash: '800K', card: '445K' },
};

export default function SalesScreen() {
  const [activeFrame, setActiveFrame] = useState<keyof typeof CHART_DATA>('This Week');
  
  const currentData = CHART_DATA[activeFrame];
  const currentStats = STATS_DATA[activeFrame];
  const maxValue = Math.max(...currentData.map(d => d.value));

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sales Overview</Text>
          <TouchableOpacity 
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.textDark} />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Timeframe Selector */}
        <View style={styles.timeframeContainer}>
          {TIMEFRAMES.map((frame) => {
            const isActive = activeFrame === frame;
            return (
              <TouchableOpacity 
                key={frame} 
                style={[styles.timeframeBtn, isActive && styles.timeframeBtnActive]}
                onPress={() => setActiveFrame(frame as any)}
              >
                <Text style={[styles.timeframeText, isActive && styles.timeframeTextActive]}>
                  {frame}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Total Sales Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Sales ({activeFrame})</Text>
          <View style={styles.summaryValueRow}>
            <Text style={styles.summaryValue}>{currentStats.total}</Text>
            <View style={[
              styles.growthBadge, 
              { backgroundColor: currentStats.growth.startsWith('-') ? colors.errorLight : colors.successLight }
            ]}>
              <Ionicons 
                name={currentStats.growth.startsWith('-') ? "trending-down" : "trending-up"} 
                size={14} 
                color={currentStats.growth.startsWith('-') ? colors.error : colors.success} 
              />
              <Text style={[
                styles.growthText, 
                { color: currentStats.growth.startsWith('-') ? colors.error : colors.success }
              ]}>
                {currentStats.growth}
              </Text>
            </View>
          </View>
        </View>

        {/* Custom Bar Chart View */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Sales Trend</Text>
          <View style={styles.chartContainer}>
            {currentData.map((dataPoint, index) => {
              const heightPercent = (dataPoint.value / maxValue) * 100;
              const isHighest = dataPoint.value === maxValue;
              return (
                <View key={index} style={styles.barWrapper}>
                  <View style={styles.barBackground}>
                    <View style={[
                      styles.barFill, 
                      { height: `${heightPercent}%`, backgroundColor: isHighest ? '#A855F7' : '#E2E8F0' }
                    ]} />
                  </View>
                  <Text style={[styles.barLabel, isHighest && styles.barLabelActive]}>
                    {dataPoint.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.gridCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="receipt" size={20} color="#0EA5E9" />
            </View>
            <Text style={styles.gridLabel}>Total Bills</Text>
            <Text style={styles.gridValue}>{currentStats.bills}</Text>
          </View>
          
          <View style={styles.gridCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="wallet" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.gridLabel}>Cash Sales</Text>
            <Text style={styles.gridValue}>{currentStats.cash}</Text>
          </View>
          
          <View style={styles.gridCard}>
            <View style={[styles.iconContainer, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="card" size={20} color="#EC4899" />
            </View>
            <Text style={styles.gridLabel}>Card Sales</Text>
            <Text style={styles.gridValue}>{currentStats.card}</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: colors.textDark, letterSpacing: -0.5 },
  notificationBtn: {
    width: 40, height: 40,
    backgroundColor: colors.surface,
    borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  notificationDot: {
    position: 'absolute', top: 10, right: 10,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: colors.error,
  },
  
  timeframeContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  timeframeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  timeframeBtnActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  timeframeText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  timeframeTextActive: { color: colors.textDark },
  
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  summaryLabel: { fontSize: 14, color: colors.textMuted, marginBottom: 8, fontWeight: '500' },
  summaryValueRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryValue: { fontSize: 32, fontWeight: '800', color: colors.textDark, letterSpacing: -1 },
  growthBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 12, gap: 4
  },
  growthText: { fontSize: 12, fontWeight: 'bold' },

  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  chartTitle: { fontSize: 16, fontWeight: '700', color: colors.textDark, marginBottom: 24 },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    paddingBottom: 24,
  },
  barWrapper: { alignItems: 'center', flex: 1 },
  barBackground: {
    width: 32,
    height: 140,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    borderRadius: 8,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  barLabel: {
    position: 'absolute',
    bottom: -24,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  barLabelActive: { color: colors.textDark, fontWeight: 'bold' },

  gridContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  iconContainer: {
    width: 36, height: 36,
    borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  gridLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 4, fontWeight: '500' },
  gridValue: { fontSize: 16, fontWeight: '700', color: colors.textDark },
});
