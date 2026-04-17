import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import AddProductModal from '../components/AddProductModal';
import CategoriesModal from '../components/CategoriesModal';
import EditCategoryModal from '../components/EditCategoryModal';
import { useCurrency } from '../context/CurrencyContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const INVENTORY_DATA = [
  { id: '1', name: 'sugar', brand: 'Cosan', price: 220.0, qty: 1986, sales: 14, code: '4792210100262', category: 'ggg' },
  { id: '2', name: 'CR Page 120', brand: 'Atlas', price: 365.0, qty: 4, sales: 8, code: '4792210100262', category: 'Stationery' },
  { id: '3', name: 'Glu Bottle Medium', brand: 'Atlas', price: 80.0, qty: 4, sales: 8, code: '4792210100262', category: 'ggg' },
  { id: '4', name: 'Cheese', brand: 'Happycow', price: 1200.0, qty: 13, sales: 7, code: '4792210100262', category: 'Dairy' },
  { id: '5', name: 'Red rice', brand: 'Araliya', price: 175.0, qty: 1994, sales: 6, code: '4792210100262', category: 'Rice' },
  { id: '6', name: 'sanitizer', brand: 'Nest', price: 1000.0, qty: 14, sales: 6, code: '4792210100262', category: 'Health' },
  { id: '7', name: 'Apples', brand: 'Applo', price: 245.0, qty: 17, sales: 3, code: '4792210100262', category: 'Fruits' },
];

