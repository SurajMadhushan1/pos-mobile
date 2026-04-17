import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import AddProductModal from '../components/AddProductModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePurchaseOrder'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'CreatePurchaseOrder'>;

// Shared product catalogue (matches InventoryScreen data)
const INVENTORY_DATA = [
  { id: '1', name: 'sugar', brand: 'Cosan', price: 220.0, qty: 1986, code: '4792210100262' },
  { id: '2', name: 'CR Page 120', brand: 'Atlas', price: 365.0, qty: 4, code: '4792210100262' },
  { id: '3', name: 'Glu Bottle Medium', brand: 'Atlas', price: 80.0, qty: 4, code: '4792210100262' },
  { id: '4', name: 'Cheese', brand: 'Happycow', price: 1200.0, qty: 13, code: '4792210100262' },
  { id: '5', name: 'Red rice', brand: 'Araliya', price: 175.0, qty: 1994, code: '4792210100262' },
  { id: '6', name: 'sanitizer', brand: 'Nest', price: 1000.0, qty: 14, code: '4792210100262' },
  { id: '7', name: 'Apples', brand: 'Applo', price: 245.0, qty: 17, code: '4792210100262' },
];

type Product = typeof INVENTORY_DATA[0];

type OrderedItem = {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  isFree: boolean;
};

