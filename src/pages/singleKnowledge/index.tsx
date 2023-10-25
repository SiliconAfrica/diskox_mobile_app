import { ScrollView, StyleSheet } from "react-native";
import Box from "../../components/general/Box";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import SettingsHeader from "../../components/settings/Header";
import { PageType } from "../login";
import CustomText from "../../components/general/CustomText";
import { useQuery } from "react-query";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { useState } from "react";
import { TKnowledge } from "../../types/MenuPageTypes";
import { formatDate } from "../../utils/dateFormatter";

export default function SingleKnowledge({ route }) {
  const navigation = useNavigation<PageType>();
  const slug = route.params.knowledgeId;
  const [knowledge, setKnowledge] = useState<Partial<TKnowledge>>({});
  const { isLoading, refetch } = useQuery(
    [`knowledge_${slug}`],
    () => httpService.get(`${URLS.FETCH_SINGLE_KNOWLEDGE_BASE}${slug}`),
    {
      onSuccess: (data) => {
        if (data.data.code === 1 && data.data.data) {
          setKnowledge({ ...data.data.data });
        }
      },
      onError: (error: any) => {
        alert(error.message);
      },
    }
  );

  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        showSave={false}
        title="Knowledge Base"
        handleArrowPressed={() => navigation.goBack()}
      />
      <ScrollView>
        <Box px="s" py="m">
          <CustomText variant="xs">
            {formatDate(knowledge.created_at)}
          </CustomText>
          <CustomText variant="body" fontFamily="RedBold" color="black">
            {knowledge.title}
          </CustomText>

          <Box style={{ width: "100%", height: 250 }} mt="l">
            <Image
              source={
                knowledge.cover_photo && knowledge.cover_photo.length > 0
                  ? `${IMAGE_BASE}${knowledge.cover_photo[0]}`
                  : require("../../../assets/images/diskoxLarge.png")
              }
              style={styles.banner}
              contentFit="fill"
              transition={1000}
            />
          </Box>
          <CustomText variant="body" color="black" mt="m">
            {knowledge.message &&
              knowledge.message.replace("<p>", "").replace("</p>", "")}
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
