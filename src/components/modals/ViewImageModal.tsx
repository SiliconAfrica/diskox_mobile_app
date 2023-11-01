import { View, Text } from 'react-native'
import React from 'react'
import ReactNavtieModalWrapper from '../ReactNavtieModalWrapper';
import CustomText from '../general/CustomText';
import { IPost_Image } from '../../models/chatmessages';
import Box from '../general/Box';
import { ScrollView } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { IMAGE_BASE } from '../../utils/httpService';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { useWindowDimensions  } from 'react-native'
import { Feather } from '@expo/vector-icons'

interface IProps {
    isVisisble: boolean;
    onClose: () => void;
    images: IPost_Image[];
  }

const ViewImageModal = ({ isVisisble, onClose, images }: IProps) => {
    const theme = useTheme<Theme>();
    const { height, width } = useWindowDimensions();
  return (
    <ReactNavtieModalWrapper isVisible={isVisisble} height={'40%'} backgroundColor={'white'}>
        <Box width='100%' paddingHorizontal='m' backgroundColor='mainBackGroundColor'>
            <Box width='100%' alignItems='flex-end' alignContent='flex-end' marginVertical='m'>
                <Feather name='x' size={20} color={theme.colors.textColor} onPress={() => onClose()} />
            </Box>
            <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 20 }}>
                {
                    images.map((item, i) => (
                        <Box key={i.toString()} width={width} height={200} overflow='hidden' borderRadius={10} marginRight='m'>
                            <Image key={i.toString()} source={{ uri: `${IMAGE_BASE}${item.image_path}` }} contentFit='cover' 
                                style={{
                                width: width,
                                height: 200,
                                marginRight: 20,
                                }} 
                            />
                        </Box>
                    ))
                }
            </ScrollView>
        </Box>
    </ReactNavtieModalWrapper>
  )
}

export default ViewImageModal