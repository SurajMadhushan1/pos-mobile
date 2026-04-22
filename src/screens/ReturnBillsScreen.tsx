import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

export default function ReturnBillsScreen() {
  const navigation = useNavigation();
  const [status, setStatus] = useState('Damaged');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const STATUS_OPTIONS = ['Damaged', 'Expired', 'Non expired'];

  const maxQty = 4.0;
  const unitPrice = 5000.00; // 20000 / 4
  const [returnQty, setReturnQty] = useState('0');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#555" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Return Bills</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.thText, { flex: 2 }]}>Product Name</Text>
        <Text style={[styles.thText, { flex: 1, textAlign: 'center' }]}>Qty</Text>
        <Text style={[styles.thText, { flex: 1.5, textAlign: 'right' }]}>Amount (LKR)</Text>
      </View>

      {/* List Item */}
      <View style={styles.itemContainer}>
        <View style={styles.itemRow}>
          <Text style={[styles.itemTextStr, { flex: 2, fontWeight: '700' }]}>ddd</Text>
          <Text style={[styles.itemTextStr, { flex: 1, textAlign: 'center', color: '#E53E3E', fontWeight: '600' }]}>4</Text>
          <Text style={[styles.itemTextStr, { flex: 1.5, textAlign: 'right', color: '#38A169', fontWeight: '600' }]}>20000.00</Text>
        </View>

        <View style={styles.inputsRow}>
          {/* Return Qty Input */}
          <View style={styles.outlineInputContainer}>
            <View style={styles.outlineLabelBg}>
              <Text style={styles.outlineLabel}>Return Qty (max 4.0)</Text>
            </View>
            <TextInput 
              style={styles.outlineInput}
              value={returnQty}
              onChangeText={setReturnQty}
              keyboardType="numeric"
            />
          </View>

          {/* Return Status Dropdown */}
          <View style={[styles.outlineInputContainer, { zIndex: 10 }]}>
            <View style={styles.outlineLabelBg}>
              <Text style={styles.outlineLabel}>Return Status</Text>
            </View>
            <TouchableOpacity 
              style={styles.outlineDropdown}
              onPress={() => setDropdownOpen(!dropdownOpen)}
            >
              <Text style={styles.outlineDropdownText}>{status}</Text>
              <Ionicons name="caret-down" size={14} color="#555" />
            </TouchableOpacity>
            {dropdownOpen && (
              <View style={styles.dropdownList}>
                {STATUS_OPTIONS.map((opt, idx) => (
                  <TouchableOpacity 
                    key={idx}
                    style={[styles.dropdownItem, idx !== STATUS_OPTIONS.length - 1 && styles.borderBottom]}
                    onPress={() => {
                       setStatus(opt);
                       setDropdownOpen(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, status === opt && styles.dropdownItemTextActive]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Spacer to push buttons to bottom, or use absolute positioning */}
      <View style={{ flex: 1 }} />

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.issueBtn}
          onPress={() => {
            const qtyNum = parseFloat(returnQty) || 0;
            if (qtyNum <= 0 || qtyNum > maxQty) {
              alert('Please enter a valid return quantity between 0 and 4.');
              return;
            }
            const totalReturnAmt = -(qtyNum * unitPrice);
            (navigation as any).navigate('Receipt', {
              total: totalReturnAmt,
              subTotal: totalReturnAmt,
              itemDiscountTotal: 0,
              invoiceDiscountAmt: 0,
              invoiceLabel: 'RETURN BILL',
              items: [
                {
                   name: 'ddd (Return)',
                   originalPrice: -unitPrice,
                   price: -unitPrice,
                   qty: qtyNum,
                   unit: 'Pcs',
                }
              ],
              paymentMethod: 'Cash',
              paidAmount: totalReturnAmt
            });
          }}
        >
          <Text style={styles.issueBtnText}>Issue Bill</Text>
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  thText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  
  itemContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  itemTextStr: {
    fontSize: 15,
    color: '#000',
  },
  
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  outlineInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#A0AEC0',
    borderRadius: 12,
    height: 50,
    position: 'relative',
    marginTop: 8,
  },
  outlineLabelBg: {
    position: 'absolute',
    top: -10,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    zIndex: 1,
  },
  outlineLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  outlineInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
  },
  outlineDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  outlineDropdownText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownList: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#A0AEC0',
    borderRadius: 8,
    zIndex: 100,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
  },
  dropdownItemTextActive: {
    color: '#000',
    fontWeight: '700',
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#A855F7',
    borderRadius: 24,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  issueBtn: {
    flex: 1,
    backgroundColor: '#A855F7',
    borderRadius: 24,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
