import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";

const App = (props: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{props.box.name}</Text>
            <Text style={styles.modalTextAlt}>
              Confidence: {Math.trunc(props.box.confidence * 100)}%
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[
          styles.button,
          styles.buttonOpen,
          { height: props.buttonHeight, width: props.buttonWidth },
        ]}
        onPress={() => setModalVisible(true)}
      ></Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 12,
  },
  button: {
    borderRadius: 30,
    padding: 15,
    paddingHorizontal: 20,
    elevation: 10,
  },
  buttonOpen: {
    backgroundColor: "transparent",
    padding: 0,
    elevation: 0,
    borderRadius: 0,
  },
  buttonClose: {
    backgroundColor: "#000",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTextAlt: {
    marginBottom: 20,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default App;
