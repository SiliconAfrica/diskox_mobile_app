import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import SettingsHeader from '../../components/settings/Header'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/MainNavigation'
import { IPost } from '../../models/post'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import httpService, { IMAGE_BASE } from '../../utils/httpService'
import { URLS } from '../../services/urls'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { Image } from 'expo-image'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { useDetailsState } from '../../states/userState'
import CustomText from '../../components/general/CustomText'
import { color } from 'react-native-reanimated'
import PostCard from '../../components/feeds/PostCard'

const Repost = ({ route,navigation }: NativeStackScreenProps<RootStackParamList, 'repost'>) => {
    const [post, setPost] = React.useState<IPost | null>(null)
    const { profile_image, username } = useDetailsState((state) => state);
    const [comment, setComment] = React.useState('');

    const { id } = route.params;
    const theme = useTheme<Theme>();
    const queryClient = useQueryClient();

    // queries
    const getData = useQuery([`getPostRepost${id}`, id], () => httpService.get(`${URLS.GET_SINGLE_POST}/${id}`), {
      onError: (error: any) => {
        alert(error.message);
      },
      onSuccess: (data) => {
        console.log(data.data.data);
        setPost(data.data.data);
      }
    });

    const { isLoading, mutate } = useMutation({
      mutationFn: (data: any) => httpService.post(`${URLS.REPOST}`, data),
      onSuccess: (data) => {
        alert('Success');
        setComment('');
        queryClient.invalidateQueries(['GetAllPosts']);
        queryClient.invalidateQueries(['GetAllTrendingPosts']);
      },
      onError: (error: any) => {
        alert(error.message);
      
      }
    });

  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
        <SettingsHeader showSave={false} title='Repost' handleArrowPressed={() => navigation.goBack()}  />

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}>
            {/* USER HEADER */}
            <Box flexDirection='row' justifyContent='space-between'>

            {
                    profile_image && (
                        <Image source={{ uri: `${IMAGE_BASE}${profile_image}` }} style={{ width: 40, height: 40, borderRadius: 25 }} contentFit='contain' />
                    )
                }
                {
                    !profile_image && (
                        <Box width={40} height={40} borderRadius={25} backgroundColor='fadedButtonBgColor' justifyContent='center' alignItems='center' style={{ marginLeft: 10 }}>
                            <CustomText variant='subheader' color='primaryColor' fontSize={18}>{username[0]?.toUpperCase() ?? ''}</CustomText>
                        </Box>
                    )
        }
         
                <Pressable onPress={() => mutate({ post_id: id, repost_commet:comment })} style={{ borderWidth: 2, borderColor: theme.colors.primaryColor, backgroundColor: '#F3FBF5', width: 100, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                   { !isLoading && <CustomText variant='body' color='primaryColor'>Repost</CustomText> }
                   { isLoading && <ActivityIndicator size='small' color={theme.colors.primaryColor} /> }
                </Pressable>
            </Box>
            <TextInput multiline inputMode='text' placeholder='Say something...' style={{ marginTop: 20, width: '100%', color: theme.colors.textColor, fontFamily: 'RedRegular' }} placeholderTextColor={theme.colors.textColor} value={comment} onChangeText={(e: string) => setComment(e)} />

            <Box width="100%" borderWidth={2} borderColor='secondaryBackGroundColor' borderRadius={15} marginTop='m'>
                { !getData.isLoading && post !== null && (
                    <PostCard {...post} showStats={false} />
                )}
            </Box>
        </ScrollView>

    </Box>
  )
}

export default Repost