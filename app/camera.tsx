import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import {
  AppRegistry,
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { postImage } from "./ximilar";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { andrewsHat } from "../ignoreme";

const supabase = createClient(
  "https://uhqkbcxmjnqjhwbmupzq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVocWtiY3htam5xamh3Ym11cHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0Mjg3MzgsImV4cCI6MjA0MzAwNDczOH0.meeCMyXfLWNLgmU7b0RAWQMYXwemFFZ6ZSJTe5cvLfw"
);

export default function cameraFunc() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [clothesImage, setClothesImage] = useState(null);
  const [responseJson, setResponseJson] = useState(null);
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

    // postImage(
    //   "https://api.ximilar.com/tagging/fashion/v2/top_categories",
    //   clothesImage
    // );

    //   axios
    //     .post(
    //       "https://api.ximilar.com/tagging/fashion/v2/detect_tags_all",
    //       {
    //         records: [
    //           {
    //             _base64: clothesImage.base64, // Use "_base64" to send the image in base64 format
    //           },
    //         ],
    //       },
    //       {
    //         headers: {
    //           Authorization: "Token fa62910f8e5841247fb5e78d409d38d0cc1fef46",
    //           "Content-Type": "application/json", // Ensure JSON format for the request body
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       console.log(response.data.records[0]._objects);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });

    //   return (
    //     <View>
    //       <Text>Hello</Text>
    //       <Image
    //         source={{ uri: clothesImage.uri }}
    //         style={{ width: 400, height: 400 }}
    //       />
    //     </View>
    //   );
    // }

    const googleFunction = async () => {
      // // Replace 'YOUR_GOOGLE_CLOUD_VISION_API_KEY' with your actual API key
      // try {
      //   const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=gAIzaSyBs_zdUtQdLB029cNKDOMnFE1nt9sN_57U`;

      //   // Read the image file from local URI and convert it to base64
      //   const requestData = {
      //     requests: [
      //       {
      //         image: {
      //           content: clothesImage.base64.NO_WRAP,
      //         },
      //         features: [{ type: "LABEL_DETECTION", maxResults: 5 }],
      //       },
      //     ],
      //   };

      //   const apiResponse = await axios.post(apiUrl, requestData);
      //   console.log(apiResponse.data.responses[0].labelAnnotations);
      // } catch (error) {
      //   console.error("Error analyzing image:", error);
      //   alert("Error analyzing image. Please try again later.");
      // }
      const fileManager = new GoogleAIFileManager(process.env.andrewsHat);

      const uploadResult = await fileManager.uploadFile(
        `https://uhqkbcxmjnqjhwbmupzq.supabase.co/storage/v1/object/public/ClothingImages/public/1727447675611.jpg`,
        {
          mimeType: "image/jpeg",
          displayName: "Jetpack drawing",
        }
      );
      // View the response.
      console.log(
        `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
      );

      const genAI = new GoogleGenerativeAI(process.env.andrewsHat);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([
        "Tell me about this image.",
        {
          fileData: {
            fileUri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType,
          },
        },
      ]);
      console.log(result.response.text());
    };
    googleFunction();

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

  //   axios
  //     .post(
  //       "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBs_zdUtQdLB029cNKDOMnFE1nt9sN_57U",
  //       {
  //         records: [
  //           {
  //             _base64: clothesImage.base64, // Use "_base64" to send the image in base64 format
  //           },
  //         ],
  //       },
  //       {
  //         headers: {
  //           // Authorization: "Token fa62910f8e5841247fb5e78d409d38d0cc1fef46",
  //           "Content-Type": "application/json", // Ensure JSON format for the request body
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });

  //   return (
  //     <View>
  //       <Text>Hello</Text>
  //       <Image
  //         source={{ uri: clothesImage.uri }}
  //         style={{ width: 400, height: 400 }}
  //       />
  //     </View>
  //   );

  //"AIzaSyBs_zdUtQdLB029cNKDOMnFE1nt9sN_57U"

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
