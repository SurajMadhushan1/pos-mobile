import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const INVENTORY_DATA = [
  { id: '1', name: 'sugar', brand: 'Cosan', price: 220.0, qty: 1986, sales: 14, code: '4792210100262' },
  { id: '2', name: 'CR Page 120', brand: 'Atlas', price: 365.0, qty: 4, sales: 8, code: '4792210100262' },
  { id: '3', name: 'Glu Bottle Medium', brand: 'Atlas', price: 80.0, qty: 4, sales: 8, code: '4792210100262' },
  { id: '4', name: 'Cheese', brand: 'Happycow', price: 1200.0, qty: 13, sales: 7, code: '4792210100262' },
  { id: '5', name: 'Red rice', brand: 'Araliya', price: 175.0, qty: 1994, sales: 6, code: '4792210100262' },
  { id: '6', name: 'sanitizer', brand: 'Nest', price: 1000.0, qty: 14, sales: 6, code: '4792210100262' },
  { id: '7', name: 'Apples', brand: 'Applo', price: 245.0, qty: 17, sales: 3, code: '4792210100262' },
];

export default function InventoryScreen() {
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<typeof INVENTORY_DATA[0] | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const renderItem = ({ item }: { item: typeof INVENTORY_DATA[0] }) => (
    <TouchableOpacity 
      style={styles.tableRow} 
      onPress={() => setSelectedItem(item)}
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
          <TouchableOpacity style={styles.iconButton} onPress={() => setIsAddingItem(true)}>
            <Ionicons name="add" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, styles.darkIconButton]}>
            <Ionicons name="pricetag" size={24} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.colNameHeader}>Product Name</Text>
        <Text style={styles.colPriceHeader}>Unit Price(LKR)</Text>
        <Text style={styles.colQtyHeader}>Ava.Qty</Text>
        <Text style={styles.colSalesHeader}>No of Sales</Text>
      </View>

      <FlatList
        data={INVENTORY_DATA}
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
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <View style={styles.modalTopSection}>
                  <View style={styles.modalImagePlaceholder}>
                    <Ionicons name="image-outline" size={40} color={colors.textMuted} />
                    <View style={styles.editIconBadge}>
                      <Ionicons name="pencil" size={12} color={colors.surface} />
                    </View>
                  </View>
                  <View style={styles.modalHeaderInfo}>
                    <Text style={styles.modalQty}>{selectedItem.qty.toFixed(2)}</Text>
                    <Text style={styles.modalQtyLabel}>Available Quantity</Text>
                    <Text style={styles.modalOldPrice}>LKR {selectedItem.price.toFixed(2)}</Text>
                  </View>
                </View>

                <Text style={styles.modalProductNumber}>Product Number: {selectedItem.code}</Text>

                <View style={styles.modalFieldsContainer}>
                  {/* Product Name */}
                  <View style={styles.modalFieldGroup}>
                    <Text style={styles.modalFieldLabel}>Product Name</Text>
                    <View style={styles.modalInputBox}>
                      <Ionicons name="pricetag-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                      <TextInput style={styles.modalInput} value={selectedItem.name} />
                    </View>
                  </View>

                  {/* Price */}
                  <View style={styles.modalFieldGroup}>
                    <Text style={styles.modalFieldLabel}>Price</Text>
                    <View style={styles.modalInputBox}>
                      <Ionicons name="logo-usd" size={20} color={colors.textMuted} style={styles.inputIcon} />
                      <TextInput style={styles.modalInput} value={selectedItem.price.toFixed(2)} keyboardType="numeric" />
                    </View>
                  </View>

                  {/* Quantity */}
                  <View style={styles.modalFieldGroup}>
                    <Text style={styles.modalFieldLabel}>Quantity</Text>
                    <View style={styles.modalInputBox}>
                      <Ionicons name="layers-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                      <TextInput style={styles.modalInput} value={selectedItem.qty.toFixed(2)} keyboardType="numeric" />
                    </View>
                  </View>

                  {/* Brand Name */}
                  <View style={styles.modalFieldGroup}>
                    <Text style={styles.modalFieldLabel}>Brand Name</Text>
                    <View style={styles.modalInputBox}>
                      <Ionicons name="pricetag-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                      <TextInput style={styles.modalInput} value={selectedItem.brand} />
                    </View>
                  </View>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={styles.modalBtnCancel} 
                    onPress={() => setSelectedItem(null)}
                  >
                    <Text style={styles.modalBtnCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.modalBtnSave}
                    onPress={() => setSelectedItem(null)} // Dummy save
                  >
                    <Text style={styles.modalBtnSaveText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Item Modal */}
      <Modal visible={isAddingItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalTopSection}>
              <View style={styles.modalImagePlaceholder}>
                <Ionicons name="image-outline" size={40} color={colors.textMuted} />
                <View style={styles.editIconBadge}>
                  <Ionicons name="add" size={12} color={colors.surface} />
                </View>
              </View>
              <View style={styles.modalHeaderInfo}>
                <Text style={styles.modalQty}>New Product</Text>
              </View>
            </View>

            <View style={styles.modalFieldsContainer}>
              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalFieldLabel}>Product Name</Text>
                <View style={styles.modalInputBox}>
                  <Ionicons name="pricetag-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput style={styles.modalInput} placeholder="Enter name" />
                </View>
              </View>
              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalFieldLabel}>Price</Text>
                <View style={styles.modalInputBox}>
                  <Ionicons name="logo-usd" size={20} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput style={styles.modalInput} placeholder="0.00" keyboardType="numeric" />
                </View>
              </View>
              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalFieldLabel}>Quantity</Text>
                <View style={styles.modalInputBox}>
                  <Ionicons name="layers-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput style={styles.modalInput} placeholder="1" keyboardType="numeric" />
                </View>
              </View>
              <View style={styles.modalFieldGroup}>
                <Text style={styles.modalFieldLabel}>Brand Name</Text>
                <View style={styles.modalInputBox}>
                  <Ionicons name="pricetag-outline" size={20} color={colors.textMuted} style={styles.inputIcon} />
                  <TextInput style={styles.modalInput} placeholder="Enter brand" />
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setIsAddingItem(false)}>
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtnSave, { backgroundColor: colors.success }]} onPress={() => { alert('Item added!'); setIsAddingItem(false); }}>
                <Text style={styles.modalBtnSaveText}>Add Product</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#8B5CF6', // Purple to match UI screenshot
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTopSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalImagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: colors.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: colors.textMuted,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  modalHeaderInfo: {
    flex: 1,
    alignItems: 'center',
  },
  modalQty: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  modalQtyLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
    marginVertical: 4,
  },
  modalOldPrice: {
    fontSize: 14,
    color: colors.textMuted,
  },
  modalProductNumber: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 20,
  },
  modalFieldsContainer: {
    gap: 16,
  },
  modalFieldGroup: {
    position: 'relative',
  },
  modalFieldLabel: {
    position: 'absolute',
    top: -8,
    left: 40,
    backgroundColor: colors.surface,
    zIndex: 1,
    paddingHorizontal: 4,
    fontSize: 12,
    color: colors.textMuted,
  },
  modalInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
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
    height: 48,
    backgroundColor: '#000',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnCancelText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 16,
  },
  modalBtnSave: {
    flex: 1,
    height: 48,
    backgroundColor: '#A855F7', // Magenta/Purple
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnSaveText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 16,
  }
});
