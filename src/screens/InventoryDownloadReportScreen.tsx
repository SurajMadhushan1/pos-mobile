import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { colors } from '../theme/colors';

// ─── Dummy Data for Report ──────────────────────────────────────────────────
const DUMMY_INVENTORY = [
  {
    productName: 'Sugar', skuNumber: '4792210100262', brandName: 'Cosan',
    productCategory: 'Groceries', productType: 'Food', productPrice: 200, salesPrice: 220,
    productDiscount: 0, discountType: 'None', remainingQuantity: 1986, noOfSales: 14,
    invoiceQuantity: 10, totalProfit: 280
  },
  {
    productName: 'CR Page 120', skuNumber: '4792210100263', brandName: 'Atlas',
    productCategory: 'Stationery', productType: 'Book', productPrice: 300, salesPrice: 365,
    productDiscount: 5, discountType: 'Percentage', remainingQuantity: 4, noOfSales: 8,
    invoiceQuantity: 5, totalProfit: 520
  },
  {
    productName: 'Glu Bottle Medium', skuNumber: '4792210100264', brandName: 'Atlas',
    productCategory: 'Stationery', productType: 'Glue', productPrice: 50, salesPrice: 80,
    productDiscount: 0, discountType: 'None', remainingQuantity: 4, noOfSales: 8,
    invoiceQuantity: 2, totalProfit: 240
  },
];

// ─── Configuration ────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 's1',
    settings: [
      { key: 'productName', label: 'Product Name', default: false },
      { key: 'skuNumber', label: 'SKU Number', default: true },
      { key: 'brandName', label: 'Brand Name', default: false },
    ]
  },
  {
    id: 's2',
    settings: [
      { key: 'productCategory', label: 'Product Category', default: false },
      { key: 'productType', label: 'Product Type', default: false },
    ]
  },
  {
    id: 's3',
    settings: [
      { key: 'productPrice', label: 'Product Price', default: false },
      { key: 'salesPrice', label: 'Sales Price', default: false },
    ]
  },
  {
    id: 's4',
    settings: [
      { key: 'productDiscount', label: 'Product Discount', default: false },
      { key: 'discountType', label: 'Discount Type', default: false },
    ]
  },
  {
    id: 's5',
    settings: [
      { key: 'remainingQuantity', label: 'Remaining Quantity', default: true },
      { key: 'noOfSales', label: 'No of Sales', default: true },
      { key: 'invoiceQuantity', label: 'Invoice Quantity', default: false },
      { key: 'totalProfit', label: 'Total Profit', default: false },
    ]
  }
];

const ALL_KEYS = SECTIONS.flatMap(s => s.settings.map(r => r.key));
const LABEL_MAP: Record<string, string> = Object.fromEntries(
  SECTIONS.flatMap(s => s.settings.map(r => [r.key, r.label]))
);

