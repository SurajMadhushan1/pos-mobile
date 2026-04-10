import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Modal,
  FlatList,
  StyleSheet,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

// Dummy Data
const DUMMY_PRODUCTS = [
  { id: '1', name: 'Red rice', price: 175.0, qty: 2, amount: 350.0 },
  { id: '2', name: 'Apples', price: 245.0, qty: 1, amount: 245.0 },
  { id: '3', name: 'sugar', price: 220.0, qty: 3, amount: 660.0 },
  { id: '4', name: 'CR Page 120', price: 365.0, qty: 1, amount: 365.0 },
  { id: '5', name: 'Cheese', price: 1200.0, qty: 3, amount: 3600.0 },
];

export default function POSHomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [cart, setCart] = useState(DUMMY_PRODUCTS);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);
  const [customDiscountText, setCustomDiscountText] = useState('');
  const [editingQtyItem, setEditingQtyItem] = useState<{ id: string, currentQty: string } | null>(null);

  const getCartTotal = () => {
    return cart.reduce((total: number, item: any) => total + (item.price * item.qty), 0);
  };

  const discountAmount = getCartTotal() * (discountPercent / 100);
  const finalTotal = getCartTotal() - discountAmount;

  const updateQty = (id: string, delta: number) => {
    setCart((prev: any[]) => prev.map((item: any) => {
      if (item.id === id) {
        // If current qty is a decimal and we press minus/plus, step nicely or just add delta
        let newQty = item.qty + delta;
        
        // Prevent going below 0.01
        if (newQty <= 0) newQty = 0.01;
        
        return { ...item, qty: newQty, amount: item.price * newQty };
      }
      return item;
    }));
  };

  const setExactQty = (id: string, exactQty: number) => {
    if (exactQty <= 0) return;
    setCart((prev: any[]) => prev.map((item: any) => {
      if (item.id === id) {
        return { ...item, qty: exactQty, amount: item.price * exactQty };
      }
      return item;
    }));
  };

  const deleteItem = (id: string) => {
    setCart((prev: any[]) => prev.filter((item: any) => item.id !== id));
  };

  const renderCartItem = ({ item }: { item: typeof DUMMY_PRODUCTS[0] }) => (
    <View style={styles.cartItemCard}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>{item.price.toFixed(1)} LKR</Text>
      </View>
      
      <View style={styles.qtyControlContainer}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)}>
          <Ionicons name="remove" size={16} color={colors.textDark} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ paddingHorizontal: 4 }} 
          onPress={() => setEditingQtyItem({ id: item.id, currentQty: item.qty.toString() })}
        >
          <Text style={styles.qtyText}>{item.qty}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)}>
          <Ionicons name="add" size={16} color={colors.textDark} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cartItemAmountContainer}>
        <Text style={styles.cartItemAmount}>{item.amount.toFixed(1)}</Text>
        <TouchableOpacity onPress={() => deleteItem(item.id)} style={{ marginTop: 8 }}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerPillContainer}>
        <View style={styles.headerPill}>
          <Text style={styles.headerPillText}>Invoice 1</Text>
        </View>
      </View>

      <View style={styles.searchHeader}>
        <Text style={styles.searchTitle}>Search Items</Text>
        <View style={styles.searchActions}>
          <TouchableOpacity 
            style={[styles.actionIcon, { backgroundColor: '#A855F7' }]}
            onPress={() => setIsAddingToCart(true)}
          >
            <Ionicons name="add" size={20} color={colors.surface} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionIcon, { backgroundColor: '#C084FC' }]}
            onPress={() => navigation.navigate('Scanner' as any)}
          >
            <Ionicons name="barcode-outline" size={20} color={colors.surface} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionIcon, { backgroundColor: '#EC4899' }]}>
            <Ionicons name="copy-outline" size={20} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listHeaderRow}>
        <Text style={styles.listHeaderCol1}>Item Description</Text>
        <Text style={styles.listHeaderCol2}>Qty</Text>
        <Text style={styles.listHeaderCol3}>Amount(LKR)</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryActionsRow}>
          <TouchableOpacity onPress={() => setCart([])}>
            <Text style={styles.purpleTextBold}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addDiscountRow} onPress={() => setIsDiscountModalVisible(true)}>
            <Text style={styles.purpleTextBold}>
              {discountPercent > 0 ? `Discount: ${discountPercent}%` : 'Add Discount'}
            </Text>
            <Ionicons name="options" size={16} color="#A855F7" style={{ marginLeft: 4 }}/>
          </TouchableOpacity>
        </View>

        <View style={styles.invoiceSummaryBox}>
          <Text style={styles.summaryTitle}>Invoice Summery</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryValue}>LKR {getCartTotal().toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={styles.summaryValue}>-LKR {discountAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Payment</Text>
            <Text style={styles.summaryValue}>LKR {finalTotal.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.footerRow}>
          <View style={styles.footerTotalBox}>
            <Text style={styles.footerTotalLabel}>Total</Text>
            <Text style={styles.footerTotalValue}>LKR {finalTotal.toFixed(2)}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.generateBtn}
            onPress={() => navigation.navigate('Receipt', {
              total: finalTotal,
              discount: discountAmount,
              items: cart
            })}
          >
            <Text style={styles.generateBtnText}>Generate Bill</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Items to Bill Modal */}
      <Modal visible={isAddingToCart} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.summaryTitle}>Quick Add Item</Text>
            <Text style={styles.summaryLabel}>Select a common item to add to the bill.</Text>
            
            <View style={{ marginTop: 20, gap: 12 }}>
              <TouchableOpacity style={styles.cartItemCard} onPress={() => {
                setCart([...cart, { id: Date.now().toString(), name: 'Water Bottle', price: 150.0, qty: 1, amount: 150.0 }]);
                setIsAddingToCart(false);
              }}>
                <Text style={styles.cartItemName}>Water Bottle (150 LKR)</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.cartItemCard} onPress={() => {
                setCart([...cart, { id: Date.now().toString(), name: 'Biscuits', price: 450.0, qty: 1, amount: 450.0 }]);
                setIsAddingToCart(false);
              }}>
                <Text style={styles.cartItemName}>Biscuits (450 LKR)</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.generateBtn, { marginTop: 20, backgroundColor: colors.textMuted }]}
              onPress={() => setIsAddingToCart(false)}
            >
              <Text style={[styles.generateBtnText, { textAlign: 'center' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Apply Discount Modal */}
      <Modal visible={isDiscountModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.summaryTitle}>Apply Discount</Text>
            <Text style={styles.summaryLabel}>Enter percentage discount for this bill</Text>
            
            <TextInput
              style={{
                borderWidth: 1, borderColor: colors.border, borderRadius: 8,
                padding: 12, fontSize: 18, marginTop: 16, marginBottom: 24,
                textAlign: 'center'
              }}
              placeholder="0%"
              keyboardType="numeric"
              value={customDiscountText}
              onChangeText={setCustomDiscountText}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                style={[styles.generateBtn, { flex: 1, backgroundColor: colors.textMuted }]}
                onPress={() => setIsDiscountModalVisible(false)}
              >
                <Text style={[styles.generateBtnText, { textAlign: 'center' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.generateBtn, { flex: 1 }]}
                onPress={() => {
                  setDiscountPercent(Number(customDiscountText) || 0);
                  setIsDiscountModalVisible(false);
                }}
              >
                <Text style={[styles.generateBtnText, { textAlign: 'center' }]}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Quantity Modal (for decimals / weights) */}
      <Modal visible={!!editingQtyItem} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.summaryTitle}>Enter Exact Quantity</Text>
            <Text style={styles.summaryLabel}>Examples: 1.5, 0.25 (for 250g)</Text>
            
            <TextInput
              style={{
                borderWidth: 1, borderColor: colors.border, borderRadius: 8,
                padding: 12, fontSize: 18, marginTop: 16, marginBottom: 24,
                textAlign: 'center'
              }}
              placeholder="e.g. 0.25"
              keyboardType="numeric"
              value={editingQtyItem?.currentQty || ''}
              onChangeText={(text) => setEditingQtyItem(prev => prev ? {...prev, currentQty: text} : null)}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                style={[styles.generateBtn, { flex: 1, backgroundColor: colors.textMuted }]}
                onPress={() => setEditingQtyItem(null)}
              >
                <Text style={[styles.generateBtnText, { textAlign: 'center' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.generateBtn, { flex: 1 }]}
                onPress={() => {
                  if (editingQtyItem) {
                    const parsedQty = parseFloat(editingQtyItem.currentQty);
                    if (!isNaN(parsedQty) && parsedQty > 0) {
                      setExactQty(editingQtyItem.id, parsedQty);
                    }
                  }
                  setEditingQtyItem(null);
                }}
              >
                <Text style={[styles.generateBtnText, { textAlign: 'center' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerPillContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'flex-start',
  },
  headerPill: {
    backgroundColor: '#A855F7',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerPillText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchTitle: {
    fontSize: 18,
    color: colors.textMuted,
  },
  searchActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listHeaderCol1: { flex: 2, fontSize: 12, color: colors.textMuted },
  listHeaderCol2: { flex: 1, fontSize: 12, color: colors.textMuted, textAlign: 'center' },
  listHeaderCol3: { flex: 1, fontSize: 12, color: colors.textMuted, textAlign: 'right' },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cartItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cartItemInfo: {
    flex: 2,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  cartItemPrice: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  qtyControlContainer: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 8,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  cartItemAmountContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  cartItemAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981', // Emerald/Green color from UI
  },
  summaryContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  summaryActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  purpleTextBold: {
    color: '#A855F7',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addDiscountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invoiceSummaryBox: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  summaryValue: {
    fontSize: 13,
    color: colors.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerTotalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerTotalLabel: {
    fontSize: 16,
    color: colors.textMuted,
  },
  footerTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  generateBtn: {
    backgroundColor: '#A855F7', // Magenta/Purple
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  generateBtnText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
  }
});
