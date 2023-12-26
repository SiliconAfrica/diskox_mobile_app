import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";
import React from "react";
import Box from "../../../components/general/Box";
import CustomText from "../../../components/general/CustomText";
import StatsCard from "../../../components/profile/StatsCard";
import { IPost } from "../../../models/post";
import { useQuery } from "react-query";
import httpService from "../../../utils/httpService";
import { URLS } from "../../../services/urls";
import PostCard from "../../../components/feeds/PostCard";
import { ScrollView } from "react-native-gesture-handler";
import { IanalysisPayload } from "../../../models/analysisPayload";
import FeedCard from "../../../components/feeds/FeedCard";
import {} from "@expo/vector-icons";
import { PaginatedResponse } from "../../../models/PaginatedResponse";
import { uniqBy } from "lodash";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../theme";
import { useUtilState } from "../../../states/util";
import { useDetailsState } from "../../../states/userState";

interface IProps {
  id: number;
}

const Overview = ({ id }: IProps) => {
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [nomore, setNomore] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<IanalysisPayload | null>(null);

  const theme = useTheme<Theme>();
  const { isDarkMode }= useUtilState((state) => state);
  const { id: myID } = useDetailsState((state) => state)

  const getPosts = useQuery(
    ["getProfileOverview", id, currentPage],
    () =>
      httpService.get(`${URLS.GET_PROFILE_OVERVIEW_POSTS}/${id}`, {
        params: {
          page: currentPage,
        },
      }),
    {
      onError: (error: any) => {
        alert(error.message);
      },
      onSuccess: (data) => {
        const item: PaginatedResponse<IPost> = data.data;

        if (item.data) {
          if (posts.length > 0) {
            setPosts(uniqBy([...posts, ...item.data.data], "id"));
            setTotal(item.data.total);
          } else {
            setPosts(uniqBy(item.data.data, "id"));
            setTotal(item.data.total);
            setNomore(item.data.data.length < item.data.total ? false : true);
          }
        } else {
          setPosts([]);
        }
      },
    },
  );

  const getAnalysis = useQuery(
    ["getProfileAnalysis", id],
    () => httpService.get(`${URLS.GET_ANALYSIS}`),
    {
      onError: (error: any) => {
        alert(error.message);
      },
      onSuccess: (data) => {
        if (data.data.data) {
          setAnalysis(data?.data?.data);
        } else {
        }
      },
    },
  );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;

    if (
      layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    ) {
      // Load more data when user reaches the end
      if (!getPosts.isLoading && posts.length < total) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  return (
    <Box flex={1} bg={isDarkMode ?"mainBackGroundColor":'secondaryBackGroundColor'}>

      <ScrollView onScroll={handleScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: 50 }}>
        <Box padding="m">
         { id === myID && (
          <>
             <CustomText variant="subheader" fontSize={20}>
                User overview
              </CustomText>
              <CustomText variant="body" fontSize={14} mt="s">
                Monitor your performance at a glance or get deeper insights by
                clicking into your analytics below.
              </CustomText>
          </>
         )}

          { id === myID && (
            <Box
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
            mt="m"
          >
            <StatsCard
              title="Post Views"
              amount={analysis?.total_views || 0}
              mainColor="#9747FF"
              iconBg="#F6F0FF"
              iconName="stats-chart-outline"
            />
            <StatsCard
              title="Upvotes"
              amount={analysis?.total_upvotes || 0}
              iconName="arrow-up-outline"
              mainColor="#39A2AE"
              iconBg="#EBF7FF"
            />
            <StatsCard
              title="Downvotes"
              amount={analysis?.total_downvotes || 0}
              mainColor="#34A853"
              iconBg="#F6F0FF"
              iconName="arrow-down-outline"
            />
            <StatsCard
              title="Posts"
              amount={analysis?.total_posts}
              iconName="reader-outline"
              mainColor="#34A853"
              iconBg="#EFFAF2"
            />
            <StatsCard
              title="Comments"
              amount={analysis?.total_comments}
              iconName="chatbox-ellipses-outline"
              mainColor="#EE580D"
              iconBg="#FEF2EC"
            />
            <StatsCard
              title="Reaction"
              amount={analysis?.total_reactions}
              iconName="heart-outline"
              mainColor="#FACC07"
              iconBg="#FFFBEB"
            />
          </Box>
          )}

        </Box>

        {!getPosts.isLoading && posts.length < 1 && (
          <Box
            justifyContent="center"
            alignItems="center"
            height={20}
            paddingTop="s"
          >
            <CustomText variant="subheader" color="primaryColor">
              No Post
            </CustomText>
          </Box>
        )}

        {posts.length > 0 && (
          <>
            {posts.map((post) => (
              <FeedCard key={post.id} post={post} showReactions />
            ))}
          </>
        )}

        {getPosts.isLoading && (
          <Box justifyContent="center" alignItems="center" height={20}>
            <ActivityIndicator size="small" color={theme.colors.primaryColor} />
          </Box>
        )}
      </ScrollView>
    </Box>
  );
};

export default Overview;
