import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Platform,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SupplierPurchaseOrders'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'SupplierPurchaseOrders'>;

export default function SupplierPurchaseOrdersScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { supplierName, supplierId } = route.params;

  const [activeTab, setActiveTab] = useState('Pending Orders');
  const [showMenu, setShowMenu] = useState(false);
  const [paymentType, setPaymentType] = useState('Cash Sales');
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const TABS = ['Pending Orders', 'Complete Orders', 'Payments', 'Return Orders'];
  const PAYMENT_TYPES = ['Cash Sales', 'Credit Sales', 'Cheque Sales', 'QR Sales'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2}>{supplierName}'s Purchase{"\n"}Orders</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => navigation.navigate('CreatePurchaseOrder', { supplierName, supplierId })}
          >
            <Ionicons name="add" size={20} color={colors.surface} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.grnBtn}
            onPress={() => navigation.navigate('SupplierGRN', { supplierName, supplierId })}
          >
            <Text style={styles.grnBtnText}>GRNs</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.tabSection, { zIndex: 10 }]}>
        <Text style={styles.tabActive}>{activeTab}</Text>
        <TouchableOpacity onPress={() => setShowMenu(true)}>
          <Ionicons name="ellipsis-vertical" size={20} color="#A855F7" />
        </TouchableOpacity>
      </View>

      {activeTab === 'Payments' && (
        <View style={styles.paymentsSubHeader}>
           <View style={{ zIndex: 11 }}>
              <TouchableOpacity onPress={() => setShowPaymentDropdown(!showPaymentDropdown)} style={styles.paymentDropdownBtn}>
                  <Text style={styles.paymentDropdownText}>{paymentType}</Text>
                  <Ionicons name="chevron-down" size={16} color={colors.textDark} />
              </TouchableOpacity>
              {showPaymentDropdown && (
                  <View style={styles.paymentDropdownList}>
                      {PAYMENT_TYPES.map(pt => (
                        <TouchableOpacity 
                          key={pt} 
                          style={styles.paymentDropdownListItem}
                          onPress={() => { setPaymentType(pt); setShowPaymentDropdown(false); }}
                        >
                          <Text style={[styles.paymentDropdownListText, paymentType === pt && { color: '#A855F7', fontWeight: '700' }]}>{pt}</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
              )}
           </View>
           
           {paymentType === 'Credit Sales' && (
              <View style={styles.creditInfoBox}>
                  <View style={{ alignItems: 'center' }}>
                     <Text style={styles.totalLabel}>Total Outstanding</Text>
                     <Text style={styles.totalValue}>0.00</Text>
                  </View>
                  <TouchableOpacity style={styles.payIconBtn}>
                     <Ionicons name="cash-outline" size={20} color="#fff" />
                  </TouchableOpacity>
              </View>
           )}
        </View>
      )}

      <View style={[styles.centerContent, { zIndex: 1 }]}>
        <Text style={styles.emptyText}>No Purchase Orders Found</Text>
      </View>

      {/* Menu Overlay */}
      <Modal visible={showMenu} transparent animationType="fade">
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={styles.menuCard}>
            {TABS.map((tab) => (
              <TouchableOpacity 
                key={tab} 
                style={styles.menuItem} 
                onPress={() => { setActiveTab(tab); setShowMenu(false); }}
              >
                <Text style={[styles.menuItemText, activeTab === tab && { fontWeight: '700', color: colors.textDark }]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 24,
  },
  backBtn: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grnBtn: {
    backgroundColor: '#A855F7',
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grnBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  tabSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tabActive: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A855F7',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: colors.textMuted,
    fontWeight: '500'
  },
  menuOverlay: {
    flex: 1,
  },
  menuCard: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 100,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    width: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 15,
    color: colors.textDark,
  },
  paymentsSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
    zIndex: 10,
  },
  paymentDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.textDark,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 140,
    backgroundColor: '#F8FAFC',
  },
  paymentDropdownText: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '500',
  },
  paymentDropdownList: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  paymentDropdownListItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  paymentDropdownListText: {
    fontSize: 14,
    color: colors.textDark,
  },
  creditInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textDark,
  },
  totalValue: {
    fontSize: 14,
    color: colors.textDark,
  },
  payIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D8B4FE',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
