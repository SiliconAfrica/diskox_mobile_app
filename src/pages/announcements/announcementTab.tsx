import { Image } from "expo-image";
import Box from "../../components/general/Box";
import { Pressable, StyleSheet } from "react-native";
import CustomText from "../../components/general/CustomText";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../login";
import { formatDate } from "../../utils/dateFormatter";
import { BASE_URL } from "../../utils/httpService";

export default function AnnouncementTab({ announcement }) {
  const navigation = useNavigation<PageType>();
  return (
    <Box px="s" mx="s">
      <Box style={styles.imgbox}>
        <Image
          source={
            announcement.cover_photo.length > 0
              ? `${BASE_URL.replace("/api/v1", "")}/storage/${
                  announcement.cover_photo[0]
                }`
              : require("../../../assets/images/diskoxLarge.png")
          }
          contentFit="contain"
          style={styles.img}
        />
      </Box>
      <Pressable
        onPress={() =>
          navigation.navigate("singleAnnouncement", {
            announcementId: announcement.slug,
          })
        }
      >
        <CustomText variant="body" fontFamily="RedBold" color="black">
          {announcement.title}
        </CustomText>
        <CustomText variant="xs">
          {formatDate(announcement.created_at)}
        </CustomText>
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
