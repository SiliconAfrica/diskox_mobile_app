import { StyleSheet } from "react-native";
import Box from "../../components/general/Box";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { FlashList } from "@shopify/flash-list";
import SettingsHeader from "../../components/settings/Header";
import { PageType } from "../login";
import CustomText from "../../components/general/CustomText";
import KnowledgeTab from "./knowledgeTab";
import { useQuery } from "react-query";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { useState } from "react";

type TKnowledge = {
  id: number;
  title: string;
  slug: string;
  message: string;
  created_at: string;
  status: string;
  is_pinned: string;
  content_type: string;
  cover_photo: [string];
};
export default function KnowledgeBase() {
  const navigation = useNavigation<PageType>();
  const [knowledgebase, setKnowledgebase] = useState<TKnowledge[]>([]);

  const { isLoading, refetch } = useQuery(
    ["all_referrals"],
    () => httpService.get(`${URLS.FETCH_KNOWLEDGE_BASE}`),
    {
      onSuccess: (data) => {
        if (
          data.data.code === 1 &&
          data.data.data &&
          Array.isArray(data.data.data)
        ) {
          setKnowledgebase([...data.data.data]);
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
        data={knowledgebase}
        ListEmptyComponent={() => (
          <CustomText textAlign="center" style={{ paddingVertical: 100 }}>
            We will let you know when something amazing comes up.
          </CustomText>
        )}
        renderItem={({ item }) => <KnowledgeTab knowledge={item} />}
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
