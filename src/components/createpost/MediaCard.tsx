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



interface IProps {
    file: ImagePicker.ImagePickerAsset;
    index: number;
    onDelete: (data:{ index?: number, clearAll?: boolean}) => void;
}

const MediaCard = ({ file, index, onDelete }: IProps) => {
    const theme = useTheme<Theme>();

    const RenderItem = React.useCallback(() => {
            if (file.type === 'image') {
                return (
                    <Image source={{ uri: file.uri }} contentFit='cover' style={{ width: '100%', height: '100%' }} />
                )
            } else {
                return (
                    <Video source={{ uri: `${file.uri}` }} usePoster  resizeMode={ResizeMode.COVER} useNativeControls videoStyle={{ width: '100%', height: '100%', borderRadius: 15, backgroundColor: 'grey' }} isLooping={false} style={{ width: '100%', height: '100%', borderRadius: 15, backgroundColor: 'grey', overflow: 'hidden' }} />
                )
            }
    }, [file]);
  return (
    <Box width={150} height={'90%'} borderRadius={15} overflow='hidden' marginLeft='m'>
        <Pressable style={{ ...style.deleteButton, backgroundColor: theme.colors.secondaryBackGroundColor }} onPress={() => onDelete({ index, clearAll: false })}>
            <Feather name='trash' size={20} color={theme.colors.textColor} />
        </Pressable>
        {RenderItem()}
    </Box>
  )
}

const style = StyleSheet.create({
    deleteButton: {
        zIndex: 10,
        position: 'absolute',
        right: 10,
        top: 10,
        height: 30,
        width: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default MediaCard