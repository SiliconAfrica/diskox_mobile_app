import { Image } from "expo-image";
import Box from "../../components/general/Box";
import { Pressable, StyleSheet } from "react-native";
import CustomText from "../../components/general/CustomText";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../login";
import { format, getDay, getYear } from "date-fns";
import { BASE_URL } from "../../utils/httpService";

export default function KnowledgeTab({ knowledge }) {
  const navigation = useNavigation<PageType>();
  const formatDate = (dateString) => {
    return `${format(new Date(dateString), "dd MMM, yyyy")}`;
  };
  return (
    <Box px="s" mx="s">
      <Box style={styles.imgbox}>
        <Image
          source={
            knowledge.cover_photo.length > 0
              ? `${BASE_URL.replace("/api/v1", "")}/storage/${
                  knowledge.cover_photo[0]
                }`
              : require("../../../assets/images/diskoxLarge.png")
          }
          contentFit="contain"
          style={styles.img}
        />
      </Box>
      <Pressable onPress={() => navigation.navigate("singleKnowledge")}>
        <CustomText variant="body" fontFamily="RedBold" color="black">
          {knowledge.title}
        </CustomText>
        <CustomText variant="xs">{formatDate(knowledge.created_at)}</CustomText>
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
