import { StyleSheet } from "react-native";
import Box from "../../components/general/Box";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { FlashList } from "@shopify/flash-list";
import SettingsHeader from "../../components/settings/Header";
import { PageType } from "../login";
import CustomText from "../../components/general/CustomText";
import KnowledgeTab from "./knowledgeTab";

export default function KnowledgeBase() {
  const navigation = useNavigation<PageType>();
  return (
    <Box flex={1}>
      <SettingsHeader
        showSave={false}
        title="Knowledge Base"
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
              Diskox Knowledge Base
            </CustomText>
          </>
        )}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={100}
        data={[0, 1]}
        ListEmptyComponent={() => (
          <CustomText textAlign="center" style={{ paddingVertical: 100 }}>
            We will let you know when something amazing comes up.
          </CustomText>
        )}
        renderItem={({ item }) => <KnowledgeTab />}
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
