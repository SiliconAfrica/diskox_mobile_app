import { ScrollView, StyleSheet } from "react-native";
import Box from "../../components/general/Box";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { FlashList } from "@shopify/flash-list";
import SettingsHeader from "../../components/settings/Header";
import { PageType } from "../login";
import CustomText from "../../components/general/CustomText";
import AnnouncementTab from "./announcementTab";

export default function Announcements() {
  const navigation = useNavigation<PageType>();
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
        data={[0, 1]}
        renderItem={({ item }) => <AnnouncementTab />}
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
