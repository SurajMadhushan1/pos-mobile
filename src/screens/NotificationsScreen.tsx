import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';

const NOTIFICATIONS = [
  { id: '1', title: 'Low Stock Alert', message: 'CR Page 120 is running low (4 remaining).', time: '10 mins ago', type: 'warning' },
  { id: '2', title: 'Sync Failed', message: '3 invoices failed to sync. Tap to retry.', time: '1 hour ago', type: 'error' },
  { id: '3', title: 'Daily Goal Met!', message: 'Congratulations! You reached your daily sales goal of LKR 40,000.', time: '2 hours ago', type: 'success' },
];

export default function NotificationsScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: typeof NOTIFICATIONS[0] }) => {
    let iconName = 'notifications';
    let iconColor = colors.primary;

    if (item.type === 'warning') {
      iconName = 'warning';
      iconColor = '#F59E0B';
    } else if (item.type === 'error') {
      iconName = 'cloud-offline';
      iconColor = '#F43F5E';
    } else if (item.type === 'success') {
      iconName = 'checkmark-circle';
      iconColor = '#10B981';
    }

    return (
      <View style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={iconName as any} size={24} color={iconColor} />
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={NOTIFICATIONS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color: colors.textDark, marginBottom: 4 },
  message: { fontSize: 14, color: colors.textMuted, marginBottom: 8, lineHeight: 20 },
  time: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
});
