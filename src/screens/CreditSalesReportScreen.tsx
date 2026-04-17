import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

// ─── Dummy Invoice Data ───────────────────────────────────────────────────────
const DUMMY_INVOICES = [
  {
    invoiceNumber: 'INV0003',
    createdDate: '2026-04-17',
    phoneNumber: '077 123 4567',
    address: '12 Galle Rd, Colombo',
    total: 19000,
    paidAmount: 19000,
    outstandingAmount: 0,
    settledDate: '2026-04-17',
    settledAmount: 19000,
  },
  {
    invoiceNumber: 'INV0004',
    createdDate: '2026-04-17',
    phoneNumber: '071 987 6543',
    address: '45 Kandy Rd, Peradeniya',
    total: 5000,
    paidAmount: 2000,
    outstandingAmount: 3000,
    settledDate: '',
    settledAmount: 2000,
  }
];

// ─── Section Definitions ─────────────────────────────────────────────────────

type SettingKey = keyof typeof DUMMY_INVOICES[0];

const SECTIONS: { key: SettingKey; label: string; default: boolean; isCustomAddressToggle?: boolean }[][] = [
  [
    { key: 'invoiceNumber', label: 'Invoice Number', default: false },
    { key: 'createdDate', label: 'Created Date', default: true },
  ],
  [
    { key: 'phoneNumber', label: 'Phone Number', default: true },
    { key: 'address', label: 'Address', default: true, isCustomAddressToggle: true },
  ],
  [
    { key: 'total', label: 'Total', default: true },
    { key: 'paidAmount', label: 'Paid Amount', default: true },
    { key: 'outstandingAmount', label: 'Outstanding Amount', default: true },
  ],
  [
    { key: 'settledDate', label: 'Settled Date', default: true },
    { key: 'settledAmount', label: 'Settled Amount', default: true },
  ]
];

function buildInitialState(): Record<string, boolean> {
  const state: Record<string, boolean> = {};
  SECTIONS.flat().forEach(s => { state[s.key] = s.default; });
  return state;
}

// ─── Export Helpers ───────────────────────────────────────────────────────────

function buildCSV(invoices: typeof DUMMY_INVOICES, enabledKeys: SettingKey[]): string {
  const headers = enabledKeys.map(k => SECTIONS.flat().find(s => s.key === k)?.label ?? k).join(',');
  const rows = invoices.map(inv =>
    enabledKeys.map(k => {
      const val = inv[k];
      const str = String(val ?? '');
      return str.includes(',') ? `"${str}"` : str;
    }).join(',')
  );
  return [headers, ...rows].join('\n');
}

function buildHTML(
  invoices: typeof DUMMY_INVOICES,
  enabledKeys: SettingKey[],
): string {
  const headers = enabledKeys.map(k => `<th>${SECTIONS.flat().find(s => s.key === k)?.label ?? k}</th>`).join('');
  const rows = invoices.map(inv => {
    const cells = enabledKeys.map(k => {
      const val = inv[k];
      return `<td>${val ?? ''}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #1E293B; }
      .header { background: #A855F7; color: white; padding: 20px 24px; border-radius: 12px; margin-bottom: 24px; }
      .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      thead th { background: #A855F7; color: white; padding: 10px 12px; text-align: left; }
      tbody tr:nth-child(even) { background: #F8FAFC; }
      tbody td { padding: 9px 12px; border-bottom: 1px solid #E2E8F0; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Credit Sales Report</h1>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    <table>
      <thead><tr>${headers}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </body>
  </html>
  `;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreditSalesReportScreen() {
  const navigation = useNavigation();

  const [toggles, setToggles] = useState<Record<string, boolean>>(buildInitialState());
  const [isLoadingCSV, setIsLoadingCSV] = useState(false);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);

  const toggle = (key: string) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const enabledKeys = Object.keys(toggles).filter(k => toggles[k]) as SettingKey[];

  // ── Export ────────────────────────────────────────────────────────────────

  const handleCSV = async () => {
    if (enabledKeys.length === 0) {
      Alert.alert('No Columns', 'Please enable at least one column to export.'); return;
    }
    setIsLoadingCSV(true);
    try {
      const csv  = buildCSV(DUMMY_INVOICES, enabledKeys);
      const path = FileSystem.documentDirectory + `credit_sales_report_${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Share CSV Report' });
      } else {
        Alert.alert('Saved', `CSV saved to:\n${path}`);
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
      const html = buildHTML(DUMMY_INVOICES, enabledKeys);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      const dest = FileSystem.documentDirectory + `credit_sales_report_${Date.now()}.pdf`;
      await FileSystem.moveAsync({ from: uri, to: dest });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(dest, { mimeType: 'application/pdf', dialogTitle: 'Share PDF Report' });
      } else {
        Alert.alert('Saved', `PDF saved to:\n${dest}`);
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
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#888" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Download Report</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {SECTIONS.map((group, groupIdx) => (
          <View key={groupIdx} style={styles.card}>
            {group.map((setting, idx) => (
              <View 
                key={setting.key} 
                style={[
                  styles.settingRow, 
                  idx < group.length - 1 && styles.borderBottom
                ]}
              >
                <Text style={styles.settingLabel}>{setting.label}</Text>
                
                {setting.isCustomAddressToggle && toggles[setting.key] ? (
                  <TouchableOpacity onPress={() => toggle(setting.key)} style={styles.customBlackToggle}>
                    <View style={styles.customBlackThumb} />
                  </TouchableOpacity>
                ) : (
                  <Switch
                    value={!!toggles[setting.key]}
                    onValueChange={() => toggle(setting.key)}
                    trackColor={{ false: '#E2E8F0', true: '#C4A1FF' }}
                    thumbColor={toggles[setting.key] ? '#9F7AEA' : '#FFFFFF'}
                    ios_backgroundColor="#E2E8F0"
                  />
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.csvBtn, isLoadingCSV && styles.btnDisabled]}
          onPress={handleCSV}
          disabled={isLoadingCSV || isLoadingPDF}
        >
          {isLoadingCSV ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnText}>CSV Report</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pdfBtn, (isLoadingPDF || isLoadingCSV) && styles.btnDisabled]}
          onPress={handlePDF}
          disabled={isLoadingCSV || isLoadingPDF}
        >
          {isLoadingPDF ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnText}>PDF Report</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FAFAFA'
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 16,
    overflow: 'hidden'
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000'
  },
  bottomBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: '#FAFAFA',
  },
  csvBtn: {
    flex: 1,
    backgroundColor: '#9F7AEA',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pdfBtn: {
    flex: 1,
    backgroundColor: '#9F7AEA',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600'
  },
  btnDisabled: { opacity: 0.6 },
  customBlackToggle: {
    width: 51,
    height: 31,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#000',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    paddingHorizontal: 2,
    alignItems: 'flex-end'
  },
  customBlackThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000'
  }
});
