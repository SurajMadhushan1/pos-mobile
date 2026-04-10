import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Receipt'>;

export default function ReceiptScreen({ route, navigation }: Props) {
  // Extract data from route.params, provide fallbacks
  const { total = 0, discount = 0, items = [] } = route.params || {};

  const subTotal = total + discount; // SubTotal is price before discount
  const discountLabel = discount > 0 ? `LKR ${discount.toFixed(2)}` : '0';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="cart" size={24} color={colors.success} />
            <Text style={styles.logoText}>SHOP</Text>
          </View>
          <Text style={styles.shopName}>Disanayaka Stores</Text>
          <Text style={styles.invoiceNumber}>INV0001</Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Item Description</Text>
          <Text style={styles.tableHeaderText}>Amount</Text>
        </View>

        {/* Items */}
        <View style={styles.itemsContainer}>
          {items.map((item: any, index: number) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCalc}>LKR {item.price.toFixed(1)} x {item.qty.toFixed(1)}</Text>
              </View>
              <Text style={styles.itemAmount}>LKR {item.amount.toFixed(2)}</Text>
            </View>
          ))}
          {items.length === 0 && (
             <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textMuted }}>No items in bill</Text>
          )}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sub Total</Text>
            <Text style={styles.totalValue}>LKR {subTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Discount:</Text>
            <Text style={styles.totalValue}>{discountLabel}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.finalTotalLabel}>Total</Text>
            <Text style={styles.finalTotalValue}>LKR {total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#A855F7' }]}>
            <Ionicons name="share-social" size={20} color={colors.surface} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#EC4899' }]}>
            <Ionicons name="print" size={20} color={colors.surface} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="exit-outline" size={20} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface, // Setting entirely to white
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7', // Amber 100
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 16,
  },
  invoiceNumber: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: colors.textDark,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    paddingBottom: 8,
    marginBottom: 16,
  },
  tableHeaderText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '500',
  },
  itemsContainer: {
    marginBottom: 24,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    color: colors.textDark,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemCalc: {
    fontSize: 13,
    color: colors.textMuted,
  },
  itemAmount: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textDark,
  },
  totalsContainer: {
    alignItems: 'flex-end',
    marginBottom: 40,
    paddingTop: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.textMuted,
  },
  totalValue: {
    fontSize: 14,
    color: colors.textMuted,
  },
  finalTotalLabel: {
    fontSize: 16,
    color: colors.textDark,
  },
  finalTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  }
});
