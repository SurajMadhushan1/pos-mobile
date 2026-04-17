import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function UserSettingsScreen() {
  const navigation = useNavigation();

  // Profile State
  const [name, setName] = useState('koriyan');
  const [email, setEmail] = useState('koriyan201@gmail.com');
  const [isEditNameModalVisible, setIsEditNameModalVisible] = useState(false);
  const [tempName, setTempName] = useState('');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    Alert.alert('Success', 'Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#888" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Top Section */}
        <View style={styles.inputGroup}>
          <TextInput 
            style={[styles.input, { color: '#000' }]} 
            value={name}
            editable={false}
          />
          <TouchableOpacity style={styles.editIconBtn} onPress={() => { setTempName(name); setIsEditNameModalVisible(true); }}>
            <Ionicons name="pencil" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <TextInput 
            style={[styles.input, { color: '#000' }]} 
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.phoneBox}>
          <Text style={styles.phoneBoxText}>Phone Number</Text>
          <View style={styles.notVerifiedBadge}>
             <Text style={styles.notVerifiedText}>Not Verified</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Password Section */}
        <Text style={styles.sectionTitle}>Change Password</Text>

        <View style={styles.pwdInputGroup}>
          <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.pwdIconLeft} />
          <TextInput 
            style={styles.pwdInput}
            placeholder="Current Password"
            placeholderTextColor="#888"
            secureTextEntry={!showCurrentPassword}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)} style={styles.pwdIconRight}>
             <Ionicons name={showCurrentPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.pwdInputGroup}>
          <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.pwdIconLeft} />
          <TextInput 
            style={styles.pwdInput}
            placeholder="New Password"
            placeholderTextColor="#888"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.pwdIconRight}>
             <Ionicons name={showNewPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.pwdInputGroup}>
          <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.pwdIconLeft} />
          <TextInput 
            style={styles.pwdInput}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.pwdIconRight}>
             <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={22} color="#000" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.changePwdBtn} onPress={handleChangePassword}>
          <Text style={styles.changePwdBtnText}>Change Password</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Name Modal */}
      <Modal visible={isEditNameModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsEditNameModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Username</Text>
                
                <TextInput
                  style={styles.modalInput}
                  value={tempName}
                  onChangeText={setTempName}
                  autoFocus
                  placeholder="Enter username"
                  placeholderTextColor="#888"
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setIsEditNameModalVisible(false)}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.modalSaveBtn} 
                    onPress={() => {
                      if (tempName.trim()) setName(tempName);
                      setIsEditNameModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalSaveText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginLeft: -24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  
  // Upper Inputs
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 24,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FFF'
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  editIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#A3A3A3',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Phone Box
  phoneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D4D4D4',
    borderRadius: 24,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  phoneBoxText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  notVerifiedBadge: {
    backgroundColor: '#FF5C77',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  notVerifiedText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Divider
  divider: {
    height: 1.5,
    backgroundColor: '#888',
    marginBottom: 32,
  },

  // Lower Section
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#000',
    marginBottom: 24,
  },
  pwdInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 24,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FFF'
  },
  pwdIconLeft: {
    marginRight: 10,
  },
  pwdInput: {
    flex: 1,
    fontSize: 16,
    color: '#000'
  },
  pwdIconRight: {
    padding: 4,
  },
  changePwdBtn: {
    backgroundColor: '#FF2B85', // Matches screenshot pink color
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  changePwdBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  
  // Modal bounds
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#CCC',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 16,
    color: '#000',
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 15,
  },
  modalSaveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FF2B85',
  },
  modalSaveText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
