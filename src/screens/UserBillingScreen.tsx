import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function UserBillingScreen() {
  const navigation = useNavigation<any>();

  const transactions = [
    { id: '1', period: '2026-04-16 to\n2026-04-21', amount: '0', status: 'Trial', date: '2026-04-16' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#555" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Billing</Text>
        
        <View style={styles.headerRight}>
          <View style={styles.trialPill}>
            <Text style={styles.trialPillText}>Trial</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('PaymentDetails')} style={styles.settingsBtn}>
            <Ionicons name="settings" size={22} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>You are in the trial period.</Text>
      </View>

      {/* Title */}
      <Text style={styles.sectionTitle}>Transactions</Text>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.thText, { flex: 2.2 }]}>Period</Text>
        <Text style={[styles.thText, { flex: 1.2, textAlign: 'center' }]}>Amount{'\n'}(LKR)</Text>
        <Text style={[styles.thText, { flex: 1.2, textAlign: 'center' }]}>Status</Text>
        <Text style={[styles.thText, { flex: 1.5, textAlign: 'right' }]}>Date</Text>
      </View>

      {/* List */}
      <FlatList 
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={[styles.rowText, { flex: 2.2, lineHeight: 20 }]}>{item.period}</Text>
            <Text style={[styles.rowText, { flex: 1.2, textAlign: 'center' }]}>{item.amount}</Text>
            <Text style={[styles.rowText, { flex: 1.2, textAlign: 'center', color: '#D97706', fontWeight: '500' }]}>{item.status}</Text>
            <Text style={[styles.rowText, { flex: 1.5, textAlign: 'right' }]}>{item.date}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trialPill: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D97706',
    marginRight: 10,
  },
  trialPillText: {
    color: '#D97706',
    fontSize: 14,
    fontWeight: '700',
  },
  settingsBtn: {
    padding: 4,
  },
  banner: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  bannerText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  thText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FAFAFA',
  },
  rowText: {
    fontSize: 14,
    color: '#000',
  }
});
