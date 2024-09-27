import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://uhqkbcxmjnqjhwbmupzq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVocWtiY3htam5xamh3Ym11cHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0Mjg3MzgsImV4cCI6MjA0MzAwNDczOH0.meeCMyXfLWNLgmU7b0RAWQMYXwemFFZ6ZSJTe5cvLfw"
);

export default function cameraFunc() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [clothesImage, setClothesImage] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  const sendImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    console.log("arrayBuffer", arrayBuffer.byteLength);

    const fileName = `public/${Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from("ClothingImages")
      .upload(fileName, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });
    if (error) {
      console.log("error uploading image:", error);
    }
  };

  const hanldeTakePhoto = async () => {
    if (cameraRef.current) {
      const takenPhoto = await cameraRef.current.takePictureAsync({
        base64: true,
      });
      setClothesImage(takenPhoto);
    }
  };
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  if (clothesImage) {
    sendImage(clothesImage.uri);
    return (
      <View>
        <Text>Hello</Text>
        <Image
          source={{ uri: clothesImage.uri }}
          style={{ width: 400, height: 400 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
        <Button title="take photo" onPress={hanldeTakePhoto}></Button>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