export default function CreatePurchaseOrderScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();

  // Product picker modal
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Selected product details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState('');
  const [isFreeItem, setIsFreeItem] = useState(false);

  // Discount: toggle between % and fixed amount
  const [discount, setDiscount] = useState('');
  const [isDiscountPercent, setIsDiscountPercent] = useState(true);

  // Ordered products list
  const [orderedProducts, setOrderedProducts] = useState<OrderedItem[]>([]);

  // Edit modal state
  const [editingItem, setEditingItem] = useState<OrderedItem | null>(null);
  const [editQty, setEditQty] = useState('');

  const filteredProducts = INVENTORY_DATA.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

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

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductPicker(false);
    setProductSearch('');
  };

  const handleAddProduct = () => {
    if (!selectedProduct || !quantity) return;
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) return;
    const newLine: OrderedItem = {
      id: Date.now().toString(),
      productName: selectedProduct.name,
      quantity: qty,
      unitPrice: selectedProduct.price,
      total: isFreeItem ? 0 : qty * selectedProduct.price,
      isFree: isFreeItem,
    };
    setOrderedProducts(prev => [...prev, newLine]);
    // Reset for next product
    setSelectedProduct(null);
    setQuantity('');
    setIsFreeItem(false);
  };

  const removeProduct = (id: string) => {
    setOrderedProducts(prev => prev.filter(p => p.id !== id));
  };

  const openEdit = (item: OrderedItem) => {
    setEditingItem(item);
    setEditQty(item.quantity.toString());
  };

  const saveEdit = () => {
    if (!editingItem) return;
    const newQty = parseInt(editQty, 10);
    if (isNaN(newQty) || newQty <= 0) return;
    setOrderedProducts(prev =>
      prev.map(p =>
        p.id === editingItem.id
          ? { ...p, quantity: newQty, total: p.isFree ? 0 : newQty * p.unitPrice }
          : p
      )
    );
    setEditingItem(null);
    setEditQty('');
  };

  const subTotal = orderedProducts.reduce((acc, curr) => acc + curr.total, 0);
  const discountVal = discount ? parseFloat(discount) : 0;
  const discountAmount = isDiscountPercent ? subTotal * (discountVal / 100) : discountVal;
  const totalAmount = Math.max(0, subTotal - discountAmount);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Purchase Order</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Select Product — opens inline modal */}
        <TouchableOpacity
          style={styles.inputWrapper}
          activeOpacity={0.8}
          onPress={() => setShowProductPicker(true)}
        >
          <Text style={[styles.input, !selectedProduct && { color: colors.textMuted }]}>
            {selectedProduct ? selectedProduct.name : 'Select Product'}
          </Text>
          <View style={styles.pinkAddBtn}>
            <Ionicons name="add" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Unit price hint */}
        {selectedProduct && (
          <Text style={styles.priceHint}>
            Unit Price: LKR {selectedProduct.price.toFixed(2)}  ·  In Stock: {selectedProduct.qty}
          </Text>
        )}

        {/* Quantity */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Enter Quantity"
            placeholderTextColor={colors.textMuted}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
        </View>

        {/* Estimated total hint */}
        {selectedProduct && quantity !== '' && !isNaN(parseInt(quantity)) && (
          <Text style={styles.priceHint}>
            Estimated Total: LKR {(parseInt(quantity) * selectedProduct.price).toFixed(2)}
          </Text>
        )}


        <View style={styles.addBtnRow}>
          <TouchableOpacity style={styles.addProductBtn} onPress={handleAddProduct}>
            <Ionicons name="add-circle-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.addProductBtnText}>Add Product</Text>
          </TouchableOpacity>
        </View>

        {/* Ordered Products Table */}
        <Text style={styles.sectionTitle}>
          Ordered Products {orderedProducts.length > 0 ? `(${orderedProducts.length})` : ''}
        </Text>

        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colHeader, { flex: 2 }]}>Product</Text>
            <Text style={[styles.colHeader, { flex: 1.2, textAlign: 'center' }]}>Qty</Text>
            <Text style={[styles.colHeader, { flex: 1.8, textAlign: 'center' }]}>Total</Text>
            <Text style={[styles.colHeader, { flex: 1.2, textAlign: 'right' }]}>Actions</Text>
          </View>

          {orderedProducts.length === 0 ? (
            <View style={styles.emptyTable}>
              <Ionicons name="cart-outline" size={32} color={colors.textMuted} />
              <Text style={styles.emptyTableText}>No products added yet</Text>
            </View>
          ) : (
            orderedProducts.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.cellText} numberOfLines={1}>{item.productName}</Text>
                  {item.isFree && <Text style={styles.freeBadge}>FREE</Text>}
                </View>
                <Text style={[styles.cellText, { flex: 1.2, textAlign: 'center', fontWeight: '600' }]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.cellText, { flex: 1.8, textAlign: 'center', fontWeight: '600', color: '#A855F7' }]}>
                  {item.total.toFixed(2)}
                </Text>
                <View style={{ flex: 1.2, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                  <TouchableOpacity onPress={() => openEdit(item)}>
                    <Ionicons name="pencil-outline" size={18} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeProduct(item.id)}>
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sub Total Amount:</Text>
          <Text style={styles.summaryValue}>{subTotal.toFixed(2)} LKR</Text>
        </View>

        <View style={styles.discountWrapper}>
          <TextInput
            style={styles.discountInput}
            placeholder="Discount"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={discount}
            onChangeText={setDiscount}
          />
          <TouchableOpacity style={styles.discountBadge} onPress={() => setIsDiscountPercent(!isDiscountPercent)}>
            <Text style={styles.discountBadgeText}>{isDiscountPercent ? '%' : 'LKR'}</Text>
          </TouchableOpacity>
        </View>

        {discount !== '' && discountVal > 0 && (
          <Text style={styles.discountSummary}>Discount: - {discountAmount.toFixed(2)} LKR</Text>
        )}

        <View style={[styles.summaryRow, { marginBottom: 12 }]}>
          <Text style={styles.summaryLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>{totalAmount.toFixed(2)} LKR</Text>
        </View>

        <TouchableOpacity 
          style={styles.finalAddBtn}
          onPress={() => navigation.navigate('SupplierProducts', { 
            supplierName: route.params.supplierName, 
            supplierId: route.params.supplierId,
            newProducts: orderedProducts,
          })}
        >
          <Text style={styles.finalAddBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

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
              data={filteredProducts}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.pickerItem} onPress={() => handleSelectProduct(item)}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.pickerItemName}>{item.name}</Text>
                    <Text style={styles.pickerItemBrand}>{item.brand}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.pickerItemPrice}>LKR {item.price.toFixed(2)}</Text>
                    <Text style={styles.pickerItemQty}>Stock: {item.qty}</Text>
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

      {/* ─── Edit Quantity Modal ─── */}
      <Modal visible={!!editingItem} transparent animationType="fade">
        <KeyboardAvoidingView style={styles.editModalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.editModalCard}>
            <Text style={styles.editModalTitle}>Edit Quantity</Text>
            <Text style={styles.editModalProduct}>{editingItem?.productName}</Text>
            <Text style={styles.editModalPriceHint}>Unit Price: LKR {editingItem?.unitPrice.toFixed(2)}</Text>

            <View style={styles.editInputWrapper}>
              <TextInput
                style={styles.editInput}
                value={editQty}
                onChangeText={setEditQty}
                keyboardType="numeric"
                autoFocus
                placeholder="Enter new quantity"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            {editQty !== '' && !isNaN(parseInt(editQty)) && editingItem && (
              <Text style={styles.editNewTotal}>
                New Total: LKR {(parseInt(editQty) * editingItem.unitPrice).toFixed(2)}
              </Text>
            )}

            <View style={styles.editModalActions}>
              <TouchableOpacity style={styles.editCancelBtn} onPress={() => { setEditingItem(null); setEditQty(''); }}>
                <Text style={styles.editCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editSaveBtn} onPress={saveEdit}>
                <Text style={styles.editSaveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 20,
  },
  backBtn: { padding: 4, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textDark },
  scrollContent: { padding: 24, paddingBottom: 40 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
  },
  input: { flex: 1, fontSize: 16, color: colors.textDark },
  pinkAddBtn: {
    backgroundColor: '#F472B6',
    width: 24, height: 24, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  priceHint: {
    fontSize: 13, color: '#A855F7', fontWeight: '600',
    marginTop: -10, marginBottom: 14, marginLeft: 16,
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  checkbox: {
    width: 20, height: 20, borderWidth: 2, borderColor: colors.textDark,
    borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  checkboxActive: { backgroundColor: colors.textDark },
  checkboxLabel: { fontSize: 15, fontWeight: '600', color: colors.textDark },
  addBtnRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 30 },
  addProductBtn: {
    backgroundColor: '#A855F7', flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20,
    shadowColor: '#A855F7', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  addProductBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textMuted, marginBottom: 12 },
  tableCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, minHeight: 100,
  },
  tableHeader: {
    flexDirection: 'row', paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: 4,
  },
  colHeader: { fontSize: 13, fontWeight: '700', color: colors.textDark },
  emptyTable: { paddingVertical: 30, alignItems: 'center', gap: 8 },
  emptyTableText: { color: colors.textMuted, fontSize: 14, fontStyle: 'italic' },
  tableRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f8f8f8',
  },
  cellText: { fontSize: 13, color: colors.textDark },
  freeBadge: {
    fontSize: 10, color: '#16a34a', fontWeight: '700',
    backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4, alignSelf: 'flex-start', marginTop: 2,
  },
  // Footer
  footer: {
    backgroundColor: '#FAFAFA', paddingHorizontal: 24, paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  summaryLabel: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  summaryValue: { fontSize: 15, fontWeight: '700', color: colors.textMuted },
  totalValue: { fontSize: 16, fontWeight: 'bold', color: '#F472B6' },
  discountWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 24,
    paddingHorizontal: 16, height: 48, marginBottom: 8,
  },
  discountInput: { flex: 1, fontSize: 15, color: colors.textDark },
  discountBadge: {
    minWidth: 40, height: 28, borderRadius: 14, borderWidth: 1.5,
    borderColor: '#A855F7', justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 6, marginLeft: 8, backgroundColor: '#f5f3ff',
  },
  discountBadgeText: { fontSize: 12, fontWeight: '700', color: '#A855F7' },
  discountSummary: {
    fontSize: 13, color: '#A855F7', fontWeight: '600',
    marginBottom: 12, marginLeft: 4,
  },
  finalAddBtn: {
    backgroundColor: '#A855F7', height: 54, borderRadius: 27,
    justifyContent: 'center', alignItems: 'center', marginTop: 4,
    shadowColor: '#A855F7', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  finalAddBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
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
  // Edit Modal
  editModalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  editModalCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 24, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  editModalTitle: { fontSize: 18, fontWeight: '700', color: colors.textDark, marginBottom: 6 },
  editModalProduct: { fontSize: 15, color: '#A855F7', fontWeight: '600', marginBottom: 4 },
  editModalPriceHint: { fontSize: 13, color: colors.textMuted, marginBottom: 20 },
  editInputWrapper: {
    borderWidth: 1.5, borderColor: '#A855F7', borderRadius: 16,
    paddingHorizontal: 16, height: 52, justifyContent: 'center', marginBottom: 12,
  },
  editInput: { fontSize: 18, color: colors.textDark, fontWeight: '600' },
  editNewTotal: {
    fontSize: 14, color: '#A855F7', fontWeight: '700',
    marginBottom: 20, textAlign: 'center',
  },
  editModalActions: { flexDirection: 'row', gap: 12 },
  editCancelBtn: {
    flex: 1, height: 48, borderRadius: 24,
    borderWidth: 1.5, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  editCancelBtnText: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  editSaveBtn: {
    flex: 1, height: 48, borderRadius: 24,
    backgroundColor: '#A855F7', justifyContent: 'center', alignItems: 'center',
  },
  editSaveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
