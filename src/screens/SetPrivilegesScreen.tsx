import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type PrivilegesState = {
  [key: string]: boolean;
};

export default function SetPrivilegesScreen() {
  const navigation = useNavigation();

  // Initial state representing all the toggles
  const [privs, setPrivs] = useState<PrivilegesState>({
    cust_view: false, cust_edit: false, cust_own: false, cust_loyalty: false,
    inv_view: false, inv_edit: false, inv_cost: false, inv_sup: false,
    invc_all: false, invc_own: false, invc_profits: false, invc_gen: false, invc_kitchen: false,
    invc_select: false, invc_edit: false, invc_del: false, invc_price: true, invc_disc: false,
    set_edit: false, set_down: false, set_branch: false,
    rep_item: false, rep_profits: false, rep_sales: false
  });

  const togglePriv = (key: string) => {
    setPrivs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const CustomToggle = ({ value, onValueChange }: { value: boolean, onValueChange: () => void }) => {
    return (
      <TouchableOpacity 
        style={[styles.toggleContainer, value ? styles.toggleOn : styles.toggleOff]} 
        onPress={onValueChange}
        activeOpacity={0.8}
      >
        <View style={[styles.toggleThumb, value ? styles.thumbOn : styles.thumbOff]} />
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, items: {label: string, key: string}[]) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {items.map((item, index) => (
        <View key={item.key} style={[styles.row, index === items.length - 1 && { marginBottom: 0 }]}>
          <Text style={styles.rowLabel}>{item.label}</Text>
          <CustomToggle value={privs[item.key]} onValueChange={() => togglePriv(item.key)} />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#888" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set privileges</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {renderSection('Customers', [
          { label: 'View', key: 'cust_view' },
          { label: 'Edit', key: 'cust_edit' },
          { label: 'Show own customers only', key: 'cust_own' },
          { label: 'Show loyalty & credit customers', key: 'cust_loyalty' },
        ])}

        {renderSection('Inventory', [
          { label: 'View', key: 'inv_view' },
          { label: 'Edit', key: 'inv_edit' },
          { label: 'Product Cost', key: 'inv_cost' },
          { label: 'Suppliers and GRN', key: 'inv_sup' },
        ])}

        {renderSection('Invoices', [
          { label: 'All Invoices Analytics', key: 'invc_all' },
          { label: 'Show own invoices', key: 'invc_own' },
          { label: 'Show profits', key: 'invc_profits' },
          { label: 'Generate Invoices', key: 'invc_gen' },
          { label: 'Kitchen', key: 'invc_kitchen' },
          { label: 'Select sub-admins when creating an invoice', key: 'invc_select' },
          { label: 'Edit Invoice', key: 'invc_edit' },
          { label: 'Delete Invoice', key: 'invc_del' },
          { label: 'Edit Product Price', key: 'invc_price' },
          { label: 'Edit Product Discount', key: 'invc_disc' },
        ])}

        {renderSection('Settings', [
          { label: 'Edit Sub Admins', key: 'set_edit' },
          { label: 'Download Reports', key: 'set_down' },
          { label: 'Edit Branches', key: 'set_branch' },
        ])}

        {renderSection('Reports and Analysis', [
          { label: 'Item Costs', key: 'rep_item' },
          { label: 'Profits', key: 'rep_profits' },
          { label: 'Sales Analytics', key: 'rep_sales' },
        ])}

        {/* Bottom padding for the fixed button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.bottomFixedArea}>
        <TouchableOpacity style={styles.enableButton} onPress={() => navigation.goBack()}>
          <Text style={styles.enableButtonText}>Enable Privileges</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    color: '#A855F7',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
    paddingRight: 20,
    lineHeight: 22,
  },
  /* Custom Toggle Styles */
  toggleContainer: {
    width: 48,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    padding: 3,
  },
  toggleOff: {
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
    alignItems: 'flex-start',
  },
  toggleOn: {
    borderWidth: 2,
    borderColor: '#C084FC',
    backgroundColor: '#C084FC',
    alignItems: 'flex-end',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  thumbOff: {
    backgroundColor: '#000',
  },
  thumbOn: {
    backgroundColor: '#A855F7', // Inner thumb color based on screenshot 2
  },
  
  /* Bottom Button */
  bottomFixedArea: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 20,
    right: 20,
  },
  enableButton: {
    backgroundColor: '#FF2A85',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF2A85',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  enableButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  }
});
