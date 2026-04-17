import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type SubAdmin = {
  id: string;
  name: string;
  email: string;
  bills: number;
};

const INITIAL_ADMINS: SubAdmin[] = [
  { id: '1', name: 'suraj', email: 'suraj1@gmail.com', bills: 0 }
];

export default function SubAdminsScreen() {
  const navigation = useNavigation();
  const [admins, setAdmins] = useState<SubAdmin[]>(INITIAL_ADMINS);
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  // Change Password Modal State
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [securePwd, setSecurePwd] = useState(true);

  const handleAddAdmin = () => {
    if (!newName.trim() || !newContact.trim() || !newPassword.trim()) {
       Alert.alert('Error', 'Please fill in all fields.');
       return;
    }
    const newAdmin: SubAdmin = {
      id: Date.now().toString(),
      name: newName,
      email: newContact,
      bills: 0
    };
    setAdmins(prev => [...prev, newAdmin]);
    setModalVisible(false);
    setNewName('');
    setNewContact('');
    setNewPassword('');
    setSecureText(true);
  };

  const handleChangePassword = () => {
    if (!newPwd.trim() || !confirmPwd.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (newPwd !== confirmPwd) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    Alert.alert('Success', 'Password has been updated successfully.');
    setPasswordModalVisible(false);
    setNewPwd('');
    setConfirmPwd('');
    setSecurePwd(true);
    setSelectedAdminId(null);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Sub Admin', `Are you sure you want to remove ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setAdmins(prev => prev.filter(a => a.id !== id)) }
    ]);
  };

  const renderAdminCard = ({ item }: { item: SubAdmin }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.adminName}>{item.name}</Text>
        <Text style={styles.adminEmail}>{item.email}</Text>
      </View>
      <View style={styles.cardRight}>
        <View style={styles.billsBox}>
          <Text style={styles.billsLabel}>No: of Bills</Text>
          <Text style={styles.billsCount}>{item.bills}</Text>
        </View>
        <View style={styles.actionsBox}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => (navigation.navigate as any)('SetPrivileges')}
          >
            <Ionicons name="pencil" size={16} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => {
              setSelectedAdminId(item.id);
              setPasswordModalVisible(true);
            }}
          >
            <Ionicons name="lock-closed" size={16} color="#888" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id, item.name)}>
            <Ionicons name="trash" size={16} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sub admins</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={admins}
        keyExtractor={item => item.id}
        renderItem={renderAdminCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Sub Admin Bottom Sheet Modal */}
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
                         placeholder="Name"
                         placeholderTextColor="#888"
                         value={newName}
                         onChangeText={setNewName}
                       />
                    </View>

                    <View style={styles.inputGroup}>
                       <Ionicons name="call-outline" size={22} color="#888" style={styles.inputIcon} />
                       <TextInput 
                         style={styles.input} 
                         placeholder="Phone Number / Email"
                         placeholderTextColor="#888"
                         value={newContact}
                         onChangeText={setNewContact}
                       />
                    </View>

                    <View style={[styles.inputGroup, { paddingRight: 10 }]}>
                       <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.inputIcon} />
                       <TextInput 
                         style={styles.input} 
                         placeholder="Password"
                         placeholderTextColor="#888"
                         secureTextEntry={secureText}
                         value={newPassword}
                         onChangeText={setNewPassword}
                       />
                       <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                         <Ionicons name={secureText ? "eye-off" : "eye"} size={22} color="#E91E63" />
                       </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.submitBtn} onPress={handleAddAdmin}>
                      <Text style={styles.submitBtnText}>Add sub admin</Text>
                    </TouchableOpacity>
                 </View>
               </KeyboardAvoidingView>
             </TouchableWithoutFeedback>
           </View>
         </TouchableWithoutFeedback>
      </Modal>

      {/* Change Password Bottom Sheet Modal */}
      <Modal visible={passwordModalVisible} transparent animationType="slide">
         <TouchableWithoutFeedback onPress={() => {
            setPasswordModalVisible(false);
            setNewPwd('');
            setConfirmPwd('');
         }}>
           <View style={styles.modalOverlay}>
             <TouchableWithoutFeedback>
               <KeyboardAvoidingView 
                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                 style={styles.modalContent}
               >
                 <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => {
                       setPasswordModalVisible(false);
                       setNewPwd('');
                       setConfirmPwd('');
                    }}>
                      <Ionicons name="close" size={24} color="#888" />
                    </TouchableOpacity>
                 </View>

                 <View style={styles.formContainer}>
                    <View style={[styles.inputGroup, { paddingRight: 10 }]}>
                       <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.inputIcon} />
                       <TextInput 
                         style={styles.input} 
                         placeholder="New Password"
                         placeholderTextColor="#888"
                         secureTextEntry={securePwd}
                         value={newPwd}
                         onChangeText={setNewPwd}
                       />
                       <TouchableOpacity onPress={() => setSecurePwd(!securePwd)}>
                         <Ionicons name={securePwd ? "eye-off" : "eye"} size={22} color="#E91E63" />
                       </TouchableOpacity>
                    </View>

                    <View style={[styles.inputGroup, { paddingRight: 10 }]}>
                       <Ionicons name="lock-closed-outline" size={22} color="#888" style={styles.inputIcon} />
                       <TextInput 
                         style={styles.input} 
                         placeholder="Confirm Password"
                         placeholderTextColor="#888"
                         secureTextEntry={securePwd}
                         value={confirmPwd}
                         onChangeText={setConfirmPwd}
                       />
                       <TouchableOpacity onPress={() => setSecurePwd(!securePwd)}>
                         <Ionicons name={securePwd ? "eye-off" : "eye"} size={22} color="#E91E63" />
                       </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.submitBtn} onPress={handleChangePassword}>
                      <Text style={styles.submitBtnText}>Change password</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardLeft: {
    flex: 1,
    paddingRight: 10,
  },
  adminName: {
    fontSize: 16,
    color: '#A855F7',
    fontWeight: '600',
    marginBottom: 4,
  },
  adminEmail: {
    fontSize: 13,
    color: '#555',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billsBox: {
    alignItems: 'center',
    marginRight: 16,
  },
  billsLabel: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  billsCount: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
  },
  actionsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    padding: 2,
  },
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
    minHeight: 400,
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
