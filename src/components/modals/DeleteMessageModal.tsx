import { View, Text, Pressable } from 'react-native'
import React from 'react'
import ReactNavtieModalWrapper from '../ReactNavtieModalWrapper';
import CustomText from '../general/CustomText';
import { IPost_Image } from '../../models/chatmessages';
import Box from '../general/Box';
import { ScrollView } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import httpService, { IMAGE_BASE } from '../../utils/httpService';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { useWindowDimensions  } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useMutation } from 'react-query';
import { URLS } from '../../services/urls';

interface IProps {
    isVisisble: boolean;
    onClose: () => void;
    message_id: number;
  }

const DeleteMessageModal = ({ isVisisble, onClose, message_id }: IProps) => {
    const [type, setType] = React.useState('');
    const theme = useTheme<Theme>();
    const { height, width } = useWindowDimensions();
    const { isLoading, mutate } = useMutation({
        mutationFn: (data: string) => httpService.delete(`${URLS.DELETE_MESSAGE}/${message_id}/${data}`),
    });


  return (
    <ReactNavtieModalWrapper isVisible={isVisisble} height={'22%'} backgroundColor={theme.colors.secondaryBackGroundColor}>
        <Box width='100%' height={'100%'} paddingHorizontal='m' alignContent='flex-end' justifyContent='center'>


           { !isLoading && (
            <>
                 <Box width='100%' alignItems='flex-end' alignContent='flex-end' marginVertical='m'>
                    <Feather name='x' size={20} color={theme.colors.textColor} onPress={() => onClose()} />
                </Box>
                <CustomText onPress={() => mutate('everyone')} variant='subheader' fontSize={18} textAlign='right'>Delete for everyone</CustomText>
                <CustomText onPress={() => mutate('me')} variant='subheader' fontSize={18} marginVertical='m' textAlign='right'>Delete for me</CustomText>
                <CustomText onPress={() => onClose()} variant='subheader' fontSize={18} textAlign='right'>cancel</CustomText>
                </>
           )}
           {
            isLoading && <CustomText variant='body' fontSize={20} textAlign='center'>Deleting...</CustomText>
           }

      
        </Box>
    </ReactNavtieModalWrapper>
  )
}

export default DeleteMessageModal