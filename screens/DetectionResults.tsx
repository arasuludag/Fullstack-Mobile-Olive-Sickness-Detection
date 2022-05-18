import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";

import ModalWindow from "./ModalWindow";

export default function DetectionResults() {
  const [image, setImage] = useState();
  const [boxCoordinates, setBoxCoordinates] = useState([]);

  interface Image {
    cancelled: boolean;
    height: number;
    width: number;
    uri: string;
  }

  function sendPhoto(takenImage: Image) {
    const file = {
      uri: takenImage.uri, // e.g. 'file:///path/to/file/image123.jpg'
      name: takenImage.uri,
      type: "image/jpg", // e.g. 'image/jpg'
    };

    const body = new FormData();
    // @ts-ignore: Unreachable code error
    body.append("file", file);

    axios
      .post("http://10.0.0.3:8000/object-to-json", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        // @ts-ignore: Unreachable code error
        setImage(takenImage.uri);

        setBoxCoordinates(response.data.result);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function pickPhoto() {
    // No permissions request is necessary for launching the image library
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    }).then((pickedImage) => {
      if (!pickedImage.cancelled)
        // @ts-ignore: Unreachable code error
        sendPhoto(pickedImage);
    });
  }

  function takePhoto() {
    ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [3, 4] }).then(
      (takenImage) => {
        if (!takenImage.cancelled)
          // @ts-ignore: Unreachable code error
          sendPhoto(takenImage);
      }
    );
  }

  interface Box {
    class: number;
    confidence: number;
    name: string;
    xmax: number;
    xmin: number;
    ymax: number;
    ymin: number;
  }

  function drawBoxes() {
    /* 
    "class": 0,
    "confidence": 0.7246518135,
    "name": "Knot disease",
    "xmax": 765.9591674805,
    "xmin": 696.2283325195,
    "ymax": 282.3661499023,
    "ymin": 192.2045135498,
    */

    return boxCoordinates.map((box: Box, index) => {
      let boxColor;

      switch (box.class) {
        case 0:
          boxColor = "white";
          break;

        case 1:
          boxColor = "red";
          break;

        case 2:
          boxColor = "green";
          break;

        default:
          boxColor = "yellow";
          break;
      }

      return (
        <View
          key={index}
          style={{
            height: (box.ymax - box.ymin) / 10.24 + "%",
            width: (box.xmax - box.xmin) / 7.68 + "%",
            position: "absolute",
            borderWidth: 2,
            elevation: 24,
            borderRadius: 50,
            borderColor: boxColor,
            zIndex: 99,
            top: box.ymin / 10.24 + "%",
            left: box.xmin / 7.68 + "%",
          }}
        >
          <ModalWindow
            box={box}
            buttonHeight={(box.ymax - box.ymin) / 2}
            buttonWidth={(box.xmax - box.xmin) / 2}
          />
        </View>
      );
    });
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-evenly",
      }}
    >
      <View
        style={{
          flex: 0.7,
        }}
      >
        <Image
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
          source={{ uri: image }}
        />
        {drawBoxes()}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            await takePhoto();
          }}
        >
          {/* @ts-ignore: Unreachable code error */}
          <Icon name="camera" size={40} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            await pickPhoto();
          }}
        >
          {/* @ts-ignore: Unreachable code error */}
          <Icon name="image" size={40} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 25,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  searchButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchText: {
    fontSize: 30,
    color: "white",
  },
});
