import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { ArrowLeft2, ArrowRight2, CloseCircle } from 'iconsax-react-native'
import { useModalState } from '../../states/modalState'
import useToast from '../../hooks/useToast'
import { Image } from 'expo-image'
import { IMAGE_BASE } from '../../utils/httpService'
import CustomText from '../general/CustomText'

const ImagesViewer = () => {
    const toast = useToast();
    const { setAll, activeImages } = useModalState((state) => state);
    const [len, setLen] = React.useState(activeImages.length);
    const [index, setIndex] = React.useState(0);

    const forward = () => {
        if (len - 1 > index) {
            setIndex(index + 1);
        } else {
            toast.show("This is the last image", { type: 'success', placement: 'top' });
        }
    }

    const backward = () => {
        if (index !== 0) {
            setIndex(index - 1);
        } else {
            toast.show("You can't go back", { type: 'success', placement: 'top' });
        }
    }
  return (
    <Box width={'100%'} height={'100%'} justifyContent='center' style={{ backgroundColor: '#000000a7', position: 'absolute', zIndex: 100 }}>
        <Box width={'100%'} height={40} alignItems='flex-end' justifyContent='center' paddingRight='s'>
            <CloseCircle size={30} color='white' variant='Outline' onPress={() => setAll({ imageViewer: false, activeImages: [] })} />
        </Box>
        <Box width={'100%'} height={'60%'} flexDirection='row' position='relative'>
            {/* ARROW LEFT */}
            {activeImages.length > 1 && (
                <Pressable style={{
                    width: 30,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    left: 0,
                    zIndex: 10
                }} 
                    onPress={backward}
                >
                    <ArrowLeft2 size={30} color='white' variant='Outline' />
                </Pressable>
            )}

            {/* MAIN AREA */}
            <Box flex={1} style={{ backgroundColor: 'black' }}>
                <Image source={{ uri: `${IMAGE_BASE}${activeImages[index]}`}} contentFit='contain' style={{
                    width: '100%',
                    height: '100%',
                    ...StyleSheet.absoluteFillObject
                }} />
            </Box>

            {/* ARROW RIGHT */}
            {activeImages.length > 1 && (
                <Pressable  style={{
                    width: 30,
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    right: 0
                }} 
                onPress={forward}
                >
                    <ArrowRight2 size={30} color='white' variant='Outline' />
                </Pressable>
            )}
        </Box>
            
        <Box width={'100%'} height={50} alignItems='center' justifyContent='center' paddingRight='s'>
           <Box width={70} height={30} borderRadius={20} justifyContent='center' alignItems='center' style={{ backgroundColor: '#000000dd' }}>
                <CustomText variant='body' style={{ color: 'white' }}>{index+1} / {len}</CustomText>
           </Box>
        </Box>

    </Box>

  )
}

export default ImagesViewer