import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, SafeAreaView, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CATEGORIES = ['Total Sales', 'Cash Sales', 'Credit Sales', 'Cheque Sales', 'QR payments'];

const DUMMY_DELETED_BILLS = [
  { id: '1', invoiceNo: 'INV0005', amount: '9500.00' }
];

const DUMMY_DELETED_INVENTORY = [
  { id: '1', name: 'ddd', price: '5000.0', qty: '0', sales: '6' }
];

export default function BillInventoryHistoryScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'Bills' | 'Inventory'>('Bills');
  
  // Bills state
  const [searchBill, setSearchBill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Inventory state
  const [searchInventory, setSearchInventory] = useState('');

  const renderBills = () => (
    <View style={styles.tabContent}>
      <View style={styles.filterRow}>
        <View style={styles.searchBoxHalf}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search Bill" 
            placeholderTextColor="#000"
            value={searchBill}
            onChangeText={setSearchBill}
          />
        </View>
        <View style={{ width: 8 }} />
        <View style={styles.dropdownBoxHalf}>
          <TouchableOpacity style={styles.dropdownBtn} onPress={() => setIsDropdownOpen(true)}>
            <Text style={styles.dropdownBtnText}>{selectedCategory}</Text>
            <Ionicons name="chevron-down" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.dateLabel}>2026 Apr 17</Text>

      <FlatList
        data={DUMMY_DELETED_BILLS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.billCard}
            onPress={() => navigation.navigate('Receipt' as never, {
               total: parseFloat(item.amount),
               subTotal: parseFloat(item.amount),
               items: [{ name: 'Sample Item for ' + item.invoiceNo, qty: 1, price: parseFloat(item.amount) }],
               paymentMethod: 'Cash'
            } as never)}
          >
            <View style={styles.billCardLeft}>
              <View style={styles.invIcon}>
                <Text style={styles.invIconText}>INV</Text>
              </View>
              <Text style={styles.invoiceNo}>{item.invoiceNo}</Text>
            </View>
            
            <View style={styles.billCardRight}>
              <Text style={styles.amountText}>LKR {item.amount}....</Text>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="arrow-undo-circle" size={28} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="trash" size={26} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={isDropdownOpen} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsDropdownOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownMenu}>
              {CATEGORIES.map((cat, idx) => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.dropdownItem, idx < CATEGORIES.length - 1 && styles.dropdownBorder]}
                  onPress={() => { setSelectedCategory(cat); setIsDropdownOpen(false); }}
                >
                  <Text style={styles.dropdownItemText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );

  const renderInventory = () => (
    <View style={styles.tabContent}>
      <View style={styles.searchBoxFull}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search Inventory" 
          placeholderTextColor="#000"
          value={searchInventory}
          onChangeText={setSearchInventory}
        />
      </View>

      <View style={styles.inventoryHeader}>
        <Text style={[styles.invColText, { flex: 2.2 }]}>Product Name/Unit Price{'\n'}(LKR)</Text>
        <Text style={[styles.invColText, { flex: 1, textAlign: 'center' }]}>Ava.Qty</Text>
        <Text style={[styles.invColText, { flex: 1, textAlign: 'right' }]}>No of{'\n'}Sales</Text>
      </View>

      <FlatList
        data={DUMMY_DELETED_INVENTORY}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.invCard}>
            <View style={styles.invCardTop}>
              <Text style={styles.invName}>{item.name}</Text>
              <TouchableOpacity>
                <Ionicons name="arrow-undo-circle" size={32} color="#F43F5E" />
              </TouchableOpacity>
            </View>
            <View style={styles.invCardBottom}>
              <View style={[styles.metricBox, { flex: 2, alignItems: 'flex-start', paddingLeft: 12 }]}>
                 <Ionicons name="bag-handle" size={14} color="#10B981" style={{ marginRight: 4 }} />
                 <Text style={[styles.metricText, { color: '#10B981' }]}>{item.price} LKR</Text>
              </View>
              <View style={[styles.metricBox, { flex: 1 }]}>
                 <Ionicons name="server" size={14} color="#8B5CF6" style={{ marginRight: 4 }} />
                 <Text style={[styles.metricText, { color: '#8B5CF6' }]}>{item.qty}</Text>
              </View>
              <View style={[styles.metricBox, { flex: 1 }]}>
                 <Ionicons name="cart" size={14} color="#EF4444" style={{ marginRight: 4 }} />
                 <Text style={[styles.metricText, { color: '#EF4444' }]}>{item.sales}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#888" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill & Inventory History</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'Bills' ? styles.tabActive : styles.tabInactive]}
          onPress={() => setActiveTab('Bills')}
        >
          <Text style={[styles.tabText, activeTab === 'Bills' ? styles.tabTextActive : styles.tabTextInactive]}>
            Deleted{'\n'}Bills
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'Inventory' ? styles.tabActive : styles.tabInactive]}
          onPress={() => setActiveTab('Inventory')}
        >
          <Text style={[styles.tabText, activeTab === 'Inventory' ? styles.tabTextActive : styles.tabTextInactive]}>
            Deleted{'\n'}Inventory
          </Text>
        </TouchableOpacity>
      </View>

      {/* Decorative Background */}
      <View style={styles.emptyBgInner} />

      <View style={styles.mainContent}>
        {activeTab === 'Bills' ? renderBills() : renderInventory()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  backBtn: { padding: 4, marginRight: 16 },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginLeft: -20,
  },
  
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    zIndex: 10,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: '#9F7AEA' },
  tabInactive: { backgroundColor: '#E0D4F5' },
  tabText: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
  },
  tabTextActive: { color: '#FFFFFF' },
  tabTextInactive: { color: '#9F7AEA' },

  mainContent: {
    flex: 1,
    position: 'relative',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  
  // Bills styles
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    zIndex: 10,
  },
  searchBoxHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    backgroundColor: '#FFF',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  dropdownBoxHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    backgroundColor: '#FFF',
    height: 48,
    justifyContent: 'center',
  },
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: '100%',
  },
  dropdownBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000'
  },
  searchInput: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  dateLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  billCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  billCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  invIconText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
  invoiceNo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  billCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 15,
    marginRight: 8,
  },
  actionBtn: {
    padding: 4,
    marginLeft: 4,
  },

  // Modal Dropdown
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 180 : 160,
    right: 16,
    width: '45%',
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dropdownBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },

  // Inventory styles
  searchBoxFull: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    backgroundColor: '#FFF',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 20,
    zIndex: 10,
  },
  inventoryHeader: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    marginBottom: 12,
    zIndex: 10,
  },
  invColText: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  invCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  invCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  invName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  invCardBottom: {
    flexDirection: 'row',
    backgroundColor: '#D4D4D4',
    paddingVertical: 12,
  },
  metricBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // BG Graphic
  emptyBgInner: {
    position: 'absolute',
    left: -150,
    top: '35%',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: '#FFFAF0',
    zIndex: 0,
    borderRightWidth: 40,
    borderTopWidth: 40,
    borderBottomWidth: 40,
    borderColor: '#FAF5FF',
  },
});
