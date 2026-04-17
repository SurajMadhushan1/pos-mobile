import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import AddProductModal from '../components/AddProductModal';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductList'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'ProductList'>;

const INVENTORY_DATA = [
  { id: '1', name: 'sugar', brand: 'Cosan', price: 220.0, qty: 1986, sales: 14, code: '4792210100262' },
  { id: '2', name: 'CR Page 120', brand: 'Atlas', price: 365.0, qty: 4, sales: 8, code: '4792210100262' },
  { id: '3', name: 'Glu Bottle Medium', brand: 'Atlas', price: 80.0, qty: 4, sales: 8, code: '4792210100262' },
  { id: '4', name: 'Cheese', brand: 'Happycow', price: 1200.0, qty: 13, sales: 7, code: '4792210100262' },
  { id: '5', name: 'Red rice', brand: 'Araliya', price: 175.0, qty: 1994, sales: 6, code: '4792210100262' },
  { id: '6', name: 'sanitizer', brand: 'Nest', price: 1000.0, qty: 14, sales: 6, code: '4792210100262' },
  { id: '7', name: 'Apples', brand: 'Applo', price: 245.0, qty: 17, sales: 3, code: '4792210100262' },
];

export default function ProductListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { supplierName, supplierId } = route.params;
  const [search, setSearch] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const filtered = INVENTORY_DATA.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const renderItem = ({ item }: { item: typeof INVENTORY_DATA[0]}) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('CreatePurchaseOrder', { supplierName, supplierId, selectedProduct: item })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.cardText}>{item.name}</Text>
        <Text style={[styles.cardText, { color: colors.textMuted }]}>LKR {item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={colors.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product List</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setIsModalVisible(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color={colors.textDark} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Inventory"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />

      <AddProductModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 20,
  },
  backBtn: {
    padding: 4,
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    textAlign: 'center',
    marginRight: -10, // balance layout
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.textDark,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textDark,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textDark,
  }
});
