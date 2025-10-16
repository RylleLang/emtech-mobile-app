import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Button, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {
  const [goals, setGoals] = useState([
    { id: '1', value: 'Learn React Native' },
    { id: '2', value: 'Build a Modal Example' },
    { id: '3', value: 'Test on iOS and Android' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [modalProp, setModalProp] = useState('slide');

  const modalPropsTable = [
    { prop: 'animationType', description: 'Controls how the modal animates (slide, fade, none).', syntax: 'animationType="slide"' },
    { prop: 'transparent', description: 'Makes modal background transparent.', syntax: 'transparent={true}' },
    { prop: 'visible', description: 'Determines if modal is shown.', syntax: 'visible={modalVisible}' },
    { prop: 'onRequestClose', description: 'Required for Android back button / swipe dismiss.', syntax: 'onRequestClose={() => setModalVisible(false)}' },
    { prop: 'onShow', description: 'Called when modal is fully visible.', syntax: 'onShow={() => console.log("Modal shown")}' },
    { prop: 'onDismiss (iOS)', description: 'Called when modal is dismissed.', syntax: 'onDismiss={() => alert("Modal closed")}' },
    { prop: 'presentationStyle (iOS)', description: 'Controls how modal looks (fullScreen, pageSheet, formSheet)', syntax: 'presentationStyle="pageSheet"' },
    { prop: 'statusBarTranslucent (Android)', description: 'Allows modal to go under the system status bar.', syntax: 'statusBarTranslucent={true}' },
    { prop: 'supportedOrientations (iOS)', description: 'Allowed screen orientations for modal.', syntax: 'supportedOrientations={["portrait","landscape"]}' },
  ];

  const addGoalHandler = () => {
    if (newGoal.trim().length === 0) {
      Alert.alert('Invalid input', 'Please enter a goal.');
      return;
    }
    setGoals(currentGoals => [
      ...currentGoals,
      { id: Math.random().toString(), value: newGoal }
    ]);
    setNewGoal('');
  };

  const deleteGoalHandler = goalId => {
    setGoals(currentGoals => currentGoals.filter(goal => goal.id !== goalId));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Goal List</Text>
        <MaterialIcons name="person" size={28} color="white" />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="New goal"
          style={styles.input}
          onChangeText={setNewGoal}
          value={newGoal}
        />
        <Button title="Add" onPress={addGoalHandler} />
      </View>

      <FlatList
        data={goals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.value}</Text>
            <TouchableOpacity onPress={() => deleteGoalHandler(item.id)}>
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.modalButtons}>
        <Button title="Show Modal (slide)" onPress={() => { setModalProp('slide'); setModalVisible(true); }} />
        <Button title="Show Modal (fade)" onPress={() => { setModalProp('fade'); setModalVisible(true); }} />
        <Button title="Show Modal (none)" onPress={() => { setModalProp('none'); setModalVisible(true); }} />
      </View>

      <Modal
        animationType={modalProp}
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        onShow={() => console.log('Modal shown')}
        onDismiss={Platform.OS === 'ios' ? () => alert('Modal closed') : undefined}
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : undefined}
        statusBarTranslucent={Platform.OS === 'android' ? true : undefined}
        supportedOrientations={Platform.OS === 'ios' ? ['portrait', 'landscape'] : undefined}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Modal Props Table</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Prop</Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Description</Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell]}>Syntax</Text>
          </View>
          {modalPropsTable.map((row, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{row.prop}</Text>
              <Text style={styles.tableCell}>{row.description}</Text>
              <Text style={styles.tableCell}>{row.syntax}</Text>
            </View>
          ))}
          <Button title="Close Modal" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  navbar: {
    height: 56,
    backgroundColor: '#6200ee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  navbarTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    flex: 1,
    marginRight: 10,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  listItem: {
    padding: 15,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalButtons: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
  },
  tableHeaderCell: {
    fontWeight: 'bold',
  },
});
