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
import RepostCard from '../../components/repost/RepostCard'
import useToast from '../../hooks/useToast'
import { useCreatePostState } from '../create-post/state'
import TagModal from '../../components/createpost/TagModal'
import FadedButton from '../../components/general/FadedButton'
import { Ionicons } from '@expo/vector-icons'
import EmojiPicker from 'rn-emoji-picker'
import { emojis } from 'rn-emoji-picker/dist/data'
import { MentionInput } from 'react-native-controlled-mentions'
import { renderSuggestions } from '../../components/createpost/WritePost'
import { useCommentMentionState } from '../../components/feeds/commentState'
import { uniq } from 'lodash'

const Repost = ({ route,navigation }: NativeStackScreenProps<RootStackParamList, 'repost'>) => {
    const [post, setPost] = React.useState<IPost | null>(null)
    const { profile_image, username } = useDetailsState((state) => state);
    const [comment, setComment] = React.useState('');
    const [showTagModal, setShowTagModal] = React.useState(false);
    const [showEmoji, setShowEmoji] = React.useState(false);
    const [recent, setRecent] = React.useState([]);
    const [userIds, setUserIds] = React.useState<number[]>([])

    // global state
    const { users, selectedUsers: selectedMentionedUsers, reset: resetMention } = useCommentMentionState((state) => state)


    const { id } = route.params;
    const theme = useTheme<Theme>();
    const queryClient = useQueryClient();
    const toast = useToast();
    const { tags, setTags, reset } = useCreatePostState((state) => state);

    React.useEffect(() => {
      return () => {
        reset();
      }
    }, [])

    // queries
    const getData = useQuery([`getPostRepost${id}`, id], () => httpService.get(`${URLS.GET_SINGLE_POST}/${id}`), {
      onError: (error: any) => {
        alert(error.message);
      },
      onSuccess: (data) => {
        setPost(data.data.data);
      }
    });

    const { isLoading, mutate } = useMutation({
      mutationFn: (data: any) => httpService.post(`${URLS.REPOST}`, data),
      onSuccess: (data) => {
        //alert('Success');
        toast.show(data.data.message, { type: 'success' });
        setComment('');
        reset();
        queryClient.invalidateQueries(['GetAllPosts']);
        queryClient.invalidateQueries(['GetAllTrendingPosts']);
        navigation.goBack();
      },
      onError: (error: any) => {
        toast.show(error.message, { type: 'error' });
      }
    });

    const handleEmojiPicked = React.useCallback((emoji: string) => {
      // Get the current cursor position
      const cursorPosition = comment.length;
    
      // Insert the emoji at the cursor position
      const updatedText = comment.slice(0, cursorPosition) + emoji + comment.slice(cursorPosition);
    
      // Update the text
      setComment(updatedText);
    }, [comment]);

    const handleSubmit = () => {
      if (comment.length < 1) {
        toast.show('you have to type a comment', { type: 'warning' });
      }
      const formData = new FormData();
      formData.append('post_id', id.toString());
    

      if (tags.length > 0) {
        tags.map((item) => {
          formData.append('tags[]', item.toString());
        } )
      }
      // getting hash tags
      const hashtags = comment.match(/#\w+/g);
      if (hashtags && hashtags.length) {
        hashtags.map((item) => {
          formData.append('hashtags[]', item);
        })
      }
      //const mentionregex = /@\[\w+/g 
      const regex = /@\[\S+]/g
      const mentionss = comment.match(regex) || [];
      mentionss.forEach((item) => {
        const newItem = item.replace('[', '').replace(']', '');
        selectedMentionedUsers.forEach((user) => {
          if (user.name.toLowerCase().includes(newItem.toLowerCase().substring(1))) {
            userIds.push(user.id)
            setUserIds((prev) => uniq([...prev, user.id]));
            return user.id;
          }
        })
      })
      const newText = comment.replace(/@\[([^\]]*)\]\(\)/g, '@$1');
      formData.append('repost_comment', newText);
      console.log(userIds);
      formData.append('mentioned_users[]', userIds as any);
     
      mutate(formData);
    }

  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
        {/* MODAL */}
        <TagModal 
          onClose={() => setShowTagModal(false)}
          open={showTagModal}
          tags={tags}
          setTags={(indx)=> setTags(indx)}
        />
        <SettingsHeader showSave={false} title='Repost' handleArrowPressed={() => navigation.goBack()}  />

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}>
            {/* USER HEADER */}
            <Box flexDirection='row' justifyContent='space-between'>

            {
                    profile_image && (
                        <Image source={{ uri: `${IMAGE_BASE}${profile_image}` }} style={{ width: 40, height: 40, borderRadius: 25 }} contentFit='cover' />
                    )
                }
                {
                    !profile_image && (
                        <Box width={40} height={40} borderRadius={25} backgroundColor='fadedButtonBgColor' justifyContent='center' alignItems='center' style={{ marginLeft: 10 }}>
                            <CustomText variant='subheader' color='primaryColor' fontSize={18}>{username[0]?.toUpperCase() ?? ''}</CustomText>
                        </Box>
                    )
        }
         
                <Pressable onPress={handleSubmit} style={{ borderWidth: 1, borderColor: theme.colors.primaryColor, backgroundColor: '#F3FBF5', width: 100, height: 32, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                   { !isLoading && <CustomText variant='body' color='primaryColor'>Repost</CustomText> }
                   { isLoading && <ActivityIndicator size='small' color={theme.colors.primaryColor} /> }
                </Pressable>
            </Box>
            <Box flex={1} >
              <MentionInput
                partTypes={[
                  {
                    trigger: '@',
                    renderSuggestions,
                    textStyle: { fontWeight: 'bold', color: theme.colors.primaryColor },
                    isInsertSpaceAfterMention: true,
                    pattern: /(@\w+)/g
                  },
                  {
                    trigger: '#',
                    textStyle: { fontWeight: 'bold', color: theme.colors.primaryColor },
                    isInsertSpaceAfterMention: true,
                    pattern: /(#\w+)/g
                  }
                ]}
                value={comment}
                onChange={(val) => setComment(val)} 
                containerStyle={{ minHeight: 80,  paddingHorizontal: 10, marginTop:20  }} style={{ fontFamily: 'RedRegular', fontSize: 14, color: theme.colors.textColor  }}
              placeholderTextColor={theme.colors.textColor} multiline placeholder={`Let's Diskox it...`} textAlignVertical='top' />
            </Box>
            {/* <TextInput multiline inputMode='text' placeholder='Say something...' style={{ marginTop: 20, width: '100%', color: theme.colors.textColor, fontFamily: 'RedRegular' }} placeholderTextColor={theme.colors.textColor} value={comment} onChangeText={(e: string) => setComment(e)} /> */}

            <Box width="100%" borderWidth={0} borderColor='secondaryBackGroundColor' borderRadius={15} marginTop='m'>
                { !getData.isLoading && post !== null && (
                    <RepostCard post={post} />
                )}
            </Box>
        </ScrollView>

        <Box width={'100%'} height={100} borderTopWidth={0.5} borderTopColor='grey' flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='m' position='relative'>

        {
            showEmoji && (
              <Box width='100%' maxHeight={300} position='absolute' zIndex={30} top={-200} bottom={80} >
                {/* <ScrollView nestedScrollEnabled contentContainerStyle={{ height: 200 }}> */}
                 <EmojiPicker
                      emojis={emojis} // emojis data source see data/emojis
                      recent={recent} // store of recently used emojis
                      autoFocus={true} // autofocus search input
                      loading={false} // spinner for if your emoji data or recent store is async
                      darkMode={true} // to be or not to be, that is the question
                      perLine={10} // # of emoji's per line
                      onSelect={(e) => handleEmojiPicked(e.emoji)} // callback when user selects emoji - returns emoji obj
                      onChangeRecent={setRecent} 
                      backgroundColor={theme.colors.secondaryBackGroundColor}// callback to update recent storage - arr of emoji objs
                      // backgroundColor={'#000'} // optional custom bg color
                      // enabledCategories={[ // optional list of enabled category keys
                      //   'recent', 
                      //   'emotion', 
                      //   'emojis', 
                      //   'activities', 
                      //   'flags', 
                      //   'food', 
                      //   'places', 
                      //   'nature'
                      // ]}
                      // defaultCategory={'food'} // optional default category key
                  />
                {/* </ScrollView> */}
              </Box>
            )
          }

          <Box flexDirection='row' alignItems='center'>
            <Ionicons name='happy-outline' size={25} color={theme.colors.textColor} style={{ marginHorizontal: 10 }} onPress={() => setShowEmoji(prev => !prev)}  />
            <FadedButton 
              onPress={() => setShowTagModal(true)}
              title='Tag'
              width={70}
              height={32}
            />
          </Box>

          {tags.length > 0 && (
            <CustomText variant='body'>
              You tagged {tags.length} {tags.length > 1 ? 'People':'Person'}
            </CustomText>
          )}

         
        </Box>

    </Box>
  )
}

export default Repost