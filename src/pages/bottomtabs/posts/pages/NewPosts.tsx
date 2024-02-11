import { View, Text, ActivityIndicator, RefreshControl } from "react-native";
import React, { useCallback } from "react";
import Box from "../../../../components/general/Box";
import Searchbar from "../../../../components/Searchbar";
import { useUtilState } from "../../../../states/util";
import FilterTopbar, {
  FILTER_BAR_ENUM,
} from "../../../../components/feeds/FilterTopbar";
import PostCard from "../../../../components/feeds/PostCard";
import { IPost } from "../../../../models/post";
import { useQuery, useMutation, useQueryClient } from "react-query";
import httpService from "../../../../utils/httpService";
import CustomText from "../../../../components/general/CustomText";
import { URLS } from "../../../../services/urls";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../../theme";
import { useModalState } from "../../../../states/modalState";
import { POST_FILTERR } from "../../../../enums/Postfilters";
import AnnouncementBox from "../../../../components/announcements/announcementBox";
import useToast from "../../../../hooks/useToast";
import _, { uniqBy } from "lodash";
import { FlatList } from "react-native-gesture-handler";
import { CUSTOM_STATUS_CODE } from "../../../../enums/CustomCodes";
import FeedCard from "../../../../components/feeds/FeedCard";
import { useDeletePostState } from "../../../../states/deleteedPost";
import { PaginatedResponse } from "../../../../models/PaginatedResponse";
import { IRecommendedCommunities } from "../../../../models/RecommendCommunity";
import { IRecommendedPeople } from "../../../../models/RecommendedPeople";
import RecommendedUsersCard from "../../../../components/post/RecommendedUsersCard";
import { PaginatedResponse2 } from "../../../../models/PaginatedResponse2";
import RecommendedCommunityCard from "../../../../components/post/RecommendedCommunity";

