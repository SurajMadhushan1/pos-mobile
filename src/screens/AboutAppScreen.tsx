import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const InfoItem = ({ title, value, isLink = false }: { title: string, value: string, isLink?: boolean }) => (
  <View style={styles.infoRow}>
    <View style={styles.iconContainer}>
       <Ionicons name="information-circle" size={32} color="#1E293B" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.infoTitle}>{title}</Text>
      {isLink ? (
        <TouchableOpacity onPress={() => Linking.openURL(value)}>
          <Text style={[styles.infoValue, styles.linkText]}>{value}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.infoValue}>{value}</Text>
      )}
    </View>
  </View>
);

export default function AboutAppScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#888" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About App</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Decorative Background Graphic */}
      <View style={styles.emptyBgInner} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <InfoItem title="App Name" value="Salli Pos" />
        <InfoItem title="App Version" value="1.0.57" />
        <InfoItem title="Admin Panel Link" value="https://invoice-admin.sallipos.com/sign-in" isLink />
        <InfoItem title="Web App Link" value="https://app.sallipos.com/login" isLink />
        <InfoItem title="Web Site Link" value="https://sallipos.lk/" isLink />
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
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 40,
    zIndex: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  iconContainer: {
    marginRight: 20,
    marginTop: -2,
    backgroundColor: '#FFF',
    borderRadius: 16,
  },
  textContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  linkText: {
    color: '#EC4899', // Pink link color
    textDecorationLine: 'underline',
  },
  
  // BG Graphic
  emptyBgInner: {
    position: 'absolute',
    left: -150,
    top: '35%',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: '#FFFAF0',
    zIndex: 0,
    borderRightWidth: 40,
    borderTopWidth: 40,
    borderBottomWidth: 40,
    borderColor: '#FAF5FF',
  },
});
