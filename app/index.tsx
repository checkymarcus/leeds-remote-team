import { Image, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        style={{ height: 100, width: 400 }}
        source={require("../assets/images/image.png")}
      ></Image>
    </View>
  );
}