export default function InventoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<typeof INVENTORY_DATA[0] | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const { currencySymbol } = useCurrency();
  const [showMenu, setShowMenu] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  const filteredData = INVENTORY_DATA.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                         item.brand.toLowerCase().includes(search.toLowerCase()) ||
                         item.code.includes(search);
    const matchesCategory = selectedCategoryFilter ? item.category === selectedCategoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const renderItem = ({ item }: { item: typeof INVENTORY_DATA[0] }) => (
    <TouchableOpacity 
      style={styles.tableRow} 
      onPress={() => {
        setSelectedItem(item);
        setEditForm({
          ...item,
          cost: (item.price * 0.8).toFixed(2),
          discount: '0.00',
          discountAmt: '0.00',
          qtyStr: item.qty.toFixed(1),
          priceStr: item.price.toFixed(2)
        });
        setIsFavorite(false);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.colName}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemBrand}>{item.brand}</Text>
      </View>
      <Text style={[styles.colPrice, { color: colors.success }]}>
        {item.price.toFixed(1)}
      </Text>
      <Text style={[styles.colQty, { color: item.qty < 20 ? colors.error : colors.textDark }]}>
        {item.qty}
      </Text>
      <Text style={styles.colSales}>{item.sales}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Inventory"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.iconButton, styles.modernAddButton]} 
            onPress={() => setIsAddingItem(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={28} color={colors.surface} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconButton, styles.darkIconButton]}
            onPress={() => setShowMenu(true)}
          >
            <Ionicons name="ellipsis-vertical" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </View>

      {selectedCategoryFilter && (
        <View style={styles.filterChipContainer}>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>Category: {selectedCategoryFilter}</Text>
            <TouchableOpacity onPress={() => setSelectedCategoryFilter(null)}>
              <Ionicons name="close-circle" size={18} color={colors.surface} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.tableHeader}>
        <Text style={styles.colNameHeader}>Product Name</Text>
        <Text style={styles.colPriceHeader}>Unit Price({currencySymbol})</Text>
        <Text style={styles.colQtyHeader}>Ava.Qty</Text>
        <Text style={styles.colSalesHeader}>No of Sales</Text>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Edit Modal matching Graphic 1 */}
      <Modal
        visible={!!selectedItem}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', alignItems: 'center' }}>
            <View style={styles.modalContent}>
              {selectedItem && editForm && (
                <>
                  <ScrollView style={{ marginTop: 10 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                    <View style={[styles.modalTopSection, { justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }]}>
                      <View style={styles.modalProductNumberBox}>
                        <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={{ alignSelf: 'flex-start', marginBottom: 16 }}>
                          <Ionicons name={isFavorite ? "star" : "star-outline"} size={32} color={isFavorite ? "#A855F7" : "#888"} />
                        </TouchableOpacity>
                        <Text style={styles.modalProductNumberLabel}>Product Number</Text>
                        <Text style={styles.modalProductNumberValue}>{selectedItem.code}</Text>
                      </View>

                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={styles.modalQty}>{selectedItem.qty.toFixed(1)}</Text>
                        <Text style={styles.modalQtyLabel}>Available Quantity</Text>
                        <Text style={styles.modalOldPrice}>{currencySymbol} {selectedItem.price.toFixed(2)}</Text>
                      </View>
                    </View>

                  <View style={styles.modalFieldsContainer}>
                    {/* SKU Number */}
                    <View style={styles.modalFieldGroup}>
                      <Text style={styles.modalFieldLabel}>SKU Number</Text>
                      <View style={styles.modalInputBox}>
                        <Ionicons name="pricetag-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput style={styles.modalInput} value={editForm.code} onChangeText={v => setEditForm({...editForm, code: v})} />
                      </View>
                    </View>

                    {/* Product Name */}
                    <View style={styles.modalFieldGroup}>
                      <Text style={styles.modalFieldLabel}>Product Name</Text>
                      <View style={styles.modalInputBox}>
                        <Ionicons name="pricetag-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput style={styles.modalInput} value={editForm.name} onChangeText={v => setEditForm({...editForm, name: v})} />
                      </View>
                    </View>

                    {/* Product Cost */}
                    <View style={styles.modalFieldGroup}>
                      <Text style={styles.modalFieldLabel}>Product Cost</Text>
                      <View style={styles.modalInputBox}>
                        <Ionicons name="cash-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput style={styles.modalInput} value={editForm.cost} keyboardType="numeric" onChangeText={v => setEditForm({...editForm, cost: v})} />
                      </View>
                    </View>

                    {/* Retail Price */}
                    <View style={styles.modalFieldGroup}>
                      <Text style={styles.modalFieldLabel}>Retail Price</Text>
                      <View style={styles.modalInputBox}>
                        <Ionicons name="cash-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput style={styles.modalInput} value={editForm.priceStr} keyboardType="numeric" onChangeText={v => setEditForm({...editForm, priceStr: v})} />
                      </View>
                    </View>

                    {/* Product Discount */}
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={[styles.modalFieldGroup, { flex: 1 }]}>
                        <Text style={styles.modalFieldLabel}>Discount %</Text>
                        <View style={styles.modalInputBox}>
                          <TextInput style={[styles.modalInput, { paddingLeft: 6 }]} value={editForm.discount} keyboardType="numeric" onChangeText={v => setEditForm({...editForm, discount: v})} />
                          <View style={styles.percentBadge}>
                             <Text style={styles.percentBadgeText}>%</Text>
                          </View>
                        </View>
                      </View>
                      <View style={[styles.modalFieldGroup, { flex: 1 }]}>
                        <Text style={styles.modalFieldLabel}>Discount Amt</Text>
                        <View style={styles.modalInputBox}>
                          <TextInput style={[styles.modalInput, { paddingLeft: 6 }]} value={editForm.discountAmt} keyboardType="numeric" onChangeText={v => setEditForm({...editForm, discountAmt: v})} />
                          <Text style={{ color: colors.textMuted, fontWeight: 'bold' }}>{currencySymbol}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Quantity */}
                    <View style={styles.modalFieldGroup}>
                      <Text style={styles.modalFieldLabel}>Quantity</Text>
                      <View style={styles.modalInputBox}>
                        <Ionicons name="file-tray-stacked-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput style={styles.modalInput} value={editForm.qtyStr} keyboardType="numeric" onChangeText={v => setEditForm({...editForm, qtyStr: v})} />
                      </View>
                    </View>

                    {/* Brand Name */}
                    <View style={styles.modalFieldGroup}>
                      <Text style={styles.modalFieldLabel}>Brand Name</Text>
                      <View style={styles.modalInputBox}>
                        <Ionicons name="pricetag-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                        <TextInput style={styles.modalInput} value={editForm.brand} onChangeText={v => setEditForm({...editForm, brand: v})} />
                      </View>
                    </View>
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      style={styles.modalBtnCancel} 
                      onPress={() => { setSelectedItem(null); setEditForm(null); }}
                    >
                      <Text style={styles.modalBtnCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.modalBtnSave}
                      onPress={() => { setSelectedItem(null); setEditForm(null); }} // Dummy save
                    >
                      <Text style={styles.modalBtnSaveText}>Save Changes</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>

      <AddProductModal visible={isAddingItem} onClose={() => setIsAddingItem(false)} />

      {/* Dropdown Menu Modal */}
      <Modal visible={showMenu} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.menuOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); navigation.navigate('Suppliers'); }}>
                  <Ionicons name="people-outline" size={20} color={colors.textDark} style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>Supplier and GRN</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); navigation.navigate('ProductAnalytics'); }}>
                  <Ionicons name="pie-chart-outline" size={20} color={colors.textDark} style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>Product wise Analytics</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); setShowCategoriesModal(true); }}>
                  <Ionicons name="grid-outline" size={20} color={colors.textDark} style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>Categories</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); navigation.navigate('InventoryDownloadReport'); }}>
                  <Ionicons name="download-outline" size={20} color={colors.textDark} style={styles.menuIcon} />
                  <Text style={styles.menuItemText}>Download Reports</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <CategoriesModal
        visible={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        onEditCategory={(cat) => setSelectedCategoryForEdit(cat)}
        onAnalyticsPress={() => {
          setShowCategoriesModal(false);
          navigation.navigate('CategoryAnalytics');
        }}
        onSelectCategory={(catName) => setSelectedCategoryFilter(catName)}
      />
      
      {selectedCategoryForEdit && (
        <EditCategoryModal
          visible={!!selectedCategoryForEdit}
          category={selectedCategoryForEdit}
          onClose={() => setSelectedCategoryForEdit(null)}
          onSave={() => setSelectedCategoryForEdit(null)}
        />
      )}

      {/* Pickers converted to inline UI */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surface,
  },
  searchContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginRight: 16,
  },
  searchInput: {
    height: 40,
    fontSize: 16,
    color: colors.textDark,
  },
  headerActions: { flexDirection: 'row', gap: 12 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernAddButton: {
    backgroundColor: '#A855F7',
    width: 44,
    height: 44,
    borderRadius: 22,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  darkIconButton: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  colNameHeader: { flex: 2, fontSize: 12, color: colors.textMuted },
  colPriceHeader: { flex: 1.5, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  colQtyHeader: { flex: 1, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  colSalesHeader: { flex: 1, fontSize: 12, color: colors.textMuted, textAlign: 'right' },
  listContainer: { padding: 16 },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  separator: { height: 8 },
  colName: { flex: 2 },
  itemName: { fontSize: 14, fontWeight: '600', color: colors.textDark },
  itemBrand: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  colPrice: { flex: 1.5, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  colQty: { flex: 1, fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  colSales: { flex: 1, fontSize: 14, color: colors.textMuted, fontWeight: '500', textAlign: 'right' },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '90%',
    flexShrink: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTopSection: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  modalImageWrapper: {
    flex: 1,
    alignItems: 'center',
    marginRight: 16,
  },
  modalImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#6B7280',
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalProductNumberBox: {
    marginTop: 0,
    alignItems: 'flex-start',
  },
  modalProductNumberLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  modalProductNumberValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  modalQty: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textDark,
  },
  modalQtyLabel: {
    fontSize: 15,
    color: colors.textMuted,
    fontWeight: '600',
    marginVertical: 6,
  },
  modalOldPrice: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 12,
  },
  modalIconRow: {
    flexDirection: 'row',
    gap: 12,
  },
  purpleCircleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFieldsContainer: {
    gap: 18,
  },
  modalFieldGroup: {
    position: 'relative',
    paddingTop: 8,
  },
  modalFieldLabel: {
    position: 'absolute',
    top: 0,
    left: 28,
    backgroundColor: colors.surface,
    zIndex: 1,
    paddingHorizontal: 6,
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  modalInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  modalInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textDark,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  modalBtnCancel: {
    flex: 1,
    height: 54,
    backgroundColor: '#000',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnCancelText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 16,
  },
  modalBtnSave: {
    flex: 1.25,
    height: 54,
    backgroundColor: '#A855F7',
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnSaveText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 15,
  },
  percentBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentBadgeText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  menuContainer: {
    position: 'absolute',
    top: 70,
    right: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    width: 230,
    borderWidth: Platform.OS === 'android' ? 1 : 0,
    borderColor: '#E5E7EB',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textDark,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  filterChipContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: colors.surface,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A855F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterChipText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '600',
  }
});
