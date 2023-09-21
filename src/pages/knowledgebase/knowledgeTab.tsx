import { Image } from "expo-image";
import Box from "../../components/general/Box";
import { Pressable, StyleSheet } from "react-native";
import CustomText from "../../components/general/CustomText";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../login";

export default function KnowledgeTab() {
  const navigation = useNavigation<PageType>();
  return (
    <Box px="s" mx="s">
      <Box style={styles.imgbox}>
        <Image
          source={require("../../../assets/images/diskoxLarge.png")}
          contentFit="contain"
          style={styles.img}
        />
      </Box>
      <Pressable onPress={() => navigation.navigate("singleKnowledge")}>
        <CustomText variant="body" fontFamily="RedBold" color="black">
          Diskox Is Now Putting Two & Two Together To Make It Four or Forever!
        </CustomText>
        <CustomText variant="xs">22 Aug, 2023</CustomText>
      </Pressable>
    </Box>
  );
}

const styles = StyleSheet.create({
  imgbox: {
    width: "100%",
    height: 200,
  },
  img: {
    width: "100%",
    height: "100%",
  },
});
