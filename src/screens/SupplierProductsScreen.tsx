import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  FlatList,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SupplierProducts'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'SupplierProducts'>;

type ProductRow = {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export default function SupplierProductsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { supplierName, supplierId, newProducts } = route.params;

  const [products, setProducts] = useState<ProductRow[]>([]);

  useEffect(() => {
    if (newProducts && newProducts.length > 0) {
      setProducts(prev => {
        // Merge: if same productName already exists, add the quantity/total
        const merged = [...prev];
        newProducts.forEach(incoming => {
          const existing = merged.findIndex(p => p.productName === incoming.productName);
          if (existing >= 0) {
            merged[existing] = {
              ...merged[existing],
              quantity: merged[existing].quantity + incoming.quantity,
              total: merged[existing].total + incoming.total,
            };
          } else {
            merged.push(incoming);
          }
        });
        return merged;
      });
    }
  }, [newProducts]);

  const renderProduct = ({ item }: { item: ProductRow }) => (
    <View style={styles.row}>
      <View style={{ flex: 2 }}>
        <Text style={styles.cellProduct}>{item.productName}</Text>
        <Text style={styles.cellPrice}>LKR {item.unitPrice.toFixed(2)} / unit</Text>
      </View>
      <Text style={[styles.cellStock, { color: item.quantity > 0 ? colors.success : colors.error }]}>
        {item.quantity}
      </Text>
      <Text style={styles.cellTotal}>
        {item.total.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{supplierName}'s Products</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Summary bar */}
      {products.length > 0 && (
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            {products.length} product{products.length > 1 ? 's' : ''}
          </Text>
          <Text style={styles.summaryTotal}>
            Total: LKR {products.reduce((acc, p) => acc + p.total, 0).toFixed(2)}
          </Text>
        </View>
      )}

      <View style={styles.tableHeader}>
        <Text style={styles.colProduct}>Product</Text>
        <Text style={styles.colStock}>Qty</Text>
        <Text style={styles.colTotal}>Total (LKR)</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={52} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Products Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create a Purchase Order to add products for this supplier
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => navigation.navigate('SupplierPurchaseOrders', { supplierName, supplierId })}
            >
              <Text style={styles.emptyBtnText}>Create Purchase Order</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    flex: 1,
    textAlign: 'center',
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ede9fe',
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
  },
  summaryTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7c3aed',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  colProduct: {
    flex: 2,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  colStock: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textAlign: 'center',
  },
  colTotal: {
    flex: 1.2,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textAlign: 'right',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cellProduct: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
  },
  cellPrice: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  cellStock: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  cellTotal: {
    flex: 1.2,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    color: '#A855F7',
  },
  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  emptyBtn: {
    backgroundColor: '#A855F7',
    paddingVertical: 13,
    paddingHorizontal: 28,
    borderRadius: 24,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
