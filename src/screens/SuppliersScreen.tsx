import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

const MOCK_SUPPLIERS = [
  { id: '1', name: 'ggg', refNumber: '99', companyName: '89', phone: '0765555555' },
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Suppliers'>;
type Supplier = { id: string; name: string; refNumber: string; companyName: string; phone: string };

export default function SuppliersScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [search, setSearch] = useState('');
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);

  // Add supplier modal
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRef, setNewRef] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Edit supplier modal
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editName, setEditName] = useState('');
  const [editRef, setEditRef] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Delete confirmation dialog
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);

  const resetAddForm = () => {
    setNewName(''); setNewRef(''); setNewCompany(''); setNewPhone('');
  };

  const handleSaveSupplier = () => {
    if (!newName.trim()) return;
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      name: newName.trim(),
      refNumber: newRef.trim(),
      companyName: newCompany.trim(),
      phone: newPhone.trim(),
    };
    setSuppliers(prev => [...prev, newSupplier]);
    resetAddForm();
    setIsAddingSupplier(false);
  };

  const openEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setEditName(supplier.name);
    setEditRef(supplier.refNumber);
    setEditCompany(supplier.companyName);
    setEditPhone(supplier.phone);
  };

  const handleSaveEdit = () => {
    if (!editName.trim() || !editingSupplier) return;
    setSuppliers(prev =>
      prev.map(s =>
        s.id === editingSupplier.id
          ? { ...s, name: editName.trim(), refNumber: editRef.trim(), companyName: editCompany.trim(), phone: editPhone.trim() }
          : s
      )
    );
    setEditingSupplier(null);
  };

  const handleDeleteConfirm = () => {
    if (!deletingSupplier) return;
    setSuppliers(prev => prev.filter(s => s.id !== deletingSupplier.id));
    setDeletingSupplier(null);
  };

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.companyName.toLowerCase().includes(search.toLowerCase())
  );

  const renderSupplierCard = ({ item }: { item: Supplier }) => (
    <View style={styles.card}>
      <View style={styles.cardMain}>
        <View style={styles.cardLeft}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.supplierName}>{item.name}</Text>
            <Text style={styles.supplierDetail}>Ref: {item.refNumber || '—'}</Text>
            <Text style={styles.supplierDetail}>{item.companyName || '—'}</Text>
            <Text style={styles.supplierDetail}>{item.phone || '—'}</Text>
          </View>
        </View>
        {/* Edit / Delete */}
        <View style={styles.iconActions}>
          <TouchableOpacity style={styles.editIconBtn} onPress={() => openEdit(item)}>
            <Ionicons name="pencil" size={16} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteIconBtn} onPress={() => setDeletingSupplier(item)}>
            <Ionicons name="trash" size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Navigation Buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.productsBtn}
          onPress={() => navigation.navigate('SupplierProducts', { supplierName: item.name, supplierId: item.id })}
        >
          <Text style={styles.productsBtnText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.poBtn}
          onPress={() => navigation.navigate('SupplierPurchaseOrders', { supplierName: item.name, supplierId: item.id })}
        >
          <Text style={styles.poBtnText}>PO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suppliers</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setIsAddingSupplier(true)}>
          <Ionicons name="add" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search supplier"
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderSupplierCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Ionicons name="people-outline" size={48} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, marginTop: 12, fontSize: 15 }}>No suppliers found</Text>
          </View>
        }
      />

      {/* ─── Add Supplier Modal ─── */}
      <Modal visible={isAddingSupplier} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView style={styles.modalContent} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Supplier</Text>
              <TouchableOpacity onPress={() => { setIsAddingSupplier(false); resetAddForm(); }}>
                <Ionicons name="close" size={26} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <FormField label="Supplier Name *" placeholder="John Doe" value={newName} onChange={setNewName} />
              <FormField label="Ref Number" placeholder="123" value={newRef} onChange={setNewRef} keyboardType="numeric" />
              <FormField label="Company Name" placeholder="ABC Corp" value={newCompany} onChange={setNewCompany} />
              <FormField label="Phone Number" placeholder="07XXXXXXXX" value={newPhone} onChange={setNewPhone} keyboardType="phone-pad" />
              <TouchableOpacity
                style={[styles.saveBtn, !newName.trim() && { opacity: 0.5 }]}
                onPress={handleSaveSupplier}
                disabled={!newName.trim()}
              >
                <Text style={styles.saveBtnText}>Save Supplier</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ─── Edit Supplier Modal ─── */}
      <Modal visible={!!editingSupplier} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView style={styles.modalContent} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Supplier</Text>
              <TouchableOpacity onPress={() => setEditingSupplier(null)}>
                <Ionicons name="close" size={26} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              <FormField label="Supplier Name *" placeholder="John Doe" value={editName} onChange={setEditName} />
              <FormField label="Ref Number" placeholder="123" value={editRef} onChange={setEditRef} keyboardType="numeric" />
              <FormField label="Company Name" placeholder="ABC Corp" value={editCompany} onChange={setEditCompany} />
              <FormField label="Phone Number" placeholder="07XXXXXXXX" value={editPhone} onChange={setEditPhone} keyboardType="phone-pad" />
              <View style={styles.editModalActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingSupplier(null)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtn, { flex: 1 }, !editName.trim() && { opacity: 0.5 }]}
                  onPress={handleSaveEdit}
                  disabled={!editName.trim()}
                >
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ─── Delete Confirmation Dialog ─── */}
      <Modal visible={!!deletingSupplier} animationType="fade" transparent>
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <View style={styles.dialogIconWrap}>
              <Ionicons name="trash-outline" size={32} color={colors.error} />
            </View>
            <Text style={styles.dialogTitle}>Delete Supplier?</Text>
            <Text style={styles.dialogMessage}>
              Are you sure you want to delete{'\n'}
              <Text style={{ fontWeight: '700', color: colors.textDark }}>{deletingSupplier?.name}</Text>?{'\n'}
              This action cannot be undone.
            </Text>
            <View style={styles.dialogActions}>
              <TouchableOpacity style={styles.dialogCancelBtn} onPress={() => setDeletingSupplier(null)}>
                <Text style={styles.dialogCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogDeleteBtn} onPress={handleDeleteConfirm}>
                <Text style={styles.dialogDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// Reusable form field component
function FormField({ label, placeholder, value, onChange, keyboardType = 'default' }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.inputBox}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: colors.textDark },
  addBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#A855F7',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#A855F7', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 4,
  },
  searchWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    marginHorizontal: 20, paddingHorizontal: 16, height: 48,
    borderRadius: 24, borderWidth: 1, borderColor: colors.border, marginBottom: 20,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: colors.textDark },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  cardMain: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', padding: 16,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#f5f3ff',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#A855F7' },
  supplierName: { fontSize: 16, fontWeight: '700', color: colors.textDark, marginBottom: 4 },
  supplierDetail: { fontSize: 13, color: colors.textMuted, marginBottom: 2 },
  iconActions: { flexDirection: 'row', gap: 8, paddingLeft: 8 },
  editIconBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#eff6ff',
    justifyContent: 'center', alignItems: 'center',
  },
  deleteIconBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#fef2f2',
    justifyContent: 'center', alignItems: 'center',
  },
  cardActions: {
    flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  productsBtn: {
    flex: 1, paddingVertical: 12, alignItems: 'center',
    borderRightWidth: 1, borderRightColor: '#f1f5f9',
    backgroundColor: '#faf5ff',
  },
  productsBtnText: { color: '#A855F7', fontWeight: '700', fontSize: 14 },
  poBtn: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  poBtnText: { color: '#F472B6', fontWeight: '700', fontSize: 14 },
  // Modals shared
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30,
    padding: 24, maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.textDark },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, color: colors.textMuted, marginBottom: 6, marginLeft: 4, fontWeight: '500' },
  inputBox: {
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 12,
    paddingHorizontal: 16, height: 50, fontSize: 15, color: colors.textDark,
    backgroundColor: '#FAFAFA',
  },
  saveBtn: {
    backgroundColor: '#A855F7', borderRadius: 24, height: 52,
    justifyContent: 'center', alignItems: 'center', marginTop: 8, marginBottom: 30,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  editModalActions: { flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 30 },
  cancelBtn: {
    flex: 1, height: 52, borderRadius: 24, borderWidth: 1.5,
    borderColor: colors.border, justifyContent: 'center', alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  // Delete Dialog
  dialogOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 32,
  },
  dialogCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 24,
    padding: 28, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
  },
  dialogIconWrap: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#fef2f2',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  dialogTitle: { fontSize: 20, fontWeight: '700', color: colors.textDark, marginBottom: 10 },
  dialogMessage: {
    fontSize: 14, color: colors.textMuted, textAlign: 'center',
    lineHeight: 22, marginBottom: 24,
  },
  dialogActions: { flexDirection: 'row', gap: 12, width: '100%' },
  dialogCancelBtn: {
    flex: 1, height: 50, borderRadius: 25, borderWidth: 1.5,
    borderColor: colors.border, justifyContent: 'center', alignItems: 'center',
  },
  dialogCancelText: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  dialogDeleteBtn: {
    flex: 1, height: 50, borderRadius: 25, backgroundColor: colors.error,
    justifyContent: 'center', alignItems: 'center',
  },
  dialogDeleteText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
