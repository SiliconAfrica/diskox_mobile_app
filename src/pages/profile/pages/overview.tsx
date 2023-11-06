import { View, Text, ActivityIndicator } from "react-native";
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

interface IProps {
  id: number;
}

const Overview = ({ id }: IProps) => {
  const [posts, setPosts] = React.useState<IPost[]>([]);
  const [analysis, setAnalysis] = React.useState<IanalysisPayload | null>(null);
  const getPosts = useQuery(
    ["getProfileOverview", id],
    () => httpService.get(`${URLS.GET_PROFILE_OVERVIEW_POSTS}/${id}`),
    {
      onError: (error: any) => {
        alert(error.message);
      },
      onSuccess: (data) => {
        if (data.data.data) {
          setPosts(data.data.data.data);
        } else {
          setPosts([]);
        }
      },
    }
  );

  const getAnalysis = useQuery(
    ["getProfileAnalysis", id],
    () => httpService.get(`${URLS.GET_ANALYSIS}/${id}`),
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
    }
  );
  return (
    <Box flex={1} bg="secondaryBackGroundColor">
      {/* STATS SECTIONS */}

      <ScrollView>
        <Box padding="m">
          <CustomText variant="subheader" fontSize={20}>
            User overview
          </CustomText>
          <CustomText variant="body" mt="s">
            Monitor your performance at a glance or get deeper insights by
            clicking into your analytics below.
          </CustomText>

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
              amount={analysis?.total_upvotes}
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
        </Box>

        {!getPosts.isLoading && posts.length < 1 && (
          <Box
            justifyContent="center"
            alignItems="center"
            height="20%"
            paddingTop="l"
          >
            <CustomText variant="subheader" color="primaryColor">
              No Post found
            </CustomText>
          </Box>
        )}

        {getPosts.isLoading && (
          <Box justifyContent="center" alignItems="center" height="20%">
            <ActivityIndicator size="large" />
          </Box>
        )}

        {!getPosts.isLoading && posts.length > 0 && (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} {...post} showStats />
            ))}
          </>
        )}
      </ScrollView>
    </Box>
  );
};

export default Overview;
