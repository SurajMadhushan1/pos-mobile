import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { height, width } = Dimensions.get('window');

interface CategoriesModalProps {
  visible: boolean;
  onClose: () => void;
  onEditCategory: (cat: any) => void;
  onAnalyticsPress: () => void;
  onSelectCategory: (categoryName: string) => void;
}

export default function CategoriesModal({ visible, onClose, onEditCategory, onAnalyticsPress, onSelectCategory }: CategoriesModalProps) {
  const [search, setSearch] = useState('');

  // Dummy categories based on screenshot
  const categories = [
    { id: '1', name: 'ggg' },
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <TouchableOpacity style={styles.closeHandleHorizontal} onPress={onClose} activeOpacity={1} />
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Categories</Text>
              <TouchableOpacity style={styles.analyticsButton} onPress={onAnalyticsPress}>
                 <Ionicons name="stats-chart" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder=""
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {/* List */}
            <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
              {categories.map((cat) => (
                <View key={cat.id} style={styles.listItem}>
                  <View style={styles.leftSection}>
                    <View style={styles.percentIconCircle}>
                      <Text style={styles.percentIconText}>%</Text>
                    </View>
                    <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
                  </View>
                  <View style={styles.actionsBox}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => { onSelectCategory(cat.name); onClose(); }}>
                      <Ionicons name="square-outline" size={24} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => { onEditCategory(cat); onClose(); }}>
                      <Ionicons name="pencil" size={18} color="#A855F7" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Ionicons name="trash" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Overlay closing hit area is handled by closeHandleHorizontal outside this view */}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  keyboardView: {
    flex: 1,
    flexDirection: 'row',
  },
  closeHandleHorizontal: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: width * 0.7,
    height: '100%',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  analyticsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A855F7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  percentIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#9ca3af',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  percentIconText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryName: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
    flexShrink: 1,
    marginLeft: 4,
  },
  actionsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionBtn: {
    padding: 4,
  }
});
