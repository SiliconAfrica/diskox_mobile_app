import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import Searchbar from '../../components/Searchbar'
import { useUtilState } from '../../states/util'
import CustomText from '../../components/general/CustomText';
import { useQuery } from 'react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigation'
import httpService, { IMAGE_BASE } from '../../utils/httpService';
import { URLS } from '../../services/urls'
import SettingsHeader from '../../components/settings/Header'
import  moment from 'moment';
import { Ionicons, Feather } from '@expo/vector-icons'
import { Image} from 'expo-image'
import { IPost } from '../../models/post'
import { Theme } from '../../theme'
import { useTheme } from '@shopify/restyle'


const Post = ({ route }: NativeStackScreenProps<RootStackParamList, 'post'>) => {
  const { postId } = route.params;
  const theme = useTheme<Theme>();
  const { isLoggedIn } = useUtilState((state) => state);
  const [post, setPost] = React.useState<IPost | null>(null)

  const {} = useQuery(['getPostById', postId], () => httpService.get(`${URLS.GET_SINGLE_POST}/${postId}`), {
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      console.log(data.data);
    }
  })
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <SettingsHeader title='Post' showSave={false} />

      <Box flex={1}>
        {/* HEADER SECTION */}
        <Box flexDirection='row' height={100} justifyContent='space-between' alignItems='center' paddingHorizontal='m'>
              <Box flexDirection='row'>
                  <Box flexDirection='row'>
                      <View style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: theme.colors.primaryColor, backgroundColor: theme.colors.secondaryBackGroundColor }} >
                          <Image source={{ uri: `${IMAGE_BASE}${post?.user.profile_image}`}} contentFit='contain' style={{ width: '100%', height: '100%' }} />
                      </View>

                      <Box marginLeft='s' justifyContent='center'>
                          <Box flexDirection='row'>
                              <CustomText variant='body' color='black'>{post?.user.name} </CustomText>
                              <CustomText variant='body' color='grey'></CustomText>
                          </Box>
                          <CustomText variant='xs'>{moment(post?.created_at).fromNow()}</CustomText>
                      </Box>
                  </Box>
              </Box>
              <Ionicons name='ellipsis-vertical' size={20} color={theme.colors.textColor} />
          </Box>

          {/* CONTENT SECTION */}
          <Box marginVertical='m'>
              <CustomText  variant='body'>{post?.description}</CustomText>

              {/* IMAGE OR VIDEO SECTION */}
          </Box>
      </Box>

      <Box width={`100%`} height={170} borderTopWidth={2} borderTopColor='secondaryBackGroundColor' paddingVertical='m' paddingHorizontal='m'>
        <TextInput placeholderTextColor={theme.colors.textColor} placeholder='Leave a comment...' style={{ ...styles.textInput, borderColor: theme.colors.secondaryBackGroundColor, color: theme.colors.textColor  }}  />

        <Box flexDirection='row' justifyContent='space-between' alignItems='center' marginTop='m'>
          <Box flexDirection='row'>
            <Feather name='smile' size={30} color={theme.colors.textColor} />
            <Feather name='image' size={30} color={theme.colors.textColor} style={{ marginLeft: 10 }} />
          </Box>
          <Pressable style={styles.button}>
            <CustomText variant='subheader' color='primaryColor'>Send</CustomText>
            <Feather name='send' size={25} color={theme.colors.primaryColor} />
          </Pressable>
        </Box>
         
            
      </Box>

    </Box>
  )
}

const styles = StyleSheet.create({
  textInput: {
    width: '100%', 
    height: 50, 
    borderRadius: 10, 
    borderWidth: 2,  
    paddingHorizontal: 10, 
  },
  button: {
    backgroundColor: '#ECF9EF',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: 'center',
  }
});

export default Post