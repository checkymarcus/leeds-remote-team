import { router } from "expo-router";
import { Button, Image, Text, View } from "react-native";

export default function Index() {
  const switchToCamera = () => {
    router.push("/camera");
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        style={{ flex: 1, height: 100, width: 400 }}
        source={require("../assets/images/image.png")}
      ></Image>
      <Button
        title="Take a photo"
        onPress={() => {
          switchToCamera();
        }}
      />
    </View>
  );
}
