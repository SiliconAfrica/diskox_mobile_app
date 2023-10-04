import { ScrollView, StyleSheet } from "react-native";
import Box from "../../components/general/Box";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import SettingsHeader from "../../components/settings/Header";
import { PageType } from "../login";
import CustomText from "../../components/general/CustomText";
import { useQuery } from "react-query";
import httpService, { BASE_URL } from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { useState } from "react";
import { IAnnouncement } from "../../types/MenuPageTypes";
import { formatDate } from "../../utils/dateFormatter";

export default function SingleAnnouncement({ route }) {
  const navigation = useNavigation<PageType>();
  const slug = route.params.announcementId;
  const [announcement, setAnnouncement] = useState<IAnnouncement>();
  const { isLoading, refetch } = useQuery(
    [`announcement_${slug}`],
    () => httpService.get(`${URLS.FETCH_SINGLE_ANOUNCEMENT}${slug}`),
    {
      onSuccess: (data) => {
        if (data.data.code === 1 && data.data.data) {
          setAnnouncement({ ...data.data.data });
        }
      },
      onError: (error: any) => {
        alert(error.message);
      },
    }
  );
  return (
    <Box flex={1}>
      <SettingsHeader
        showSave={false}
        title="Announcement"
        handleArrowPressed={() => navigation.goBack()}
      />
      <ScrollView>
        <Box px="s" py="m">
          <CustomText variant="xs">
            {formatDate(announcement?.created_at)}
          </CustomText>
          <CustomText variant="body" fontFamily="RedBold" color="black">
            {announcement?.title}
          </CustomText>

          <Box style={{ width: "100%", height: 250 }} mt="l">
            <Image
              source={
                announcement && announcement.cover_photo.length > 0
                  ? `${BASE_URL.replace("/api/v1", "")}/storage/${
                      announcement.cover_photo[0]
                    }`
                  : require("../../../assets/images/diskoxLarge.png")
              }
              style={styles.banner}
              contentFit="fill"
              transition={1000}
            />
          </Box>
          <CustomText variant="body" color="black" mt="m">
            {announcement?.message}
          </CustomText>
        </Box>
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: "100%",
  },
});
