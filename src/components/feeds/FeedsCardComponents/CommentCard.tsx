import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Box from '../../general/Box'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme'
import CustomText from '../../general/CustomText'
import { Image } from 'expo-image'
import { Feather } from '@expo/vector-icons'
import { Heart, Message } from 'iconsax-react-native'
import CommentTextBox from './CommentTextBox'
import { ImagePickerAsset } from 'expo-image-picker'
import { IComment } from '../../../models/comments'
import httpService, { IMAGE_BASE } from '../../../utils/httpService'
import moment from 'moment'
import { useMutation, useQueryClient } from 'react-query'
import { URLS } from '../../../services/urls'
import useToast from '../../../hooks/useToast'

const imagess = [
    'https://picsum.photos/id/237/200/300',
    'https://picsum.photos/id/238/200/300',
    'https://picsum.photos/id/239/200/300',
    'https://picsum.photos/id/240/200/300',
    'https://picsum.photos/id/241/200/300',
    'https://picsum.photos/id/242/200/300',
]

const CommentCard = ({
    comment: activeComment
}: {
    comment: IComment
}) => {
    const [reply, setReply] = React.useState(false);
    const [text, setText] = React.useState('');
    const [comment, setComment] = React.useState(activeComment);
    const [images, setImages] = React.useState<ImagePickerAsset[]>([]);
    const [showMenu, setShowMenu] = React.useState(false);

    const toast = useToast();
    const queryClient = useQueryClient();

    //mutations

  const upvote = useMutation({
    mutationFn: () => httpService.post(`${URLS.UPVOTE_COMMENT}/${comment.id}`),
    onError: (error: any) => {
      toast.show(error?.message, { type: "error" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([`getComments-${comment.post_id}`]);
    },
  });

  const downvote = useMutation({
    mutationFn: () =>
      httpService.post(`${URLS.DOWNVOTE_COMMENT}/${comment.id}`),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([`getComments-${comment.post_id}`]);
    },
  });

  const reacttocomment = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.REACT_TO_COMMENT}`, data),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([`getComments-${comment.post_id}`]);
    },
  });

  const deletereply = useMutation({
    mutationFn: () => httpService.post(`${URLS.DELETE_REPLY}/${comment.id}`),
    onError: (error: any) => {
      toast.show("Comment created successfully", { type: "success" });
      alert(error.message);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries([`getPost`]);
      setShowMenu(false);
    },
  });

  const handleReaction = () => {
    const formData = new FormData()
    formData.append('comment_id', comment.id.toString());
    formData.append('type', 'like');

    reacttocomment.mutate(formData);
  }

    const theme = useTheme<Theme>();
  return (
    <Box width='100%' borderBottomWidth={0.5} borderBottomColor='grey' marginBottom='m'>
        {/* HEADER AND USER DETAILS SECTION */}
        <Box flexDirection='row'>
            <Box width={32} height={32} borderRadius={17} borderWidth={1} borderColor='primaryColor' overflow='hidden'>
                <Image source={{ uri: `${IMAGE_BASE}${comment.user?.profile_image}`}} contentFit='cover' style={{
                    width: '100%',
                    height: '100%',
                }} />
            </Box>
            <Box flexDirection='row'>
                <CustomText variant='subheader' fontSize={15}  marginLeft='s'>{comment.user.name}</CustomText>
                <CustomText variant='xs' color='lightGrey' marginLeft='s'>{moment(comment.created_at).startOf('hour').fromNow()}</CustomText>
            </Box>
        </Box>

       <Box width={'100%'} paddingLeft='m' paddingBottom='s'>
            {/* TEXT AND IMAGE SECTION */}
            <Box width={'100%'} paddingHorizontal='m'>
                <CustomText variant='body' color='grey' fontSize={16}>{comment.comment}</CustomText>
            </Box>

            {/* generate random image of a dog */}
            { comment.post_images.length > 0 && (
                 <Box width={'100%'} height={100} borderRadius={10}>
                    <ScrollView horizontal contentContainerStyle={{ alignItems: 'center'}}>
                        {comment.post_images.map((item, index) => (
                            <Image source={{ uri: `${IMAGE_BASE}${item.image_path}` }} contentFit='cover' style={{ width: 60, height: 60, borderRadius: 10, marginRight: 10 }} />
                        ))}
                    </ScrollView>
                </Box>
            )}

            {/* REACTION */}
            <Box width={'100%'} height={60} flexDirection='row' marginTop='m'>
                    {/* MAIN REACTION BOX */}
                    <Box width={'40%'} height={32} flexDirection='row' borderRadius={20} borderWidth={0.5} borderColor='lightGrey'>

                        {/* UPVOTE */}
                        <Box width={'70%'} height={'100%'} justifyContent='center' alignItems='center' flexDirection='row' borderRightWidth={0.5} borderRightColor='lightGrey'>
                            <Image source={require('../../../../assets/images/arrows/up.png')} contentFit='cover' style={{ width: 20, height: 20 }} />
                            <CustomText variant='xs' fontSize={12} marginLeft='s'>{comment.upvotes_count > 1 && comment.upvotes_count} UPVOTE</CustomText>
                        </Box>

                        {/* DOWNVOTE */}
                        <Box width='30%' height={'100%'} justifyContent='center' alignItems='center'>
                            <Image source={require('../../../../assets/images/arrows/down.png')} contentFit='cover' style={{ width: 20, height: 20 }} />
                        </Box>

                    </Box>

                    {/* REACTION LIKE, COMMENT AND SHARE SECTIOON */}
                    <Box flex={1} width={'100%'} height={32} paddingLeft='m' flexDirection='row' justifyContent='flex-start' alignItems='center'>

                        <Box flexDirection='row'>
                            <Heart size={25} color={theme.colors.lightGrey} variant='Outline' />
                        </Box>

                        <CustomText onPress={() => setReply(prev => !prev)} variant='body' marginLeft='m' color={reply ? 'primaryColor':'grey'}>Reply</CustomText>
                    </Box>

                </Box>

                { reply && <CommentTextBox buttonText='Reply' onImagePicked={(image) => setImages([...images, image])} onTextChange={(e) => setText(e)} text={text} />}
       </Box>
    </Box>
  )
}

export default CommentCard