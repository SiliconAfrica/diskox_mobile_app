import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React from 'react'
import Box from '../../general/Box'
import { TextInput } from 'react-native-gesture-handler'
import CustomButton from '../../general/CustomButton'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme'
import { Ionicons } from '@expo/vector-icons'
import { ImagePickerAsset, launchImageLibraryAsync, MediaTypeOptions, UIImagePickerPresentationStyle } from 'expo-image-picker'
import { Image } from 'expo-image'
import ImageBox from './ImageBox'
import CommentTextBox from './CommentTextBox'
import CommentCard from './CommentCard'
import { useQuery } from 'react-query'
import httpService from '../../../utils/httpService'
import { URLS } from '../../../services/urls'
import useToast from '../../../hooks/useToast'
import { IComment } from '../../../models/comments'
import CustomText from '../../general/CustomText'

const arr = [1,2,3,4,5,6,7,3];

const CommentSection = ({
    postId
}: {
    postId?: number
}) => {
    const theme = useTheme<Theme>();
    const [images, setImages] = React.useState<ImagePickerAsset[]>([]);
    const [text, setText] = React.useState('');
    const [comments, setComments] = React.useState<Array<IComment>>([]);


    const toast = useToast();

    //queries
    const { isLoading } = useQuery(
        [`getComments-${postId}`, postId],
        () => httpService.get(`${URLS.GET_COMMENTS_BY_POST_ID}/${postId}`),
        {
          onError: (error) => {
            toast.show("An eror occured while getting the comments", {
              type: "error",
            });
          },
          onSuccess: (data) => {
            setComments(data.data.data.data);
          },
        }
      );

    const pickImage = async () => {
        const res = await launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: MediaTypeOptions.Images,
            quality: 1,
            selectionLimit: 5,
            presentationStyle: UIImagePickerPresentationStyle.POPOVER,
        });

        if (!res.canceled) {
            console.log(res.assets);
            setImages(prev => [...prev, ...res.assets]);
        }
    }

    const removeImage = (index: number) => {
        const newImages = images.filter((item, i) => i !== index);
        setImages(newImages);
    }
  return (
    <Box width='100%' minHeight={50} bg='mainBackGroundColor' position='relative'>

        <Box flex={1} maxHeight={300} paddingTop='s' borderTopWidth={0.5} borderTopColor='lightGrey' marginHorizontal='m'>
            {
                isLoading && (
                    <Box width={'100%'} height={'100%'} justifyContent='center' alignItems='center'>
                        <ActivityIndicator size={'large'} color={theme.colors.primaryColor} />
                    </Box>
                )
            }
           { !isLoading && comments.length > 0 && (
                <ScrollView nestedScrollEnabled>
                    { comments.map((item, index) => (
                        <CommentCard key={index.toString()} comment={item} />
                    ))}
                </ScrollView>
           )}
           {
            !isLoading && comments.length < 1 && (
                <Box width={'100%'} height={50} justifyContent={'center'} alignItems={'center'}>
                    <CustomText>No comment. Be the first to comment on this post</CustomText>
                </Box>
            )
           }
        </Box>

        <Box width='100%' minHeight={90}  bg='mainBackGroundColor'  overflow='visible' elevation={4} borderTopWidth={0.3} borderTopColor='lightGrey' paddingVertical='s' paddingHorizontal='m'>
           { images.length > 0 && (
             <Box width='100%' height={90}>
                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center'}} horizontal>
                    {images.map((item, index) => (
                       <ImageBox payload={item} index={index} onRemove={removeImage} />
                    ))}
                </ScrollView>
            </Box>
           )}
            <CommentTextBox text={text} onTextChange={(e) => setText(e)} onImagePicked={(item) => setImages(prev => [...prev, item])} />
        </Box>

    </Box>
  )
}

export default CommentSection