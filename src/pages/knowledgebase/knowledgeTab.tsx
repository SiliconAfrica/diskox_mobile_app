import { Image } from "expo-image";
import Box from "../../components/general/Box";
import { Pressable, StyleSheet } from "react-native";
import CustomText from "../../components/general/CustomText";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../login";

import { IMAGE_BASE } from "../../utils/httpService";
import { formatDate } from "../../utils/dateFormatter";

export default function KnowledgeTab({ knowledge }) {
  const navigation = useNavigation<PageType>();

  return (
    <Box px="s" mx="s" mt="l">
      <Box style={styles.imgbox}>
        <Image
          source={
            knowledge.cover_photo.length > 0
              ? `${IMAGE_BASE}${knowledge.cover_photo[0]}`
              : require("../../../assets/images/diskoxLarge.png")
          }
          contentFit="cover"
          style={styles.img}
        />
      </Box>
      <Pressable
        onPress={() =>
          navigation.navigate("singleKnowledge", {
            knowledgeId: knowledge.slug,
          })
        }
      >
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
