import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useCurrency } from '../context/CurrencyContext';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { currency, setCurrency } = useCurrency();
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const MENU_ITEMS = [
    { id: '0', title: 'Profile', icon: 'person-outline', action: () => navigation.navigate('ShopProfile') as any },
    { id: '1', title: 'Home', icon: 'home-outline', action: () => navigation.navigate('MainTabs', { screen: 'Shop' }) as any },
    { id: '2', title: 'Currency Settings', icon: 'cash-outline', action: () => setShowCurrencyModal(true) },
    { id: '3', title: 'Sub admins', icon: 'people-outline', action: () => navigation.navigate('SubAdmins') as any },
    { id: '4', title: 'Manage Customers', icon: 'person-add-outline', action: () => navigation.navigate('Customers') },
    { id: '5', title: 'Billing', icon: 'receipt-outline', action: () => navigation.navigate('UserBilling') as any },
    { id: '7', title: 'Bill & Inventory History', icon: 'time-outline', action: () => navigation.navigate('BillInventoryHistory') as any },
    { id: '8', title: 'User Settings', icon: 'person-outline', action: () => navigation.navigate('UserSettings') as any },
    { id: '9', title: 'App Settings', icon: 'settings-outline', action: () => navigation.navigate('AppSettings') as any },
    { id: '11', title: 'About App', icon: 'apps-outline', action: () => navigation.navigate('AboutApp') as any },
    { id: '12', title: 'Logout', icon: 'log-out-outline', action: () => {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to log out?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] }) }
        ]
      );
    } },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate('MainTabs', { screen: 'Shop' } as any)}>
          <Ionicons name="close" size={28} color="#666" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <Text style={styles.langText}>ENG</Text>
          <Ionicons name="globe-outline" size={22} color={colors.primary} style={{ marginLeft: 6, marginRight: 16 }} />
          <View style={styles.notificationWrapper}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
            <View style={styles.notificationDot} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {/* Using a placeholder mimicking the graphic's SHOP cart logo */}
            <View style={styles.avatarCircle}>
              <Ionicons name="cart" size={32} color="#15803D" />
              <Text style={styles.avatarText}>SHOP</Text>
            </View>
          </View>
          <Text style={styles.profileName}>SSS</Text>
          <Text style={styles.profileRole}>jithu</Text>
        </View>

        <View style={styles.divider} />

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
              <View style={styles.iconContainer}>
                 <Ionicons name={item.icon as any} size={22} color={colors.primary} />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Currency Settings Modal */}
      <Modal visible={showCurrencyModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowCurrencyModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Currency</Text>
                
                <TouchableOpacity 
                  style={[styles.currencyOption, currency === 'LKR' && styles.currencyOptionActive]}
                  onPress={() => { setCurrency('LKR'); setShowCurrencyModal(false); }}
                >
                  <Text style={[styles.currencyText, currency === 'LKR' && styles.currencyTextActive]}>LKR (Rs.)</Text>
                  {currency === 'LKR' && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.currencyOption, currency === 'USD' && styles.currencyOptionActive]}
                  onPress={() => { setCurrency('USD'); setShowCurrencyModal(false); }}
                >
                  <Text style={[styles.currencyText, currency === 'USD' && styles.currencyTextActive]}>USD ($)</Text>
                  {currency === 'USD' && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  currencyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  currencyOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20',
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  currencyTextActive: {
    color: colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: '#FDFEFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  notificationWrapper: {
    position: 'relative',
    marginRight: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FDE6BA',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatarText: {
    fontWeight: '900',
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 32,
    marginTop: 24,
    marginBottom: 16,
  },
  menuContainer: {
    paddingHorizontal: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  iconContainer: {
    width: 30,
    alignItems: 'flex-start',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginLeft: 8,
  },
});
