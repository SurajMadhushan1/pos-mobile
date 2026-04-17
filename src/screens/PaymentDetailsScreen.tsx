import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function PaymentDetailsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#555" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Details</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subTitle}>Your Membership</Text>
        
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Account Status:</Text>
            <View style={styles.trialPill}>
              <Text style={styles.trialPillText}>Trial</Text>
            </View>
          </View>
          <Text style={styles.cardText}>Trial period / 5 days</Text>
        </View>

        {/* Decorative Background */}
         <View style={styles.emptyBgInner} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  backBtn: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginLeft: -28, // Offset the back button to achieve true center
  },
  
  content: {
    flex: 1,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    zIndex: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
    borderColor: '#EFEFEF',
    borderWidth: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 15,
    color: '#333',
    marginRight: 12,
  },
  trialPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D97706',
  },
  trialPillText: {
    color: '#D97706',
    fontSize: 15,
    fontWeight: '700',
  },
  cardText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  
  emptyBgInner: {
    position: 'absolute',
    left: -150,
    top: '30%',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: '#FAF5FF',
    zIndex: 0,
    borderRightWidth: 40,
    borderTopWidth: 40,
    borderBottomWidth: 40,
    borderColor: '#FFFAFA',
  },
});
