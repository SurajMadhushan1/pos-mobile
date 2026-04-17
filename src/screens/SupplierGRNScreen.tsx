import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import AddProductModal from '../components/AddProductModal';
import { Calendar } from 'react-native-calendars';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SupplierGRN'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'SupplierGRN'>;

const INVENTORY_PRODUCTS = [
  { id: '1', name: 'sugar', price: 220.0 },
  { id: '2', name: 'CR Page 120', price: 365.0 },
  { id: '3', name: 'Glu Bottle Medium', price: 80.0 },
  { id: '4', name: 'Cheese', price: 1200.0 },
  { id: '5', name: 'Red rice', price: 175.0 },
  { id: '6', name: 'sanitizer', price: 1000.0 },
  { id: '7', name: 'Apples', price: 245.0 },
];

const DELIVERY_METHODS = ['Courier', 'Truck'];

type ReceivedProduct = { id: string; name: string; quantity: number; unitPrice: number };
type GRNEntry = {
  id: string;
  grnName: string;
  date: string;
  deliveryMethod: string;
  products: ReceivedProduct[];
  total: number;
};

function formatDate(d: Date) {
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}
function formatDateLabel(d: Date) {
  return d.toDateString().replace(/^\S+\s/, '').replace(' ', ' ');
}

export default function SupplierGRNScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { supplierName, supplierId } = route.params;

  const [grns, setGrns] = useState<GRNEntry[]>([]);

  // ── Add GRN modal ──
  const [showAddGRN, setShowAddGRN] = useState(false);
  const [receivedDate, setReceivedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('Courier');
  const [showDeliveryPicker, setShowDeliveryPicker] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof INVENTORY_PRODUCTS[0] | null>(null);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [enteredQty, setEnteredQty] = useState('');
  const [receivedProducts, setReceivedProducts] = useState<ReceivedProduct[]>([]);

  const resetAddGRN = () => {
    setDeliveryMethod('Courier');
    setSelectedProduct(null);
    setEnteredQty('');
    setReceivedProducts([]);
    setShowDeliveryPicker(false);
    setShowProductPicker(false);
    setProductSearch('');
  };

  const handleOpenAddProduct = () => {
    // Close product picker first so AddProductModal can render on top (Android fix)
    setShowProductPicker(false);
    setTimeout(() => setShowAddProductModal(true), 300);
  };

  const handleCloseAddProduct = () => {
    setShowAddProductModal(false);
    // Reopen the product picker after AddProductModal closes
    setTimeout(() => setShowProductPicker(true), 300);
  };

  const handleAddProductToGRN = () => {
    if (!selectedProduct || !enteredQty) return;
    const qty = parseInt(enteredQty, 10);
    if (isNaN(qty) || qty <= 0) return;
    setReceivedProducts(prev => [
      ...prev,
      { id: Date.now().toString(), name: selectedProduct.name, quantity: qty, unitPrice: selectedProduct.price },
    ]);
    setSelectedProduct(null);
    setEnteredQty('');
  };

  const removeReceivedProduct = (id: string) => setReceivedProducts(prev => prev.filter(p => p.id !== id));

  const handleSaveGRN = () => {
    const grnNumber = grns.length + 1;
    const total = receivedProducts.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0);
    const newGRN: GRNEntry = {
      id: Date.now().toString(),
      grnName: `GRN ${grnNumber}`,
      date: receivedDate.toDateString(),
      deliveryMethod,
      products: receivedProducts,
      total,
    };
    setGrns(prev => [...prev, newGRN]);
    resetAddGRN();
    setShowAddGRN(false);
  };

  // ── GRN Detail / tap dialog ──
  const [selectedGRN, setSelectedGRN] = useState<GRNEntry | null>(null);
  const [deletingGRN, setDeletingGRN] = useState<GRNEntry | null>(null);

  // ── Edit GRN modal ──
  const [editingGRN, setEditingGRN] = useState<GRNEntry | null>(null);
  const [editDelivery, setEditDelivery] = useState('');
  const [editProducts, setEditProducts] = useState<ReceivedProduct[]>([]);
  const [showEditDeliveryPicker, setShowEditDeliveryPicker] = useState(false);

  const openEdit = (grn: GRNEntry) => {
    setSelectedGRN(null);
    setEditingGRN(grn);
    setEditDelivery(grn.deliveryMethod);
    setEditProducts([...grn.products]);
  };

  const saveEdit = () => {
    if (!editingGRN) return;
    const total = editProducts.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0);
    setGrns(prev => prev.map(g =>
      g.id === editingGRN.id ? { ...g, deliveryMethod: editDelivery, products: editProducts, total } : g
    ));
    setEditingGRN(null);
  };

  const handleDelete = () => {
    if (!deletingGRN) return;
    setGrns(prev => prev.filter(g => g.id !== deletingGRN.id));
    setDeletingGRN(null);
    setSelectedGRN(null);
  };

  // Group GRNs by date
  const groupedByDate: { date: string; items: GRNEntry[] }[] = grns.reduce<{ date: string; items: GRNEntry[] }[]>((acc, grn) => {
    const existing = acc.find(g => g.date === grn.date);
    if (existing) existing.items.push(grn);
    else acc.push({ date: grn.date, items: [grn] });
    return acc;
  }, []);

  const filteredInventory = INVENTORY_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  if (showAddGRN) {
    return (
      <SafeAreaView style={styles.modalFull}>
          <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.addHeader}>
              <TouchableOpacity onPress={() => { setShowAddGRN(false); resetAddGRN(); }}>
                <Ionicons name="arrow-back" size={24} color={colors.textDark} />
              </TouchableOpacity>
              <Text style={styles.addHeaderTitle}>Add GRN</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.addBody} keyboardShouldPersistTaps="handled">
              {/* Received Date */}
              <View style={[styles.infoRow, { zIndex: 90 }]}>
                <Text style={styles.infoLabel}>Received Date:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={styles.infoValue}>{formatDate(receivedDate)}</Text>
                  <TouchableOpacity style={styles.calendarIcon} onPress={() => setShowCalendar(true)}>
                    <Ionicons name="calendar" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Delivery Method */}
              <View style={[styles.infoRow, { alignItems: 'flex-start', zIndex: 100 }]}>
                <Text style={styles.infoLabel}>Delivery Method:</Text>
                <View>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
                    onPress={() => setShowDeliveryPicker(!showDeliveryPicker)}
                  >
                    <Text style={styles.infoValue}>{deliveryMethod}</Text>
                    <Ionicons name="chevron-down" size={18} color={colors.textDark} />
                  </TouchableOpacity>
                  {showDeliveryPicker && (
                    <View style={styles.dropdownBox}>
                      {DELIVERY_METHODS.map(m => (
                        <TouchableOpacity key={m} style={styles.dropdownItem} onPress={() => { setDeliveryMethod(m); setShowDeliveryPicker(false); }}>
                          <Text style={[styles.dropdownText, deliveryMethod === m && { color: '#A855F7', fontWeight: '700' }]}>{m}</Text>
                          {deliveryMethod === m && <Ionicons name="checkmark" size={16} color="#A855F7" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <View style={{ height: 16 }} />

              {/* Select Product */}
              <TouchableOpacity style={styles.roundInput} onPress={() => setShowProductPicker(true)}>
                <Text style={[styles.roundInputText, !selectedProduct && { color: colors.textMuted }]}>
                  {selectedProduct ? selectedProduct.name : 'Select Product'}
                </Text>
                <Ionicons name="chevron-down" size={18} color={colors.textDark} />
              </TouchableOpacity>

              {/* Enter Quantity */}
              <View style={styles.roundInput}>
                <TextInput
                  style={[styles.roundInputText, { flex: 1 }]}
                  placeholder="Enter Quantity"
                  placeholderTextColor={colors.textMuted}
                  value={enteredQty}
                  onChangeText={setEnteredQty}
                  keyboardType="numeric"
                />
              </View>

              {/* Add Product button */}
              <View style={{ alignItems: 'flex-end', marginBottom: 24 }}>
                <TouchableOpacity style={styles.addProductBtn} onPress={handleAddProductToGRN}>
                  <Text style={styles.addProductBtnText}>Add Product</Text>
                </TouchableOpacity>
              </View>

              {/* Received Products table */}
              <Text style={styles.tableTitle}>Received Products</Text>
              <View style={styles.tableCard}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableCol, { flex: 2 }]}>Product</Text>
                  <Text style={[styles.tableCol, { flex: 1, textAlign: 'center' }]}>Quantity</Text>
                  <Text style={[styles.tableCol, { flex: 1, textAlign: 'right' }]}>Actions</Text>
                </View>
                {receivedProducts.length === 0 ? (
                  <View style={{ paddingVertical: 24, alignItems: 'center' }}>
                    <Text style={{ color: colors.textMuted, fontStyle: 'italic' }}>No products added</Text>
                  </View>
                ) : (
                  receivedProducts.map(p => (
                    <View key={p.id} style={styles.tableRow}>
                      <View style={{ flex: 2 }}>
                        <Text style={styles.tableCellText}>{p.name}</Text>
                      </View>
                      <Text style={[styles.tableCellText, { flex: 1, textAlign: 'center' }]}>{p.quantity}</Text>
                      <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={() => removeReceivedProduct(p.id)}>
                          <Ionicons name="trash-outline" size={18} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>

              {/* Add GRN button */}
              <TouchableOpacity
                style={[styles.saveGRNBtn, receivedProducts.length === 0 && { opacity: 0.5 }]}
                onPress={handleSaveGRN}
                disabled={receivedProducts.length === 0}
              >
                <Text style={styles.saveGRNBtnText}>Add GRN</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>

      {/* ─── Calendar Modal ─── */}
      <Modal visible={showCalendar} transparent animationType="fade">
        <View style={styles.calendarOverlay}>
          <View style={styles.calendarCard}>
            <Calendar
              onDayPress={(day: any) => {
                setReceivedDate(new Date(day.timestamp));
                setShowCalendar(false);
              }}
              theme={{
                todayTextColor: '#A855F7',
                arrowColor: '#A855F7',
                selectedDayBackgroundColor: '#A855F7',
              }}
            />
            <TouchableOpacity style={styles.calendarCloseBtn} onPress={() => setShowCalendar(false)}>
              <Text style={styles.calendarCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ─── Product Picker Modal ─── */}
      <Modal visible={showProductPicker} transparent animationType="slide">
        <View style={styles.pickerOverlay}>
          <SafeAreaView style={styles.pickerCard}>
            {/* Picker Header */}
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Product List</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity style={styles.pickerAddBtn} onPress={handleOpenAddProduct}>
                  <Ionicons name="add" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowProductPicker(false); setProductSearch(''); }}>
                  <Ionicons name="close" size={28} color={colors.textDark} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Search */}
            <View style={styles.pickerSearchWrapper}>
              <Ionicons name="search" size={20} color={colors.textDark} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.pickerSearchInput}
                placeholder="Search Inventory"
                placeholderTextColor={colors.textMuted}
                value={productSearch}
                onChangeText={setProductSearch}
                autoFocus
              />
              {productSearch !== '' && (
                <TouchableOpacity onPress={() => setProductSearch('')}>
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Product List */}
            <FlatList
              data={filteredInventory}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.pickerItem} onPress={() => { setSelectedProduct(item); setShowProductPicker(false); setProductSearch(''); }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pickerItemName}>{item.name}</Text>
                    {/* Add brand if available in item, though dummy data lacks it right now */}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.pickerItemPrice}>LKR {item.price.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#f1f5f9' }} />}
              keyboardShouldPersistTaps="handled"
            />
          </SafeAreaView>
        </View>
      </Modal>

      {/* ─── Add New Product Modal ─── */}
      <AddProductModal visible={showAddProductModal} onClose={handleCloseAddProduct} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{supplierName}'s GRN</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddGRN(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* GRN list grouped by date */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {groupedByDate.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={52} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No GRNs Yet</Text>
            <Text style={styles.emptySubtitle}>Press + to record a Goods Received Note</Text>
          </View>
        ) : (
          groupedByDate.map(group => (
            <View key={group.date}>
              <Text style={styles.dateLabel}>{group.date}</Text>
              {group.items.map(grn => (
                <TouchableOpacity key={grn.id} style={styles.grnRow} onPress={() => setSelectedGRN(grn)}>
                  <Text style={styles.grnName}>{grn.grnName}</Text>
                  <Text style={styles.grnTotal}>{grn.total.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* ─── GRN Detail Dialog ─── */}
      <Modal visible={!!selectedGRN} animationType="fade" transparent>
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogTitleRow}>
              <Text style={styles.dialogGRNName}>{selectedGRN?.grnName}</Text>
              <TouchableOpacity onPress={() => setSelectedGRN(null)}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.dialogMeta}>📅 {selectedGRN?.date}</Text>
            <Text style={styles.dialogMeta}>🚚 Delivery: {selectedGRN?.deliveryMethod}</Text>

            <View style={styles.dialogDivider} />
            <Text style={styles.dialogSectionTitle}>Received Products</Text>
            {selectedGRN?.products.map(p => (
              <View key={p.id} style={styles.dialogProductRow}>
                <Text style={styles.dialogProductName}>{p.name}</Text>
                <Text style={styles.dialogProductQty}>×{p.quantity}</Text>
                <Text style={styles.dialogProductTotal}>
                  LKR {(p.quantity * p.unitPrice).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.dialogDivider} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={{ fontWeight: '700', color: colors.textDark }}>Total</Text>
              <Text style={{ fontWeight: '700', color: '#A855F7' }}>LKR {selectedGRN?.total.toFixed(2)}</Text>
            </View>

            <View style={styles.dialogActions}>
              <TouchableOpacity style={styles.dialogEditBtn} onPress={() => selectedGRN && openEdit(selectedGRN)}>
                <Ionicons name="pencil" size={16} color="#3B82F6" />
                <Text style={styles.dialogEditBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogDeleteBtn} onPress={() => { setDeletingGRN(selectedGRN); setSelectedGRN(null); }}>
                <Ionicons name="trash" size={16} color="#fff" />
                <Text style={styles.dialogDeleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── Delete Confirmation ─── */}
      <Modal visible={!!deletingGRN} animationType="fade" transparent>
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <View style={styles.deleteIconWrap}>
              <Ionicons name="trash-outline" size={32} color={colors.error} />
            </View>
            <Text style={styles.deleteTitle}>Delete GRN?</Text>
            <Text style={styles.deleteMessage}>
              Are you sure you want to delete{'\n'}
              <Text style={{ fontWeight: '700', color: colors.textDark }}>{deletingGRN?.grnName}</Text>?
              {'\n'}This action cannot be undone.
            </Text>
            <View style={styles.dialogActions}>
              <TouchableOpacity style={styles.dialogEditBtn} onPress={() => setDeletingGRN(null)}>
                <Text style={[styles.dialogEditBtnText, { color: colors.textMuted }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogDeleteBtn} onPress={handleDelete}>
                <Text style={styles.dialogDeleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── Edit GRN Modal ─── */}
      <Modal visible={!!editingGRN} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalFull}>
          <View style={styles.addHeader}>
            <TouchableOpacity onPress={() => setEditingGRN(null)}>
              <Ionicons name="close" size={24} color={colors.textDark} />
            </TouchableOpacity>
            <Text style={styles.addHeaderTitle}>Edit {editingGRN?.grnName}</Text>
            <TouchableOpacity onPress={saveEdit}>
              <Text style={{ color: '#A855F7', fontWeight: '700', fontSize: 16 }}>Save</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.addBody} keyboardShouldPersistTaps="handled">
            <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
              <Text style={styles.infoLabel}>Delivery Method:</Text>
              <View>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} onPress={() => setShowEditDeliveryPicker(!showEditDeliveryPicker)}>
                  <Text style={styles.infoValue}>{editDelivery}</Text>
                  <Ionicons name="chevron-down" size={18} color={colors.textDark} />
                </TouchableOpacity>
                {showEditDeliveryPicker && (
                  <View style={styles.dropdownBox}>
                    {DELIVERY_METHODS.map(m => (
                      <TouchableOpacity key={m} style={styles.dropdownItem} onPress={() => { setEditDelivery(m); setShowEditDeliveryPicker(false); }}>
                        <Text style={[styles.dropdownText, editDelivery === m && { color: '#A855F7', fontWeight: '700' }]}>{m}</Text>
                        {editDelivery === m && <Ionicons name="checkmark" size={16} color="#A855F7" />}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <Text style={[styles.tableTitle, { marginTop: 16 }]}>Received Products</Text>
            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableCol, { flex: 2 }]}>Product</Text>
                <Text style={[styles.tableCol, { flex: 1, textAlign: 'center' }]}>Qty</Text>
                <Text style={[styles.tableCol, { flex: 1, textAlign: 'right' }]}>Remove</Text>
              </View>
              {editProducts.map(p => (
                <View key={p.id} style={styles.tableRow}>
                  <Text style={[styles.tableCellText, { flex: 2 }]}>{p.name}</Text>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <TextInput
                      style={styles.editInput}
                      value={p.quantity.toString()}
                      onChangeText={v => {
                        const n = parseInt(v, 10);
                        if (!isNaN(n)) setEditProducts(prev => prev.map(ep => ep.id === p.id ? { ...ep, quantity: n } : ep));
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => setEditProducts(prev => prev.filter(ep => ep.id !== p.id))}>
                      <Ionicons name="trash-outline" size={18} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity style={[styles.saveGRNBtn, { marginTop: 24 }]} onPress={saveEdit}>
              <Text style={styles.saveGRNBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textDark },
  addBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#A855F7',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#A855F7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 40, flexGrow: 1 },
  emptyState: { flex: 1, alignItems: 'center', paddingTop: 100 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textDark, marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  dateLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '600', marginBottom: 10, marginTop: 8 },
  grnRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 10, paddingVertical: 16, paddingHorizontal: 16,
    marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0',
  },
  grnName: { fontSize: 16, fontWeight: '500', color: colors.textDark },
  grnTotal: { fontSize: 16, fontWeight: '600', color: '#F472B6' },
  // Modal full screen
  modalFull: { flex: 1, backgroundColor: '#F8FAFC' },
  addHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 16, paddingBottom: 16,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  addHeaderTitle: { fontSize: 18, fontWeight: '700', color: colors.textDark },
  addBody: { padding: 24, paddingBottom: 60 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  infoLabel: { fontSize: 15, fontWeight: '600', color: colors.textDark },
  infoValue: { fontSize: 15, fontWeight: '500', color: colors.textDark },
  calendarIcon: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#F472B6',
    justifyContent: 'center', alignItems: 'center',
  },
  dropdownBox: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0',
    marginTop: 6, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, minWidth: 140,
  },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14 },
  dropdownText: { fontSize: 15, color: colors.textDark },
  roundInput: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 28,
    paddingHorizontal: 20, height: 52, backgroundColor: '#fff', marginBottom: 14,
  },
  roundInputText: { fontSize: 15, color: colors.textDark, flex: 1 },
  addProductBtn: {
    backgroundColor: '#A855F7', paddingVertical: 13, paddingHorizontal: 24, borderRadius: 24,
    shadowColor: '#A855F7', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  addProductBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  tableTitle: { fontSize: 15, fontWeight: '700', color: colors.textDark, marginBottom: 10 },
  tableCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    marginBottom: 24,
  },
  tableHeaderRow: {
    flexDirection: 'row', paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 4,
  },
  tableCol: { fontSize: 13, fontWeight: '700', color: colors.textDark },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f8f8f8' },
  tableCellText: { fontSize: 14, color: colors.textDark },
  saveGRNBtn: {
    backgroundColor: '#A855F7', height: 54, borderRadius: 27,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#A855F7', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  saveGRNBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  // Product Picker Modal
  pickerOverlay: {
    flex: 1, backgroundColor: '#fff',
  },
  pickerCard: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  pickerHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerTitle: { fontSize: 18, fontWeight: '700', color: colors.textDark },
  pickerAddBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#A855F7',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#A855F7', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3, shadowRadius: 5, elevation: 4,
  },
  pickerSearchWrapper: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 12,
    borderWidth: 1.5, borderColor: colors.textDark,
    borderRadius: 24, paddingHorizontal: 16, height: 50,
  },
  pickerSearchInput: { flex: 1, fontSize: 16, color: colors.textDark },
  pickerItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 24,
  },
  pickerItemName: { fontSize: 15, fontWeight: '600', color: colors.textDark },
  pickerItemBrand: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  pickerItemPrice: { fontSize: 14, fontWeight: '700', color: '#A855F7' },
  pickerItemQty: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  // Detail dialog
  dialogOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  dialogCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 24, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  dialogTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dialogGRNName: { fontSize: 20, fontWeight: '700', color: colors.textDark },
  dialogMeta: { fontSize: 14, color: colors.textMuted, marginBottom: 6 },
  dialogDivider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  dialogSectionTitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  dialogProductRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  dialogProductName: { flex: 2, fontSize: 14, color: colors.textDark },
  dialogProductQty: { flex: 1, fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  dialogProductTotal: { flex: 1.2, fontSize: 14, fontWeight: '600', color: '#A855F7', textAlign: 'right' },
  dialogActions: { flexDirection: 'row', gap: 12 },
  dialogEditBtn: {
    flex: 1, height: 46, borderRadius: 23, borderWidth: 1.5, borderColor: '#dbeafe',
    backgroundColor: '#eff6ff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6,
  },
  dialogEditBtnText: { fontSize: 14, fontWeight: '600', color: '#3B82F6' },
  dialogDeleteBtn: {
    flex: 1, height: 46, borderRadius: 23, backgroundColor: colors.error,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6,
  },
  dialogDeleteBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  deleteIconWrap: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#fef2f2',
    justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16,
  },
  deleteTitle: { fontSize: 20, fontWeight: '700', color: colors.textDark, textAlign: 'center', marginBottom: 10 },
  deleteMessage: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  editInput: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4, fontSize: 14, color: colors.textDark, textAlign: 'center', width: 60,
  },
  calendarOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  calendarCard: { width: '100%', backgroundColor: '#fff', borderRadius: 24, padding: 16, elevation: 10 },
  calendarCloseBtn: { marginTop: 12, paddingVertical: 12, alignItems: 'center', borderRadius: 12, backgroundColor: '#f1f5f9' },
  calendarCloseBtnText: { color: colors.textDark, fontWeight: '600', fontSize: 15 },
});
