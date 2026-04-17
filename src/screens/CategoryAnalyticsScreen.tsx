import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BarChart } from 'react-native-gifted-charts';
import { Calendar } from 'react-native-calendars';

const { width, height } = Dimensions.get('window');

export default function CategoryAnalyticsScreen() {
  const navigation = useNavigation();
  const [activeTimeframe, setActiveTimeframe] = useState('Week');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRange, setSelectedRange] = useState<any>({});

  // Dummy data variants
  const weekData = [
    {
      stacks: [
        { value: 81, color: '#F43F5E', innerBarComponent: () => <View style={styles.barBorder}/>, marginBottom: 0 },
        { value: 17, color: '#F1F5F9', borderTopLeftRadius: 6, borderTopRightRadius: 6, marginBottom: 0 }
      ],
      label: 'ggg',
    },
  ];

  const monthData = [
    {
      stacks: [
        { value: 45, color: '#A855F7', innerBarComponent: () => <View style={styles.barBorder}/>, marginBottom: 0 },
        { value: 53, color: '#F1F5F9', borderTopLeftRadius: 6, borderTopRightRadius: 6, marginBottom: 0 }
      ],
      label: 'ggg',
    },
  ];

  const customData = [
    {
      stacks: [
        { value: 60, color: '#10B981', innerBarComponent: () => <View style={styles.barBorder}/>, marginBottom: 0 },
        { value: 38, color: '#F1F5F9', borderTopLeftRadius: 6, borderTopRightRadius: 6, marginBottom: 0 }
      ],
      label: 'ggg',
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
          <Ionicons name="chevron-back" size={26} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Categories wise Analytics</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.timeframeRow}>
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
          <Ionicons name="calendar-outline" size={16} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Wrapping the chart in a centered view to accommodate the rotated dimensions safely */}
      <View style={styles.chartWrapper}>
        <View style={styles.chartContainer}>
          <BarChart
            stackData={currentData}
            barWidth={22}
            spacing={height * 0.25} // adjust spacing for the new fake 'landscape' width
            hideRules={false}
            rulesType="dashed"
            rulesColor="#E2E8F0"
            xAxisThickness={1}
            yAxisThickness={1}
            yAxisTextStyle={{color: '#000', fontSize: 13, fontWeight: '700'}}
            xAxisLabelTextStyle={{color: '#000', fontSize: 12, fontWeight: '700'}}
            rotateLabel
            noOfSections={10}
            maxValue={98}
            initialSpacing={height * 0.2}
            yAxisLabelTexts={['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '98']}
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC'
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000', marginLeft: 8 },
  
  timeframeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 10,
    gap: 8,
    marginBottom: 20,
  },
  timeframeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F43F5E',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },

  barBorder: {
    flex: 1, 
    borderTopLeftRadius: 6, 
    borderTopRightRadius: 6
  },
  
  chartWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // We let the wrapper take remaining space, and rotate the container inside it.
  },
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 5,
    // By setting width to height, and height to width approx, 
    // we make it physically structured as landscape, then rotate it.
    width: height * 0.65,
    height: width * 0.85,
    position: 'relative',
    paddingLeft: 30, // For Y Axis Label
    paddingBottom: 40, // For X Axis Label
    transform: [{ rotate: '90deg' }],
  },
  yAxisLabelContainer: {
    position: 'absolute',
    left: -32,
    top: '45%',
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

  // Calendar Modal Styles
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
