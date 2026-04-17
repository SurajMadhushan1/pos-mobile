import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';

type CustomerDetailsRouteProp = RouteProp<RootStackParamList, 'CustomerDetails'>;

const CATEGORIES = ['Cash Sales', 'Credit Sales', 'Cheque Sales', 'QR payments'];

export default function CustomerDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<CustomerDetailsRouteProp>();
  const { customerInitials, customerName } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Cash Sales');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const totalProfit = 18200.00;

  // Mock Data based on screenshot 1
  const invoices = [
    { id: 'INV0004', amount: -5000.00 },
    { id: 'INV0003', amount: 19000.00 }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#555" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{customerName}</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#555" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Bill"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters & Actions row */}
      <View style={styles.filterRow}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownBtn}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Ionicons name="bar-chart" size={16} color="#000" style={styles.btnIcon} />
            <Text style={styles.dropdownText}>{selectedCategory}</Text>
            <Ionicons name="chevron-down" size={16} color="#000" />
          </TouchableOpacity>
          {isDropdownOpen && (
            <View style={styles.dropdownList}>
              {CATEGORIES.map((cat, idx) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.dropdownItem, idx !== CATEGORIES.length - 1 && styles.dropdownItemBorder]}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, selectedCategory === cat && styles.dropdownItemTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.profitContainer}>
          <Text style={styles.profitLabel}>Total Profit</Text>
          <Text style={styles.profitValue}>{totalProfit.toFixed(2)}</Text>
        </View>

        {selectedCategory === 'Credit Sales' && (
          <TouchableOpacity 
            style={[styles.addBtn, { marginRight: 12, backgroundColor: '#A855F7' }]} 
            onPress={() => navigation.navigate('CreditSalesReport' as any)}
          >
            <Ionicons name="document-text" size={20} color={colors.surface} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('ReturnBills')}>
          <Ionicons name="receipt" size={20} color={colors.surface} />
          <View style={styles.addPin}>
            <Ionicons name="add" size={10} color={colors.surface} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {invoices.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyBgInner} />
            <View style={styles.emptyBgOuter} />
            <Text style={styles.emptyStateText}>No invoice found.</Text>
          </View>
        ) : (
          <View style={styles.invoiceListContainer}>
            <View style={styles.invoiceListHeader}>
              <Text style={styles.invoiceListDate}>2026 Apr 17</Text>
              <Text style={styles.invoiceListTotal}>LKR 19,000.00</Text>
            </View>
            <FlatList
              data={invoices}
              renderItem={({ item }) => (
                <View style={styles.invoiceCard}>
                  <View style={styles.invoiceCardLeft}>
                    <View style={styles.invoiceIconBg}>
                      <Text style={styles.invoiceIconText}>INV</Text>
                    </View>
                    <Text style={styles.invoiceId}>{item.id}</Text>
                  </View>
                  <Text style={[styles.invoiceAmount]}>
                    LKR {item.amount < 0 ? '-' : ''}{Math.abs(item.amount).toFixed(2)}
                  </Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 24,
    marginHorizontal: 16,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#000' },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 10,
    marginBottom: 20,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 10,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 16,
    justifyContent: 'space-between',
  },
  btnIcon: { marginRight: 8 },
  dropdownText: { fontSize: 14, fontWeight: '600', color: '#000', flex: 1 },
  dropdownList: {
    position: 'absolute',
    top: 45,
    left: 0,
    width: '100%',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
    zIndex: 100,
  },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16 },
  dropdownItemBorder: { borderBottomWidth: 1, borderBottomColor: '#CCC' },
  dropdownItemText: { fontSize: 14, color: '#333', fontWeight: '500' },
  dropdownItemTextActive: { color: '#000', fontWeight: '700' },

  profitContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  profitLabel: { fontSize: 13, fontWeight: '600', color: '#000' },
  profitValue: { fontSize: 13, color: '#000' },

  addBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#3F3B59',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  addPin: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'transparent',
  },

  contentArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  emptyStateText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    zIndex: 10,
  },
  emptyBgInner: {
    position: 'absolute',
    left: -40,
    top: '30%',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#F5F5F5',
    zIndex: 1,
  },
  emptyBgOuter: {
    position: 'absolute',
    right: -40,
    bottom: '20%',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#FFFAF0',
    zIndex: 0,
    opacity: 0.3,
  },

  invoiceListContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  invoiceListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceListDate: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  invoiceListTotal: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  invoiceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  invoiceCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invoiceIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9F7AEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  invoiceIconText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  invoiceId: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  invoiceAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#48BB78',
  },
});
