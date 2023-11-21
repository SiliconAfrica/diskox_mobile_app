import { View, Text } from 'react-native'
import React from 'react'
import Box from '../../general/Box'
import { ImagePickerAsset } from 'expo-image-picker'
import { Image } from 'expo-image'
import { CloseCircle } from 'iconsax-react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme'

const ImageBox = ({ payload, index, onRemove }: {
    payload: ImagePickerAsset,
    index: number,
    onRemove: (index: number) => void
}) => {
    const theme = useTheme<Theme>();
  return (
    <Box width={60} height={60} borderRadius={10} position='relative' marginRight='m'>
        <Image source={{ uri: payload.uri }} contentFit='cover' style={{ width: '100%', height: '100%', borderRadius: 10 }}  />
        <Box width={20} height={20} borderRadius={10} justifyContent='center' position='absolute' zIndex={10} top={-5} right={-5} alignItems='center' bg='lightGrey'>
            <CloseCircle size={12} color={'white'} onPress={() => onRemove(index)} />
        </Box>
    </Box>
  )
}

export default ImageBox