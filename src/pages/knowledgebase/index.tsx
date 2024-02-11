import { ActivityIndicator, StyleSheet } from "react-native";
import Box from "../../components/general/Box";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { FlatList } from 'react-native-gesture-handler'
import SettingsHeader from "../../components/settings/Header";
import { PageType } from "../login";
import CustomText from "../../components/general/CustomText";
import KnowledgeTab from "./knowledgeTab";
import { useQuery } from "react-query";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { useEffect, useState } from "react";
import { TKnowledge } from "../../types/MenuPageTypes";
import useToast from "../../hooks/useToast";

export default function KnowledgeBase() {
  const navigation = useNavigation<PageType>();
  const toast = useToast();
  const [knowledgebase, setKnowledgebase] = useState<TKnowledge[]>([]);
  const [fetchMore, setFetchMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const { isLoading, isFetching, isRefetching, refetch } = useQuery(
    [`knowledge_base`],
    () => httpService.get(`${URLS.FETCH_KNOWLEDGE_BASE}?page=${page}`),
    {
      onSuccess: (data) => {
        if (
          data.data.code === 1 &&
          data.data.data &&
          Array.isArray(data.data.data)
        ) {
          setKnowledgebase([...knowledgebase, ...data.data.data]);
          setFetchMore(false);
        }
      },

      onError: (error: any) => {
        // alert(error.message);
        toast.show("No more records", {
          type: "info",
        });
      },
    }
  );
  useEffect(() => {
    if (fetchMore) {
      refetch();
    }
  }, [page]);
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        showSave={false}
        title="Knowledge Base"
        handleArrowPressed={() => navigation.goBack()}
      />
      <FlatList
        ListHeaderComponent={() => (
          <>
            <Box style={{ width: "100%", height: 200 }}>
              <Image
                source={require("../../../assets/images/announcementBanner.png")}
                style={styles.banner}
                contentFit="cover"
                transition={1000}
              />
            </Box>
            <CustomText variant="subheader" textAlign="center" py="s" mt="l">
              Diskox Knowledge Base
            </CustomText>
          </>
        )}
        contentContainerStyle={{ paddingHorizontal: 0 }}
        keyExtractor={(item, index) => item.id.toString()}
        data={knowledgebase}
        onScrollBeginDrag={() => {
          if (!isFetching && !isLoading && !isRefetching) {
            setFetchMore(true);
          }
        }}
        onEndReachedThreshold={0.3}
        onEndReached={() => {
          setPage((prev) => (prev += 1));
        }}
        ListEmptyComponent={
          !isLoading &&
          !isFetching &&
          !isRefetching && (
            <CustomText textAlign="center" style={{ paddingVertical: 100 }}>
              We will let you know when something amazing comes up.
            </CustomText>
          )
        }
        ListFooterComponent={
          (isLoading || isFetching || isRefetching) && (
            <ActivityIndicator size="large" style={{ marginTop: 10 }} />
          )
        }
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
