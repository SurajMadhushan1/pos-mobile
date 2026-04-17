import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

export default function AppSettingsScreen() {
  const navigation = useNavigation();

  // Settings State
  const [useBluetoothPrinter, setUseBluetoothPrinter] = useState(true);
  const [paperSize, setPaperSize] = useState<'58mm' | '80mm'>('58mm');
  const [autoPrint, setAutoPrint] = useState(true);

  const [exportFormat, setExportFormat] = useState<'PDF' | 'CSV'>('PDF');
  const [includeLogo, setIncludeLogo] = useState(true);

  const [scannerBeep, setScannerBeep] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#888" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Section 1: Printing */}
        <View style={styles.sectionHeader}>
          <Ionicons name="print" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Printing Settings</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.settingRowContainer}>
            <View style={styles.settingTextContainer}>
               <Text style={styles.settingLabel}>Bluetooth Printer</Text>
               <Text style={styles.settingSubLabel}>Connect to receipt printer via Bluetooth</Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: colors.primaryLight }}
              thumbColor={useBluetoothPrinter ? colors.primary : '#FFF'}
              onValueChange={setUseBluetoothPrinter}
              value={useBluetoothPrinter}
            />
          </View>
          <View style={styles.divider} />
          
          <View style={styles.settingRowContainer}>
             <View style={styles.settingTextContainer}>
               <Text style={styles.settingLabel}>Receipt Paper Size</Text>
               <Text style={styles.settingSubLabel}>Select the thermal printer paper width</Text>
             </View>
             <View style={styles.togglePillContainer}>
               <TouchableOpacity 
                 style={[styles.togglePillOption, paperSize === '58mm' && styles.togglePillOptionActive]}
                 onPress={() => setPaperSize('58mm')}
               >
                 <Text style={[styles.togglePillText, paperSize === '58mm' && styles.togglePillTextActive]}>58mm</Text>
               </TouchableOpacity>
               <TouchableOpacity 
                 style={[styles.togglePillOption, paperSize === '80mm' && styles.togglePillOptionActive]}
                 onPress={() => setPaperSize('80mm')}
               >
                 <Text style={[styles.togglePillText, paperSize === '80mm' && styles.togglePillTextActive]}>80mm</Text>
               </TouchableOpacity>
             </View>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.settingRowContainer}>
            <View style={styles.settingTextContainer}>
               <Text style={styles.settingLabel}>Auto-Print Receipt</Text>
               <Text style={styles.settingSubLabel}>Print automatically after checkout</Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: colors.primaryLight }}
              thumbColor={autoPrint ? colors.primary : '#FFF'}
              onValueChange={setAutoPrint}
              value={autoPrint}
            />
          </View>
        </View>

        {/* Section 2: Export */}
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Document Export</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.settingRowContainer}>
             <View style={styles.settingTextContainer}>
               <Text style={styles.settingLabel}>Default Export Format</Text>
               <Text style={styles.settingSubLabel}>Format for reports and invoices</Text>
             </View>
             <View style={styles.togglePillContainer}>
               <TouchableOpacity 
                 style={[styles.togglePillOption, exportFormat === 'PDF' && styles.togglePillOptionActive]}
                 onPress={() => setExportFormat('PDF')}
               >
                 <Text style={[styles.togglePillText, exportFormat === 'PDF' && styles.togglePillTextActive]}>PDF</Text>
               </TouchableOpacity>
               <TouchableOpacity 
                 style={[styles.togglePillOption, exportFormat === 'CSV' && styles.togglePillOptionActive]}
                 onPress={() => setExportFormat('CSV')}
               >
                 <Text style={[styles.togglePillText, exportFormat === 'CSV' && styles.togglePillTextActive]}>CSV</Text>
               </TouchableOpacity>
             </View>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.settingRowContainer}>
            <View style={styles.settingTextContainer}>
               <Text style={styles.settingLabel}>Include Store Logo</Text>
               <Text style={styles.settingSubLabel}>Embed store icon in PDF exports</Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: colors.primaryLight }}
              thumbColor={includeLogo ? colors.primary : '#FFF'}
              onValueChange={setIncludeLogo}
              value={includeLogo}
            />
          </View>
        </View>

        {/* Section 3: Preferences */}
        <View style={styles.sectionHeader}>
          <Ionicons name="settings" size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>App Preferences</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.settingRowContainer}>
            <View style={styles.settingTextContainer}>
               <Text style={styles.settingLabel}>Scanner Beep</Text>
               <Text style={styles.settingSubLabel}>Play sound on successful scan</Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: colors.primaryLight }}
              thumbColor={scannerBeep ? colors.primary : '#FFF'}
              onValueChange={setScannerBeep}
              value={scannerBeep}
            />
          </View>
          <View style={styles.divider} />
          
          <View style={styles.settingRowContainer}>
            <View style={styles.settingTextContainer}>
               <Text style={styles.settingLabel}>Dark Mode Theme</Text>
               <Text style={styles.settingSubLabel}>Use app in dark appearance</Text>
            </View>
            <Switch
              trackColor={{ false: '#E2E8F0', true: colors.primaryLight }}
              thumbColor={darkMode ? colors.primary : '#FFF'}
              onValueChange={setDarkMode}
              value={darkMode}
            />
          </View>
        </View>

      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 10,
  },
  backBtn: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
    marginLeft: -20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  
  // Sections
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  settingRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  settingSubLabel: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  
  // Toggle Pills
  togglePillContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 2,
  },
  togglePillOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  togglePillOptionActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  togglePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  togglePillTextActive: {
    color: colors.primary,
  },
});
