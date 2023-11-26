import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { DocumentResult} from 'expo-document-picker'
import { Image } from 'expo-image'
import { Video, ResizeMode } from 'expo-av';
import { Feather } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import * as ImagePicker from 'expo-image-picker';
import { IFile } from '../../pages/chat'
import CustomText from '../general/CustomText'



interface IProps {
    file: IFile;
    index: number;
    onDelete: (data:{ index?: number, clearAll?: boolean}) => void;
    width?: number | string;
    height?: number | string;
}

const MediaCard = ({ file, index, onDelete, width = 150, height = '90%' }: IProps) => {
    const theme = useTheme<Theme>();

    const RenderItem = React.useCallback(() => {
            if (file.type.includes('image')) {
                return (
                    <Image source={{ uri: file.uri }} contentFit='cover' style={{ width: '100%', height: '100%' }} />
                )
            } else if (file.type.includes('video')) {
                return (
                    <Video source={{ uri: `${file.uri}` }} usePoster  resizeMode={ResizeMode.COVER} useNativeControls videoStyle={{ width: '100%', height: '100%', borderRadius: 15, backgroundColor: 'grey' }} isLooping={false} style={{ width: '100%', height: '100%', borderRadius: 15, backgroundColor: 'grey', overflow: 'hidden' }} />
                )
            } else {
                return (
                    <Box width='100%' style={{ backgroundColor: 'red' }} height={'100%'} justifyContent='center' alignItems='center'>
                        <CustomText variant='header' fontSize={14}>{file.type.split('/')[1].toUpperCase()}</CustomText>
                    </Box>
                )
            }
    }, [file]);
  return (
    <Box width={width} height={height} borderRadius={15} overflow='hidden' marginLeft='m' zIndex={1}>
        <Pressable style={{ ...style.deleteButton, backgroundColor: '#000000b9'}} onPress={() => onDelete({ index, clearAll: false })}>
            <Feather name='trash-2' size={25} color={theme.colors.textColor} />
        </Pressable>
        {RenderItem()}
    </Box>
  )
}

const style = StyleSheet.create({
    deleteButton: {
        zIndex: 10,
        position: 'absolute',
        right: 0,
        bottom: -1,
        height: 30,
        width: '100%',
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default MediaCard