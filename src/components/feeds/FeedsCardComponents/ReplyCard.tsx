import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native'
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
import { IReply } from '../../../models/comments'
import httpService, { IMAGE_BASE } from '../../../utils/httpService'
import moment from 'moment'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { URLS } from '../../../services/urls'
import useToast from '../../../hooks/useToast'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import ImageBox from './ImageBox'
import mime from 'mime'
import EmojiSelector from 'react-native-emoji-selector'
import { useDetailsState } from '../../../states/userState'
import { useModalState } from '../../../states/modalState'


const ReplyCard = ({
  comment: activeComment
}: {
  comment: IReply
}) => {
  const [reply, setReply] = React.useState(false);
  const [text, setText] = React.useState('');
  const [comment, setComment] = React.useState(activeComment);
  const [images, setImages] = React.useState<ImagePickerAsset[]>([]);
  const [showMenu, setShowMenu] = React.useState(false);
  const [editingMode, setEditingMode] = React.useState(false);
  const [removedImages, setRemovedImages] = React.useState<string[]>([]);
  const [editedImage, setEditedImage] = React.useState<ImagePickerAsset[]>([]);
  const [editImage, setEditImage] = React.useState<string[]>([]);
  const [editComment, setEditComment] = React.useState('');
  const [newImage, setNewImage] = React.useState<ImagePickerAsset[]>([])

  const toast = useToast();
  const queryClient = useQueryClient();
  const { id } = useDetailsState((state) => state);
  const { setAll } = useModalState((state) => state)

  // get reply
  const getReply = useQuery([`getSingleReply-${comment.id}`, comment.id], () => httpService.get(`${URLS.GET_SINGLE_REPLY}/${comment.id}`), {
    onSuccess: (data) => {
      setComment({  ...comment, reply: data.data.data.reply });
      //console.log(data.data.data);
    },
    onError: (error) => {}
  });

  //mutations

  const upvote = useMutation({
    mutationFn: () => httpService.post(`${URLS.UPVOTE_COMMENT}/${comment.id}`),
    onError: (error: any) => {
      toast.show(error?.message, { type: "error" });
    },
    onSuccess: (data) => {
      const obj: IReply = comment.has_downvoted === 1 ? {
        ...comment,
        has_upvoted: comment.has_upvoted === 0 ? 1 : 0,
        upvotes_count: comment.has_upvoted === 1 ? comment.upvotes_count - 1 : comment.upvotes_count + 1,
        has_downvoted:0
      } : {
        ...comment,
        has_upvoted: comment.has_upvoted === 0 ? 1 : 0,
        upvotes_count: comment.has_upvoted === 1 ? comment.upvotes_count - 1 : comment.upvotes_count + 1,
      }
      setComment(obj);
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
      const obj: IReply = comment.has_upvoted === 1 ? {
        ...comment,
        has_downvoted: comment.has_downvoted === 0 ? 1 : 0,
        has_upvoted: 0,
      } : {
        ...comment,
        has_downvoted: comment.has_downvoted === 0 ? 1 : 0,
      }
      setComment(obj);
      queryClient.invalidateQueries([`getComments-${comment.post_id}`]);
    },
  });

  const reacttocomment = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.REACT_TO_REPLY}`, data),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      const obj: IReply = {
        ...comment,
        has_reacted: comment.has_reacted.length > 0 ? [] : [1],
      }
      setComment(obj);
      queryClient.invalidateQueries([`getReplies-${comment.comment_id}`]);
    },
  });

  const deleteComment = useMutation({
    mutationFn: () => httpService.post(`${URLS.DELETE_COMMENT}/${comment.id}`),
    onError: (error: any) => {
      toast.show("Something went wrong while updating yoour comment", { type: "error" });
    },
    onSuccess: (data) => {
      toast.show("Comment created successfully", { type: "success" });
      queryClient.invalidateQueries([`getReplies-${comment.comment_id}`]);
      setShowMenu(false);
    },
  });

  const updateComment = useMutation({
    mutationFn: (data: FormData) => httpService.post(`${URLS.UPDATED_REPLY}/${comment.id}`, data),
    onError: (error: any) => {
      
    },
    onSuccess: (data) => {
      toast.show("Comment updated successfully", { type: "success",  });
      queryClient.invalidateQueries([`getReplies-${comment.comment_id}`]);
      queryClient.invalidateQueries([`getSingleReply-${comment.id}`]);
      setText(editComment);
      if (removedImages.length > 0)  {
        setNewImage(editedImage);
      }
      setEditingMode(false);
      setShowMenu(false);
    },
  });

  const createReply = useMutation({
    mutationFn: (data: FormData) => httpService.post(`${URLS.CREATE_REPLY}/`, data),
    onError: (error: any) => {
      toast.show("Something went wrong when trying to create your reply, try again", { type: "error",  });
    },
    onSuccess: (data) => {
      toast.show("Comment updated successfully", { type: "success",  });
      queryClient.invalidateQueries([`getReplies-${comment.comment_id}`]);
      setText(editComment);
      if (removedImages.length > 0)  {
        setNewImage(editedImage);
      }
      setEditingMode(false);
      setShowMenu(false);
    },
  });

  const handleReaction = () => {
    const formData = new FormData()
    formData.append('reply_id', comment.id.toString());
    formData.append('type', 'like');

    reacttocomment.mutate(formData);
  }

  const handleImagePicked = (image: ImagePickerAsset) => {
    if (images.length > 0) {
      toast.show('Cannot pick more than one image', { type: 'warning', placement: 'top', style: { marginTop: 30 } })
      return;
    } else {
      setImages((prevImages) => [...prevImages, image]);
    }
  }

  const handleEditImagePicked = (image: ImagePickerAsset) => {
    if (editedImage.length > 0) {
      toast.show('Cannot pick more than one image', { type: 'warning', placement: 'top', style: { marginTop: 30 } })
      return;
    } else {
      setEditedImage((prevImages) => [image]);
    }
  }

  const theme = useTheme<Theme>();

  const removeImage = (index: number) => {
    const newImages = images.filter((item, i) => i !== index);
    setImages(newImages);
  }

  // for images that are already with the coment
  const removeEditImage = (index: number) => {
    const newImages = editImage.filter((item, i) => i === index);
    setRemovedImages([...newImages]);
  }

  const removeEditedImage = (index: number) => {
    const newImages = editedImage.filter((item, i) => i !== index);
    setEditedImage([...newImages]);
  }

  const editMode = () => {
    if (editingMode) {
      setEditingMode(false);
    } else {
      setEditComment(activeComment.reply);
      setEditImage(activeComment.post_images.map((item) => item.image_path));
      setEditingMode(true);
    }
  }

  const handleEditComment = () => {
    if (updateComment.isLoading) {
      return;
    }
    const formData = new FormData();

    formData.append('reply', editComment);
    formData.append('comment_id', comment.comment_id.toString());
    if (editedImage.length > 0 ) {
      formData.append('reply_images[]', { name: editedImage[0].fileName, type: mime.getType(editedImage[0].uri), uri: editedImage[0].uri } as any);
    }
    if (removeEditImage.length > 0) {
      formData.append('removed_images[]', removeEditImage[0]);
    }

    updateComment.mutate(formData)
  }

  const handleReport = () => {
    setAll({ activeComment_id: activeComment.id, showReportComment: true });
  }
  
  return (
    <Box width='100%' borderBottomWidth={0.5} borderBottomColor='grey' marginBottom='m'>

     
      {
        !editingMode && (
          <>
            {/* HEADER AND USER DETAILS SECTION */}
            <Box flexDirection='row' justifyContent='space-between'>
              <Box flexDirection='row'>
                <Box width={32} height={32} borderRadius={17} borderWidth={1} borderColor='primaryColor' overflow='hidden'>
                  <Image source={{ uri: `${IMAGE_BASE}${comment.user?.profile_image}` }} contentFit='cover' style={{
                    width: '100%',
                    height: '100%',
                  }} />
                </Box>
                <Box flexDirection='row'>
                  <CustomText variant='subheader' fontSize={15} marginLeft='s'>{comment.user.name}</CustomText>
                  <CustomText variant='xs' color='lightGrey' marginLeft='s'>{moment(comment.created_at).startOf('hour').fromNow()}</CustomText>
                </Box>
              </Box>

              <Menu>
                <MenuTrigger>
                  <Feather name='more-vertical' size={25} color={theme.colors.textColor} />
                </MenuTrigger>
                <MenuOptions customStyles={{
                  optionsContainer: {
                    backgroundColor: theme.colors.secondaryBackGroundColor,
                    padding: 5,
                    width: 120,
                  }
                }}>
                   { id === activeComment.user.id && (
                    <MenuOption onSelect={() => editMode()}>
                      <CustomText variant='subheader' fontSize={14}>Edit Post</CustomText>
                    </MenuOption>
                  )}

                  { id === activeComment.user.id && (
                    <MenuOption onSelect={() => deleteComment.mutate()}>
                    { !deleteComment.isLoading && <CustomText variant='subheader' fontSize={14}>Delete Post</CustomText>}
                    { deleteComment.isLoading && <ActivityIndicator color={theme.colors.textColor} size={'small'} />}
                  </MenuOption>
                  )}
                  
                  {
                    id !== activeComment.user.id && (
                      <MenuOption>
                        <CustomText onPress={() => handleReport()} variant='subheader' fontSize={14}>Report Post</CustomText>
                      </MenuOption>
                    )
                  }

                  <MenuOption onSelect={() => editMode()}>
                    <CustomText variant='subheader' fontSize={14}>Edit Post</CustomText>
                  </MenuOption>

                  <MenuOption onSelect={() => deleteComment.mutate()}>
                    { !deleteComment.isLoading && <CustomText variant='subheader' fontSize={14}>Delete Post</CustomText>}
                    { deleteComment.isLoading && <ActivityIndicator color={theme.colors.textColor} size={'small'} />}
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </Box>

            <Box width={'100%'} paddingLeft='m' paddingBottom='s'>
              {/* TEXT AND IMAGE SECTION */}
              <Box width={'100%'} paddingHorizontal='m'>
                <CustomText variant='body' color='grey' fontSize={16}>{comment.reply}</CustomText>
              </Box>

              {/* generate random image of a dog */}
              {newImage.length < 1 && comment.post_images.length > 0 && (
                <Box width={'100%'} height={80} borderRadius={10}>
                  <ScrollView horizontal contentContainerStyle={{ alignItems: 'center' }}>
                    {comment.post_images.map((item, index) => (
                      <Image key={index.toString()} source={{ uri: `${IMAGE_BASE}${item.image_path}` }} contentFit='cover' style={{ width: 60, height: 60, borderRadius: 10, marginRight: 10 }} />
                    ))}
                  </ScrollView>
                </Box>
              )}

              {newImage.length >0  && (
                <Box width={'100%'} height={80} borderRadius={10}>
                  <ScrollView horizontal contentContainerStyle={{ alignItems: 'center' }}>
                    {newImage.map((item, index) => (
                      <Image key={index.toString()} source={{ uri: item.uri }} contentFit='cover' style={{ width: 60, height: 60, borderRadius: 10, marginRight: 10 }} />
                    ))}
                  </ScrollView>
                </Box>
              )}

              {/* REACTION */}
              <Box width={'100%'} height={60} flexDirection='row' marginTop='m'>
                {/* MAIN REACTION BOX */}
                <Box width={'40%'} height={32} flexDirection='row' borderRadius={20} borderWidth={0.5} borderColor='lightGrey'>

                  {/* UPVOTE */}
                  <Pressable style={{
                    width: '70%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    borderRightWidth: 0.5,
                    borderRightColor: theme.colors.lightGrey
                  }}
                    onPress={() => upvote.mutate()}
                  >
                    {upvote.isLoading && (
                      <ActivityIndicator size={'small'} color={theme.colors.primaryColor} />
                    )}
                    {!upvote.isLoading && (
                      <>
                        <Image source={comment.has_upvoted === 0 ? require('../../../../assets/images/arrows/up.png') : require('../../../../assets/images/arrows/upfilled.png')} contentFit='cover' style={{ width: 20, height: 20 }} />
                        <CustomText variant='xs' fontSize={12} marginLeft='s' color={comment.has_upvoted === 0 ? 'grey' : 'primaryColor'}>{comment.upvotes_count > 1 && comment.upvotes_count} UPVOTE</CustomText>
                      </>
                    )}

                  </Pressable>

                  {/* DOWNVOTE */}
                  <Pressable style={{
                    width: '30%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                    onPress={() => downvote.mutate()}
                  >
                    {downvote.isLoading && (
                      <ActivityIndicator size={'small'} color={theme.colors.primaryColor} />
                    )}
                    {
                      !downvote.isLoading && (
                        <Image source={comment.has_downvoted === 0 ? require('../../../../assets/images/arrows/down.png') : require('../../../../assets/images/arrows/downfilled.png')} contentFit='cover' style={{ width: 20, height: 20 }} />
                      )
                    }
                  </Pressable>

                </Box>

                {/* REACTION LIKE, COMMENT AND SHARE SECTIOON */}
                <Box flex={1} width={'100%'} height={32} paddingLeft='m' flexDirection='row' justifyContent='flex-start' alignItems='center'>

                  <Pressable onPress={() => handleReaction()} style={{ flexDirection: 'row', alignItems: 'center' }} >
                    <Heart size={25} color={comment.has_reacted.length > 0 ? theme.colors.primaryColor : theme.colors.lightGrey} variant={comment.has_reacted.length > 0 ? 'Bold' : 'Outline'} />
                    {comment.reactions_count > 0 && (
                      <CustomText variant='body' >{comment.reactions_count}</CustomText>
                    )}
                  </Pressable>

                  {/* <CustomText onPress={() => setReply(prev => !prev)} variant='body' marginLeft='m' color={reply ? 'primaryColor' : 'grey'}>Reply</CustomText> */}
                </Box>

              </Box>

              {reply && (
                <Box width='100%' minHeight={50} maxHeight={400} >
                  {/* REPLY SECTIONS */}
                  <Box flex={1}>
                    
                  </Box>
                  {images.length > 0 && (
                    <Box width='100%' height={90}>
                      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} horizontal>
                        {images.map((item, index) => (
                          <ImageBox key={index.toString()} type='LOCAL' payload={item} index={index} onRemove={removeImage} />
                        ))}
                      </ScrollView>
                    </Box>
                  )}
                  <CommentTextBox buttonText='Reply' onImagePicked={handleImagePicked} onTextChange={(e) => setText(e)} text={text} />
                </Box>
              )}
            </Box></>
        )
      }

       {/* IF EDITING MODE IS TRUE */}
      {
        editingMode && (
          <Box width='100%'>
            {editImage.length > 0 && (
              <Box width='100%' height={90}>
                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} horizontal>
                  {editImage.length > 0 && editImage.map((item, index) => (
                    <ImageBox key={index.toString()} type='FROM_URL' uri={item} index={index} onRemove={removeEditImage} />
                  ))}
                </ScrollView>
              </Box>
            )}

            {editedImage.length > 0 && (
              <Box width='100%' height={90}>
                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} horizontal>
                  {
                    editedImage.length > 0 && editedImage.map((item, index) => (
                      <ImageBox key={index.toString()} type='LOCAL' payload={item} index={index} onRemove={removeEditedImage} />
                    ))
                  }
                </ScrollView>
              </Box>
            )}

            <CommentTextBox buttonText='Submit' isLoading={updateComment.isLoading} onImagePicked={handleEditImagePicked} onTextChange={(e) => setEditComment(e)} text={editComment} onSubmit={handleEditComment} />

              <Box width='100%' height={40} justifyContent='center' alignItems='flex-end'>
                <CustomText variant='subheader' fontSize={16} onPress={() => editMode()}>Cancel</CustomText>
              </Box>
          </Box>
        )
      }


    </Box>
  )
}

export default ReplyCard