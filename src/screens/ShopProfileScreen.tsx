import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function ShopProfileScreen() {
  const navigation = useNavigation();

  // Internal component state to match graphic
  const [shopName, setShopName] = useState('sss');
  const [registerNum, setRegisterNum] = useState('111');
  const [ownerName, setOwnerName] = useState('kkk');
  const [phone, setPhone] = useState('0703034509');
  const [address, setAddress] = useState('x');
  const [dealerCode, setDealerCode] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // Focus refs
  const nameRef = useRef<TextInput>(null);
  const registerRef = useRef<TextInput>(null);
  const ownerRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const dealerRef = useRef<TextInput>(null);

  // Reusable Edit Button
  const EditButton = ({ onPress }: { onPress?: () => void }) => (
    <TouchableOpacity style={styles.editBtn} onPress={onPress}>
      <Ionicons name="pencil" size={14} color="#FFF" />
    </TouchableOpacity>
  );

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shop Profile</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Floating Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={{ width: 92, height: 92, borderRadius: 46 }} />
              ) : (
                <>
                  <Ionicons name="cart" size={32} color="#15803D" />
                  <Text style={styles.avatarText}>SHOP</Text>
                </>
              )}
            </View>
            <View style={styles.avatarEditContainer}>
               <EditButton onPress={handlePickImage} />
            </View>
          </View>

          <View style={styles.profileHeaderContent}>
            <Text style={styles.profileMainName}>{shopName}</Text>
            <Text style={styles.profileSubName}>{ownerName}</Text>
          </View>

          {/* Form Fields List */}
          <View style={styles.fieldsContainer}>
            {/* Field 1 */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldLeftIcon}>
                <Ionicons name="storefront-outline" size={24} color="#888" />
              </View>
              <View style={styles.fieldBody}>
                <Text style={styles.fieldLabel}>Shop name</Text>
                <TextInput 
                  ref={nameRef}
                  style={styles.fieldInput} 
                  value={shopName} 
                  onChangeText={setShopName}
                />
              </View>
              <EditButton onPress={() => nameRef.current?.focus()} />
            </View>

            {/* Field 2 */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldLeftIcon}>
                <Ionicons name="business-outline" size={24} color="#888" />
              </View>
              <View style={styles.fieldBody}>
                <Text style={styles.fieldLabel}>Shop Register Number</Text>
                <TextInput 
                  ref={registerRef}
                  style={styles.fieldInput} 
                  value={registerNum} 
                  onChangeText={setRegisterNum}
                />
              </View>
              <EditButton onPress={() => registerRef.current?.focus()} />
            </View>

            {/* Field 3 */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldLeftIcon}>
                <Ionicons name="person-outline" size={24} color="#888" />
              </View>
              <View style={styles.fieldBody}>
                <Text style={styles.fieldLabel}>Owner Name</Text>
                <TextInput 
                  ref={ownerRef}
                  style={styles.fieldInput} 
                  value={ownerName} 
                  onChangeText={setOwnerName}
                />
              </View>
              <EditButton onPress={() => ownerRef.current?.focus()} />
            </View>

            {/* Field 4 */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldLeftIcon}>
                <Ionicons name="call-outline" size={24} color="#888" />
              </View>
              <View style={styles.fieldBody}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <TextInput 
                  ref={phoneRef}
                  style={styles.fieldInput} 
                  value={phone} 
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
              <EditButton onPress={() => phoneRef.current?.focus()} />
            </View>

            {/* Field 5 */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldLeftIcon}>
                <Ionicons name="location-outline" size={24} color="#888" />
              </View>
              <View style={styles.fieldBody}>
                <Text style={styles.fieldLabel}>Shop Address</Text>
                <TextInput 
                  ref={addressRef}
                  style={styles.fieldInput} 
                  value={address} 
                  onChangeText={setAddress}
                />
              </View>
              <EditButton onPress={() => addressRef.current?.focus()} />
            </View>

            {/* Field 6 */}
            <View style={styles.fieldRow}>
              <View style={styles.fieldLeftIcon}>
                <Ionicons name="pricetag-outline" size={24} color="#888" />
              </View>
              <View style={styles.fieldBody}>
                <Text style={styles.fieldLabel}>Dealer Code</Text>
                <TextInput 
                  ref={dealerRef}
                  style={styles.fieldInput} 
                  value={dealerCode} 
                  onChangeText={setDealerCode}
                  placeholder="Enter dealer code"
                />
              </View>
              <EditButton onPress={() => dealerRef.current?.focus()} />
            </View>

          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionsBox}>
          <TouchableOpacity style={styles.btnCancel} onPress={() => navigation.goBack()}>
            <Text style={styles.btnCancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnSave} onPress={() => navigation.goBack()}>
            <Text style={styles.btnSaveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA', // Slight tint so the white card pops
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60, // Space for the floating avatar
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    paddingHorizontal: 20,
    paddingBottom: 30,
    position: 'relative',
    marginTop: 20, // Push card down specifically inside scrollview
  },
  avatarSection: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FDE6BA',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 4,
    borderColor: '#FFF', // White border to cut through the line smoothly
  },
  avatarText: {
    fontWeight: '900',
    fontSize: 16,
    color: '#333',
    marginLeft: 2,
  },
  avatarEditContainer: {
    position: 'absolute',
    bottom: 5,
    right: -10,
  },
  profileHeaderContent: {
    marginTop: 65, // Push text below the floating avatar
    alignItems: 'center',
    marginBottom: 30,
  },
  profileMainName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  profileSubName: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  fieldsContainer: {
    width: '100%',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  fieldLeftIcon: {
    width: 32,
    marginRight: 16,
    alignItems: 'center',
  },
  fieldBody: {
    flex: 1,
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  fieldInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    padding: 0, // Remove default android padding
  },
  editBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 16,
  },
  btnCancel: {
    flex: 1,
    height: 56,
    backgroundColor: '#000',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  btnSave: {
    flex: 1,
    height: 56,
    backgroundColor: '#9333EA',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSaveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
