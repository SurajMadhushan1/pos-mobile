import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const DUMMY_CUSTOMERS = [
  { id: '1', name: 'Nilantha Perera', phone: '077 123 4567' },
  { id: '2', name: 'Kamal Silva', phone: '071 987 6543' },
  { id: '3', name: 'Kasun Rathnayake', phone: '070 456 7890' },
  { id: '4', name: 'Isuru Fernando', phone: '075 112 2334' },
];

export default function CustomersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [customers, setCustomers] = useState(DUMMY_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const filteredCustomers = customers.filter(
    c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
         c.phone.includes(searchQuery)
  );

  const handleAddCustomer = () => {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const newCustomer = {
      id: Date.now().toString(),
      name: newName,
      phone: newPhone
    };
    setCustomers(prev => [...prev, newCustomer]);
    setModalVisible(false);
    setNewName('');
    setNewPhone('');
  };

  const renderItem = ({ item }: { item: typeof DUMMY_CUSTOMERS[0] }) => {
    const initials = item.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('CustomerDetails', { customerName: item.name, customerInitials: initials })}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={24} color={colors.surface} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>{item.phone}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4, marginRight: 8, marginLeft: -4 }}>
            <Ionicons name="arrow-back" size={24} color={colors.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customers</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color={colors.surface} />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Customer"
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredCustomers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
         <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
           <View style={styles.modalOverlay}>
             <TouchableWithoutFeedback>
               <KeyboardAvoidingView 
                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                 style={styles.modalContent}
               >
                 <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Ionicons name="close" size={24} color="#888" />
                    </TouchableOpacity>
                 </View>

                 <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                       <Ionicons name="person-outline" size={22} color="#888" style={styles.inputIcon} />
                       <TextInput 
                         style={styles.input} 
                         placeholder="Customer Name"
                         placeholderTextColor="#888"
                         value={newName}
                         onChangeText={setNewName}
                       />
                    </View>

                    <View style={styles.inputGroup}>
                       <View style={styles.countryCodeContainer}>
                         <Text style={styles.flagEmoji}>🇱🇰</Text>
                         <Text style={styles.countryCode}>+94</Text>
                       </View>
                       <View style={styles.verticalSeparator} />
                       <TextInput 
                         style={styles.input} 
                         placeholder="Phone Number"
                         placeholderTextColor="#888"
                         keyboardType="phone-pad"
                         value={newPhone}
                         onChangeText={setNewPhone}
                       />
                    </View>

                    <TouchableOpacity style={styles.submitBtn} onPress={handleAddCustomer}>
                      <Text style={styles.submitBtnText}>Add Customers</Text>
                    </TouchableOpacity>
                 </View>
               </KeyboardAvoidingView>
             </TouchableWithoutFeedback>
           </View>
         </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: colors.textDark },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#A855F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: colors.surface, fontWeight: 'bold', marginLeft: 4 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
  },
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#C084FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: colors.textDark },
  phone: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingBottom: 40,
    minHeight: 350,
  },
  modalHeader: {
    alignItems: 'flex-end',
    paddingTop: 24,
    paddingBottom: 16,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#FFF',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 4,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  verticalSeparator: {
    width: 1,
    height: 24,
    backgroundColor: '#CCC',
    marginHorizontal: 12,
  },
  submitBtn: {
    backgroundColor: '#A855F7',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