const NewPost = ({
  activeTab,
  onActive,
}: {
  activeTab: FILTER_BAR_ENUM;
  onActive: (data: FILTER_BAR_ENUM) => void;
}) => {
  const { isLoggedIn, isDarkMode } = useUtilState((state) => state);
  const { setAll, filterBy } = useModalState((state) => state);
  const theme = useTheme<Theme>();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = React.useState(false);
  const { ids: DeletedIds } = useDeletePostState((state) => state);
  const toast = useToast();

  // states
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [ids, setIds] = React.useState<number[]>([]);
  const [perPage, setPerPage] = React.useState(0);
  const [noMore, setNoMore] = React.useState(false);

  // suggestions
  const [previousIndex, setPreviousIndex] = React.useState(0);

  // recommended people states
  const [recommendedPeople, setRecommendedPeople] = React.useState<
    IRecommendedPeople[]
  >([]);
  const [peoplePage, setPeoplePage] = React.useState(1);
  const [peopleTotal, setTotalPeople] = React.useState(0);

  // recommended communities
  const [recommendedCommunities, setRecommendedCommunities] = React.useState<
    IRecommendedCommunities[]
  >([]);
  const [communityPage, setCommunityPage] = React.useState<number | null>(1);
  const [totalCommuntiies, setTotalCommunities] = React.useState<number | null>(
    0,
  );

  React.useEffect(() => {
    setPosts(posts.filter((item) => DeletedIds.indexOf(item.id) === -1));
  }, [DeletedIds]);

  // recommendation queries
  const getRecommendedPeople = useQuery(
    ["getRecommendedPeople", peoplePage],
    () =>
      httpService.get(`${URLS.RECOMMENDED_PEOPLE}`, {
        params: {
          page: peoplePage,
        },
      }),
    {
      onSuccess: (data) => {
        const item: PaginatedResponse2<IRecommendedPeople> = data.data;
        if (recommendedPeople?.length < 1) {
          setTotalPeople(item.meta.total);
          setRecommendedPeople(item.data);
        } else {
          const newData = uniqBy([...recommendedPeople, ...item.data], "id");
          setRecommendedPeople(newData);
          setTotalPeople(item.meta.total);
        }
      },
      onError: (error: any) => {
        console.log(error);
      },
    },
  );

  const getRecommendedCommunities = useQuery(
    ["getRecommendedCommunities", communityPage],
    () =>
      httpService.get(`${URLS.RECOMMENDED_COMMUNITY}`, {
        params: {
          page: communityPage,
        },
      }),
    {
      onSuccess: (data) => {
        const item: PaginatedResponse2<IRecommendedCommunities> = data.data;
        if (recommendedCommunities.length < 1) {
          setRecommendedCommunities(item.data);
          setTotalCommunities(item.meta.total);
        } else {
          setRecommendedCommunities((prev) => [...prev, ...item.data]);
          setTotalCommunities(item.meta.total);
        }
      },
    },
  );

  // muatation
  const paginatedMutation = useMutation({
    mutationFn: () =>
      httpService.get(`${URLS.GET_POST}`, {
        params: {
          page: currentPage,
        },
      }),
    onSuccess: (data) => {
      if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
        if (posts.length > 0) {
          if (data.data?.data !== undefined) {
            const uniqArr = _.uniqBy<IPost>(
              [...posts, ...data.data?.data?.data],
              "id",
            );
            setPosts(uniqArr);
            const postData: IPost[] = data.data?.data?.data as IPost[];
            const postids = postData.map((item) => item.id);
            setIds(postids);
          } else {
            setNoMore(true);
            //toast.show(data.data?.message, { type: 'success'});
          }
        } else {
          setPosts(data.data.data.data);
          setTotal(data.data.data.total);
          const postData: IPost[] = data.data.data.data as IPost[];
          const postids = postData.map((item) => item.id);
          setIds(postids);
          setPerPage(data.data.data.per_page);
        }
      }
    },
    onError: (error: any) => {
      toast.show(error.message, { type: "error" });
    },
  });

  // react query
  const { isLoading, isError, error, refetch } = useQuery(
    ["GetNewPosts"],
    () =>
      httpService.get(`${URLS.GET_POST}`, {
        params: {
          page: 1,
        },
      }),
    {
      onSuccess: async (data) => {
        if (data.data.code === CUSTOM_STATUS_CODE.INTERNAL_SERVER_ERROR) {
          toast.show(data.data?.message, { type: "warning", placement: "top" });
        }
        if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
          if (posts.length > 0) {
            if (data.data?.data !== undefined) {
              const uniqArr = _.uniqBy<IPost>(
                [...data.data?.data?.data, ...posts],
                "id",
              );
              setPosts(uniqArr);
            } else {
              setNoMore(true);
              //toast.show(data.data?.message, { type: 'success'});
            }
          } else {
            setPosts(data.data.data.data);
            setTotal(data.data.data.total);
            const postData: IPost[] = data.data.data.data as IPost[];
            const postids = postData.map((item) => item.id);
            setIds(postids);
            setPerPage(data.data.data.per_page);
          }
        }
      },
      onError: (error: any) => {
        toast.show(error.message, { type: "error" });
      },
    },
  );

  // mutations
  const markasViewed = useMutation({
    mutationFn: (data: { posts_id: number[] }) =>
      httpService.post(`${URLS.INCREMENT_POST_VIEWS}`, data),
    onError: (error: any) => {
      toast.show(error.message, { type: "error" });
    },
    onSuccess: (data) => {},
  });

  // functions
  const onEndReached = React.useCallback(async () => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = Math.min(startIndex + perPage - 1, total - 1);
    if (
      currentPage < endIndex &&
      posts.length > 0 &&
      noMore === false &&
      !isLoading
    ) {
      // markasViewed.mutate({ posts_id: ids });
      setCurrentPage((prev) => prev + 1);
      paginatedMutation.mutate();
    }
  }, [currentPage, ids, perPage, total, noMore, isLoading]);

  const handleRefresh = () => {
    if (!isLoading) {
      refetch();
    }
  };

  const handleInfintiScroll = (type: 'community'|'people') => {
    if (type === 'community') {
      if (totalCommuntiies> recommendedCommunities.length) {
        setCommunityPage((prev) => prev + 1);
      }
    } else {
      if (peopleTotal > recommendedPeople.length) {
        setPeoplePage((prev) => prev + 1);
      }
    }
  }
    
  const handleRecommendation = useCallback(
    (index: number) => {
      return (
        <>
          <CustomText variant="subheader" fontSize={18}>
            People you may know
          </CustomText>
          {getRecommendedPeople.isLoading && recommendedPeople.length < 1 && (
            <Box
              width={"100%"}
              height={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <ActivityIndicator
                size={"small"}
                color={theme.colors.primaryColor}
              />
            </Box>
          )}
          {!getRecommendedPeople.isLoading &&
            recommendedPeople?.length === 0 && (
              <Box
                width={"100%"}
                height={"100%"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <CustomText>No recommendation</CustomText>
              </Box>
            )}
          {!getRecommendedPeople.isLoading && getRecommendedPeople.isError && (
            <Box
              width={"100%"}
              height={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <CustomText>An Error occured</CustomText>
            </Box>
          )}
          {!getRecommendedPeople.isLoading && recommendedPeople?.length > 0 && (
            <>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ marginTop: 20 }}
                data={recommendedPeople}
                extraData={recommendedPeople}
                onEndReached={() => handleInfintiScroll('people')}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => {
                  return (
                   <>
                      {
                      peopleTotal === recommendedPeople.length && (
                        <Box width={220} height={'100%'} justifyContent="center" alignItems="center">
                          <CustomText>Thats all for now</CustomText>
                        </Box>
                      )
                      }
                      {getRecommendedPeople.isLoading && (
                        <Box width={220} height={'100%'} justifyContent="center" alignItems="center">
                          <ActivityIndicator size={"small"} color={theme.colors.primaryColor} />
                        </Box>
                      )}
                   </>
                  )
                }}
                renderItem={({ index, item }) => (
                  <>
                    <Box
                      width={220}
                      padding="s"
                      marginRight="m"
                      borderRadius={10}
                      bg="mainBackGroundColor"
                    >
                      <RecommendedUsersCard
                        user={item}
                        index={index}
                        removedUser={(index) => {
                          const newPeople = recommendedPeople.filter((_, indx) => index !== indx);
                          setRecommendedPeople(newPeople);
                        }}
                      />
                    </Box>
                    
                  </>
                )}
              />
            </>
          )}
        </>
      );
    },
    [recommendedPeople, getRecommendedPeople],
  );

  const handleRecommendCommunities = React.useCallback(() => {
    return (
      <>
        {getRecommendedCommunities.isLoading && (
          <Box
            width={"100%"}
            height={20}
            backgroundColor="secondaryBackGroundColor"
            padding="m"
            style={{ marginBottom: 15 }}
          >
            <Box
              width={"100%"}
              height={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <ActivityIndicator
                size={"small"}
                color={theme.colors.primaryColor}
              />
            </Box>
          </Box>
        )}
        {
          !getRecommendedCommunities.isLoading && <></>
        }
        {!getRecommendedCommunities.isLoading &&
          recommendedCommunities?.length === 0 && <></>}
        {!getRecommendedCommunities.isLoading &&
          getRecommendedCommunities.isError && (
            <Box
              width={"100%"}
              height={20}
              backgroundColor="secondaryBackGroundColor"
              padding="m"
              style={{ marginBottom: 15 }}
            >
              <CustomText variant="subheader" fontSize={18}>
                Recommended Communities
              </CustomText>
              <Box
                width={"100%"}
                height={"100%"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <CustomText>An Error occured</CustomText>
              </Box>
            </Box>
          )}
        {!getRecommendedCommunities.isLoading &&
          recommendedCommunities?.length > 0 && (
            <Box
              width={"100%"}
              height={20}
              backgroundColor="secondaryBackGroundColor"
              padding="m"
              style={{ marginBottom: 15 }}
            >
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ marginTop: 20 }}
                data={recommendedCommunities}
                extraData={recommendedCommunities}
                onEndReached={() => handleInfintiScroll('community')}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => (
                  <>
                    {
                      totalCommuntiies === recommendedCommunities.length && (
                        <Box width={220} height={'100%'} justifyContent="center" alignItems="center">
                          <CustomText>Thats all for now</CustomText>
                        </Box>
                      )
                    }
                    {getRecommendedCommunities.isLoading && (
                      <Box width={220} height={'100%'} justifyContent="center" alignItems="center">
                        <ActivityIndicator size={"small"} color={theme.colors.primaryColor} />
                      </Box>
                    )}
                  </>
                )}
                renderItem={({ index, item }) => (
                  <Box
                    width={220}
                    padding="s"
                    marginRight="m"
                    borderRadius={10}
                    bg="mainBackGroundColor"
                  >
                    <RecommendedCommunityCard
                      community={item}
                      index={index}
                      removedCommunity={(indx) => {
                        const newRec = recommendedPeople.filter((_, index) => index !== indx);
                        setRecommendedPeople(newRec);
                      }}
                    />
                  </Box>
                )}
              />
            </Box>
          )}
      </>
    );
  }, [getRecommendedCommunities]);

  return (
    <Box
      backgroundColor={
        isDarkMode ? "mainBackGroundColor" : "secondaryBackGroundColor"
      }
      flex={1}
    >
      {
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isLoading && posts.length > 0}
              onRefresh={handleRefresh}
              progressViewOffset={50}
              progressBackgroundColor={theme.colors.primaryColor}
              colors={["white"]}
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={1}
          ListEmptyComponent={() => (
            <>
              {!isLoading && posts.length < 1 && (
                <CustomText variant="body" textAlign="center" marginTop="s">
                  No Post to view
                </CustomText>
              )}
            </>
          )}
          ListHeaderComponent={() => (
            <Box
              bg={
                isDarkMode ? "mainBackGroundColor" : "secondaryBackGroundColor"
              }
              style={{ marginBottom: 15 }}
            >
              {isLoggedIn && <Searchbar />}
              <Box height={15} />
              <FilterTopbar
                activeTab={activeTab}
                onActive={(data) => onActive(data)}
              />
            </Box>
          )}
          // estimatedItemSize={1000}
          keyExtractor={(item, index) => item.id.toString()}
          extraData={DeletedIds}
          renderItem={({ item, index }) => {
            if (index % 12 === 0) {
              return (
                <>
                  <FeedCard post={item} showReactions />
                  <Box
                    width={"100%"}
                    height={200}
                    bg="secondaryBackGroundColor"
                    padding="m"
                    style={{ marginBottom: 15 }}
                  >
                    {handleRecommendation(index)}
                  </Box>
                </>
              );
            } else if (index % 7 === 0) {
              return (
                <>
                  <FeedCard post={item} showReactions />
                  {handleRecommendCommunities()}
                </>
              );
            } else {
              return <FeedCard post={item} showReactions />;
            }
          }}
          data={posts}
          ListFooterComponent={() => (
            <Box width="100%" alignItems="center" marginVertical="m">
              {isLoading && (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primaryColor}
                />
              )}
              {paginatedMutation.isLoading && (
                <ActivityIndicator
                  size="small"
                  color={theme.colors.primaryColor}
                />
              )}
              {!paginatedMutation.isLoading && noMore && (
                <CustomText textAlign="center">Thats all for now</CustomText>
              )}
            </Box>
          )}
        />
      }
    </Box>
  );
};

export default NewPost;
