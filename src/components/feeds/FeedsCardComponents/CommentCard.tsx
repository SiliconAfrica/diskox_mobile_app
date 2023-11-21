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

const imagess = [
    'https://picsum.photos/id/237/200/300',
    'https://picsum.photos/id/238/200/300',
    'https://picsum.photos/id/239/200/300',
    'https://picsum.photos/id/240/200/300',
    'https://picsum.photos/id/241/200/300',
    'https://picsum.photos/id/242/200/300',
]

const CommentCard = () => {
    const [reply, setReply] = React.useState(false);
    const [text, setText] = React.useState('');
    const [images, setImages] = React.useState<ImagePickerAsset[]>([])

    const theme = useTheme<Theme>();
  return (
    <Box width='100%' borderBottomWidth={0.5} borderBottomColor='grey' marginBottom='m'>
        {/* HEADER AND USER DETAILS SECTION */}
        <Box flexDirection='row'>
            <Box width={32} height={32} borderRadius={17} borderWidth={1} borderColor='primaryColor'></Box>
            <Box flexDirection='row'>
                <CustomText variant='subheader' fontSize={15} color='black' marginLeft='s'>Jane Doe</CustomText>
                <CustomText variant='xs' color='grey' marginLeft='s'>2hr. ago</CustomText>
            </Box>
        </Box>

       <Box width={'100%'} paddingLeft='m' paddingBottom='s'>
            {/* TEXT AND IMAGE SECTION */}
            <Box width={'100%'} paddingHorizontal='m'>
                <CustomText variant='body' color='grey' fontSize={16}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Explicabo nobis, sequi maxime qui ex nihil tempore assumenda vitae iusto eius.</CustomText>
            </Box>

            {/* generate random image of a dog */}
            <Box width={'100%'} height={100} borderRadius={10}>
                <ScrollView horizontal contentContainerStyle={{ alignItems: 'center'}}>
                    {imagess.map((item, index) => (
                        <Image source={{ uri: item }} contentFit='cover' style={{ width: 60, height: 60, borderRadius: 10, marginRight: 10 }} />
                    ))}
                </ScrollView>
            </Box>

            {/* REACTION */}
            <Box width={'100%'} height={60} flexDirection='row'>
                    {/* MAIN REACTION BOX */}
                    <Box width={'35%'} height={32} flexDirection='row' borderRadius={20} borderWidth={0.5} borderColor='lightGrey'>

                        {/* UPVOTE */}
                        <Box width={'70%'} height={'100%'} justifyContent='center' alignItems='center' flexDirection='row' borderRightWidth={0.5} borderRightColor='lightGrey'>
                            <Image source={require('../../../../assets/images/arrows/up.png')} contentFit='cover' style={{ width: 20, height: 20 }} />
                            <CustomText variant='xs' fontSize={12} marginLeft='s'>UPVOTE</CustomText>
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