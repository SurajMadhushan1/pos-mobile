import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-gifted-charts';
import { Calendar } from 'react-native-calendars';

const { width, height } = Dimensions.get('window');

export default function ProductAnalyticsScreen() {
  const navigation = useNavigation();
  const [activeTimeframe, setActiveTimeframe] = useState('Week');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRange, setSelectedRange] = useState<any>({});

  // Dummy data variants based on screenshot
  // ff is red (#EF4444)
  // zazzaaaa is blue (#3B82F6)
  // Note: Values in screenshot - ff is approx 75, zazzaaaa is approx 5
  const weekData = [
    {
      stacks: [
        { value: 75, color: '#EF4444', innerBarComponent: () => <View style={styles.barBorder}/>, marginBottom: 0 },
        { value: 17, color: '#F1F5F9', borderTopLeftRadius: 6, borderTopRightRadius: 6, marginBottom: 0 }
      ],
      label: 'ff',
    },
    {
      stacks: [
        { value: 5, color: '#3B82F6', innerBarComponent: () => <View style={styles.barBorder}/>, marginBottom: 0 },
        { value: 87, color: '#F1F5F9', borderTopLeftRadius: 6, borderTopRightRadius: 6, marginBottom: 0 }
      ],
      label: 'zazzaaaa',
    },
  ];

  const monthData = [
    {
      stacks: [
        { value: 45, color: '#EF4444', innerBarComponent: () => <View style={styles.barBorder}/>, marginBottom: 0 },
        { value: 47, color: '#F1F5F9', borderTopLeftRadius: 6, borderTopRightRadius: 6, marginBottom: 0 }
      ],
      label: 'ff',
    },
    {
      stacks: [
        { value: 60, color: '#3B82F6', innerBarComponent: () => <View style={styles.barBorder}/>, marginBottom: 0 },
        { value: 32, color: '#F1F5F9', borderTopLeftRadius: 6, borderTopRightRadius: 6, marginBottom: 0 }
      ],
      label: 'zazzaaaa',
    },
  ];

  const customData = [
    {
      stacks: [
        { value: 85, color: '#EF4444', innerBarComponent: () => <View style={styles.barBorder}/>, marginBottom: 0 },
        { value: 7, color: '#F1F5F9', borderTopLeftRadius: 6, borderTopRightRadius: 6, marginBottom: 0 }
      ],
      label: 'ff',
    },
    {
      stacks: [
        { value: 30, color: '#3B82F6', innerBarComponent: () => <View style={styles.barBorder}/>, marginBottom: 0 },
        { value: 62, color: '#F1F5F9', borderTopLeftRadius: 6, borderTopRightRadius: 6, marginBottom: 0 }
      ],
      label: 'zazzaaaa',
    },
  ];

  let currentData;
  if (activeTimeframe === 'Week') currentData = weekData;
  else if (activeTimeframe === 'Month') currentData = monthData;
  else currentData = customData;

  const handleApplyFilter = () => {
    setActiveTimeframe('Custom');
    setShowCalendar(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product wise Analytics</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.mainBody}>
        {/* Left Side: The Chart (Rotated safely inside its wrapper) */}
        <View style={styles.chartWrapper}>
          <View style={styles.chartContainer}>
            <BarChart
              stackData={currentData}
              barWidth={18}
              spacing={height * 0.18} 
              hideRules={false}
              rulesType="dashed"
              rulesColor="#E2E8F0"
              xAxisThickness={1}
              yAxisThickness={1}
              yAxisTextStyle={{color: '#000', fontSize: 13, fontWeight: '700'}}
              xAxisLabelTextStyle={{color: '#000', fontSize: 14, fontWeight: '700', marginTop: 10}}
              noOfSections={4}
              maxValue={92}
              initialSpacing={height * 0.15}
              yAxisLabelTexts={['0', '20', '40', '60', '80', '92']}
              showLine={false}
              yAxisColor="#000"
              xAxisColor="#000"
              yAxisLabelWidth={30}
              isAnimated
            />
            {/* Rotated Y-Axis Label */}
            <View style={styles.yAxisLabelContainer}>
              <Text style={styles.yAxisLabel}>Sales Quantity</Text>
            </View>
          </View>
        </View>

        {/* Right Side: The Vertical Toggles natively positioned in Portrait but rotated in place */}
        <View style={styles.togglesColumn}>
            <TouchableOpacity 
              style={[styles.timeframeBtn, activeTimeframe === 'Week' && styles.timeframeBtnActive]}
              onPress={() => setActiveTimeframe('Week')}
            >
              <Text style={[styles.timeframeText, activeTimeframe === 'Week' && styles.timeframeTextActive]}>Week</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.timeframeBtn, activeTimeframe === 'Month' && styles.timeframeBtnActive]}
              onPress={() => setActiveTimeframe('Month')}
            >
              <Text style={[styles.timeframeText, activeTimeframe === 'Month' && styles.timeframeTextActive]}>Month</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.calendarIconBtn, activeTimeframe === 'Custom' && { backgroundColor: '#10B981' }]} 
              onPress={() => setShowCalendar(true)}
            >
              <Ionicons name="calendar-outline" size={16} color="#FFF" style={{transform: [{rotate: '90deg'}]}} />
            </TouchableOpacity>
        </View>
      </View>

      {/* Date Selector Modal */}
      <Modal visible={showCalendar} transparent animationType="fade">
        <View style={styles.calendarOverlay}>
           <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarTitle}>Select Date Range</Text>
                <TouchableOpacity onPress={() => setShowCalendar(false)}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
              </View>
              <Calendar
                markingType={'period'}
                markedDates={selectedRange}
                onDayPress={(day: any) => {
                  setSelectedRange({
                    [day.dateString]: {selected: true, startingDay: true, color: '#A855F7', textColor: 'white'},
                  });
                }}
                theme={{
                  selectedDayBackgroundColor: '#A855F7',
                  todayTextColor: '#A855F7',
                  arrowColor: '#A855F7',
                }}
              />
              <TouchableOpacity style={styles.applyBtn} onPress={handleApplyFilter}>
                <Text style={styles.applyBtnText}>Apply Filter</Text>
              </TouchableOpacity>
           </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF'
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginLeft: 8 },
  
  barBorder: {
    flex: 1, 
    borderTopLeftRadius: 6, 
    borderTopRightRadius: 6
  },
  
  mainBody: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFF'
  },

  chartWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    width: height * 0.7, 
    height: width * 0.75, // Keeps proportion inside the portrait screen
    transform: [{ rotate: '90deg' }], // Physical flip
    position: 'relative',
    paddingLeft: 30, // Y axis spacing
    paddingBottom: 40, // X axis spacing
  },

  togglesColumn: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40, // Since elements are rotated 90deg, vertical gap needs to account for horizontal width
    marginRight: 10,
  },
  timeframeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    transform: [{rotate: '90deg'}],
    width: 80, // Giving precise width to ensure text rotation anchors smoothly
    alignItems: 'center'
  },
  timeframeBtnActive: {
    backgroundColor: '#A855F7',
  },
  timeframeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  timeframeTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  calendarIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F43F5E',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{rotate: '90deg'}],
  },

  yAxisLabelContainer: {
    position: 'absolute',
    left: -45,
    top: '40%',
    width: 120,
    height: 20,
    transform: [{ rotate: '-90deg'}],
    alignItems: 'center',
    justifyContent: 'center',
  },
  yAxisLabel: {
    fontWeight: '800',
    fontSize: 13,
    color: '#000'
  },

  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  calendarContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    width: '100%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
  },
  applyBtn: {
    backgroundColor: '#A855F7',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  applyBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
