import { StyleSheet } from "react-native";
import Box from "../../components/general/Box";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { FlashList } from "@shopify/flash-list";
import SettingsHeader from "../../components/settings/Header";
import { PageType } from "../login";
import CustomText from "../../components/general/CustomText";
import AnnouncementTab from "./announcementTab";
import httpService from "../../utils/httpService";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { URLS } from "../../services/urls";
import { IAnnouncement } from "../../types/MenuPageTypes";

export default function Announcements() {
  const navigation = useNavigation<PageType>();
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>();
  const [page, setPage] = useState<number>(1);
  const [fetchMore, setFetchMore] = useState<boolean>(false);

  const { isLoading, isFetching, isRefetching, refetch } = useQuery(
    ["knowledge_base"],
    () => httpService.get(`${URLS.FETCH_ANNOUNCEMENTS}?page=${page}`),
    {
      onSuccess: (data) => {
        if (
          data.data.code === 1 &&
          data.data.data &&
          Array.isArray(data.data.data)
        ) {
          setAnnouncements([...data.data.data]);
        }
      },
      onError: (error: any) => {
        alert(error.message);
      },
    }
  );

  useEffect(() => {
    if (fetchMore) {
      refetch();
    }
  }, [page]);
  return (
    <Box flex={1}>
      <SettingsHeader
        showSave={false}
        title="Announcement"
        handleArrowPressed={() => navigation.goBack()}
      />
      <FlashList
        ListHeaderComponent={() => (
          <>
            <Box style={{ width: "100%", height: 200 }}>
              <Image
                source={require("../../../assets/images/announcementBanner.png")}
                style={styles.banner}
                contentFit="fill"
                transition={1000}
              />
            </Box>
            <CustomText variant="subheader" textAlign="center" py="s">
              Announcement
            </CustomText>
          </>
        )}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={100}
        data={announcements}
        onScrollBeginDrag={() => {
          if (!isFetching && !isLoading && !isRefetching) {
            setFetchMore(true);
          }
        }}
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          setPage((prev) => (prev += 1));
        }}
        ListEmptyComponent={() => (
          <CustomText textAlign="center" style={{ paddingVertical: 100 }}>
            We will let you know when something amazing comes up.
          </CustomText>
        )}
        renderItem={({ item }) => <AnnouncementTab announcement={item} />}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: "100%",
  },
});
