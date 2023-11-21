import { View, Text, ActivityIndicator, Pressable } from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import { ScrollView } from 'react-native-gesture-handler'
import CustomText from '../../components/general/CustomText'
import { IHashTag } from '../../models/Hashtag'
import { useQuery } from 'react-query'
import httpService from '../../utils/httpService'
import { URLS } from '../../services/urls'
import { CUSTOM_STATUS_CODE } from '../../enums/CustomCodes'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import Header from '../../components/Header'
import { useNavigation } from '@react-navigation/native'
import { PageType } from '../login'

const Container = ({
    sn,
    name,
    noOfPosts
}: {
    sn: number,
    name: string,
    noOfPosts: number
}) => {
    const theme = useTheme<Theme>();
    const navigation = useNavigation<PageType>();

    return (
        <Pressable onPress={() => navigation.navigate('hashtag', { hashTag: name })} style={{ flexDirection: 'row', height: 60, marginBottom: 20, borderBottomColor: theme.colors.primaryColor, borderBottomWidth: 0.8 }} >
            <CustomText fontSize={16}>{sn}.</CustomText>
            <Box flex={1} marginLeft='s'>
                <CustomText variant='subheader' fontSize={18}>#{name}</CustomText>
                <CustomText variant='body' fontSize={16} marginTop='s'>{noOfPosts} posts</CustomText>
            </Box>
        </Pressable>
    )
}

const TrendingHashtags = () => {
    const [hashtags, setHashtag] = React.useState<IHashTag[]>([]);
    const theme = useTheme<Theme>();
    const { isLoading, isError } = useQuery(['get_trending_hashtags'], () => httpService.get(`${URLS.GET_POPULAR_HASTAGS}`), {
        onSuccess: (data) => {
          if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
              setHashtag(data.data.data);
          }
        }
      });

  return (
    <Box flex={1} bg='mainBackGroundColor'>
        <Header showMenuButton={false} />
        <Box flex={1} bg='mainBackGroundColor' padding='m'>
        <Box flex={1} bg='secondaryBackGroundColor' padding='m'>
            <ScrollView>
            <CustomText marginBottom='xl' variant='header' fontSize={24}>Trending Hashtags</CustomText>
            { isLoading && (
                <ActivityIndicator size='large' color={theme.colors.primaryColor} />
            )}
            {
                !isLoading && isError && (
                <CustomText variant="body" textAlign='center' marginTop='l'>
                    An Error occured while getting hashtags
                </CustomText>
                )
            }
            { !isLoading && hashtags.length > 0 && hashtags.map((item, index) => (
                <Container sn={index+ 1} name={item.name} noOfPosts={item.posts_count} key={index.toString()} />
            ))}
            </ScrollView>
        </Box>
        </Box>
    </Box>
  )
}

export default TrendingHashtags