function buildInitialState(): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  SECTIONS.forEach(sec => sec.settings.forEach(s => { state[s.key] = s.default; }));
  return state;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function InventoryDownloadReportScreen() {
  const navigation = useNavigation();
  const [toggles, setToggles] = useState<Record<string, boolean>>(buildInitialState());
  const [isLoadingCSV, setIsLoadingCSV] = useState(false);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Main Branch');

  const toggle = (key: string) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const enabledKeys = ALL_KEYS.filter(k => toggles[k]);

  // ── Export ────────────────────────────────────────────────────────────────
  const handleCSV = async () => {
    if (enabledKeys.length === 0) {
      Alert.alert('No Columns', 'Please enable at least one column to export.'); return;
    }
    setIsLoadingCSV(true);
    try {
      const headers = enabledKeys.map(k => LABEL_MAP[k] ?? k).join(',');
      const rows = DUMMY_INVENTORY.map(inv =>
        enabledKeys.map(k => {
          const val = (inv as any)[k];
          const str = String(val ?? '');
          return str.includes(',') ? `"${str}"` : str;
        }).join(',')
      );
      const csv = [headers, ...rows].join('\n');
      const path = FileSystem.documentDirectory + `inventory_report_${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Share CSV Report' });
      } else {
        Alert.alert('Saved', `CSV saved locally.`);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to generate CSV');
    } finally {
      setIsLoadingCSV(false);
    }
  };

  const handlePDF = async () => {
    if (enabledKeys.length === 0) {
      Alert.alert('No Columns', 'Please enable at least one column to export.'); return;
    }
    setIsLoadingPDF(true);
    try {
      const headers = enabledKeys.map(k => `<th>${LABEL_MAP[k] ?? k}</th>`).join('');
      const rows = DUMMY_INVENTORY.map(inv => {
        const cells = enabledKeys.map(k => `<td>${(inv as any)[k] ?? ''}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1E293B; }
            .header { text-align: center; margin-bottom: 24px; color: #7C3AED; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #E2E8F0; }
            th { background: #FAF5FF; font-weight: 600; color: #4C1D95; }
          </style>
        </head>
        <body>
          <h2 class="header">Inventory Report - ${selectedBranch}</h2>
          <table>
            <thead><tr>${headers}</tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const dest = FileSystem.documentDirectory + `inventory_report_${Date.now()}.pdf`;
      await FileSystem.moveAsync({ from: uri, to: dest });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(dest, { mimeType: 'application/pdf', dialogTitle: 'Share PDF Report' });
      } else {
        Alert.alert('Saved', `PDF saved locally.`);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Failed to generate PDF');
    } finally {
      setIsLoadingPDF(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#64748B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Download Report</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Select Branch */}
      <View style={styles.branchContainer}>
        <Text style={styles.branchLabel}>Select Branches</Text>
        <View style={styles.dropdownWrap}>
          <TouchableOpacity 
            style={styles.dropdownButton}
            onPress={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
          >
            <Text style={styles.dropdownButtonText}>{selectedBranch}</Text>
            <Ionicons name="chevron-down" size={16} color="#64748B" />
          </TouchableOpacity>
          {isBranchDropdownOpen && (
            <View style={styles.dropdownMenu}>
              {['Main Branch', 'Branch A', 'Branch B'].map(branch => (
                <TouchableOpacity 
                  key={branch} 
                  style={styles.dropdownMenuItem}
                  onPress={() => { setSelectedBranch(branch); setIsBranchDropdownOpen(false); }}
                >
                  <Text style={styles.dropdownMenuItemText}>{branch}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Toggles List */}
      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {SECTIONS.map((section) => (
          <View key={section.id} style={styles.card}>
            {section.settings.map((s, idx) => {
              // Custom colors based on whether it's toggled
              // In the screenshot, toggled OFF was sometimes white track with black thumb (like "Brand Name")
              // Or custom grey track with white thumb. 
              // We'll use a unified elegant native switch to keep it reliable, but style it close to the image.
              const isEnabled = toggles[s.key];
              
              return (
                <View key={s.key} style={[styles.row, idx < section.settings.length - 1 && styles.rowBorder]}>
                  <Text style={styles.rowLabel}>{s.label}</Text>
                  <Switch
                    value={isEnabled}
                    onValueChange={() => toggle(s.key)}
                    trackColor={{ false: '#D1D5DB', true: '#D8B4FE' }}
                    thumbColor={isEnabled ? '#A855F7' : '#FFFFFF'}
                    ios_backgroundColor="#D1D5DB"
                  />
                </View>
              );
            })}
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.csvButton} onPress={handleCSV} disabled={isLoadingCSV || isLoadingPDF}>
          {isLoadingCSV ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>CSV Report</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.pdfButton} onPress={handlePDF} disabled={isLoadingCSV || isLoadingPDF}>
          {isLoadingPDF ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>PDF Report</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F8F9FA',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
  },
  branchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    zIndex: 10,
  },
  branchLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    marginRight: 12,
  },
  dropdownWrap: {
    flex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 20,
  },
  dropdownMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownMenuItemText: {
    fontSize: 14,
    color: '#334155',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginBottom: 16,
    paddingVertical: 4,
    paddingHorizontal: 20,
    // Add subtle shadow matching image
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowBorder: {
    // optional spacing or borders can go here
  },
  rowLabel: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  bottomBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  csvButton: {
    flex: 1,
    backgroundColor: '#A855F7',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfButton: {
    flex: 1,
    backgroundColor: '#A855F7',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
