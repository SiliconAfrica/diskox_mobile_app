import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { ArrowLeft2, ArrowRight2, CloseCircle } from 'iconsax-react-native'
import { useModalState } from '../../states/modalState'
import useToast from '../../hooks/useToast'
import { Image } from 'expo-image'
import { IMAGE_BASE } from '../../utils/httpService'
import CustomText from '../general/CustomText'
import PagerView from 'react-native-pager-view';

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

            {/* MAIN AREA */}
            <PagerView style={{ backgroundColor: 'black', flex: 1 }} initialPage={0} onPageSelected={(e) => setIndex(e.nativeEvent.position)}>
                {activeImages.map((item, indx) => (
                    <Box
                    width={'100%'}
                    height={'100%'}
                    key={indx.toString()}
                >
                    <Image source={{ uri: `${IMAGE_BASE}${activeImages[indx]}`}} contentFit='contain' style={{
                    width: '100%',
                    height: '100%',
                    ...StyleSheet.absoluteFillObject
                }} />
                </Box>
                ))}
            </PagerView>

        </Box>
            
       { activeImages.length === 1 && (
         <Box width={'100%'} height={50} alignItems='center' justifyContent='center' paddingRight='s'>
            <Box width={70} height={30} borderRadius={20} justifyContent='center' alignItems='center' style={{ backgroundColor: '#000000dd' }}>
                <CustomText variant='body' style={{ color: 'white' }}>{index+1} / {len}</CustomText>
            </Box>
        </Box>
       )}
       
       <Box width={'100%'} flexDirection='row' justifyContent='center' alignItems='center'>
        { activeImages.length > 1 && activeImages.map((item, indx) => (
            <Box key={indx.toString()} width={ index === indx ? 10:5 } height={index === indx ? 10:5} marginHorizontal='s' borderRadius={20} bg={indx === index ? 'primaryColor':'secondaryBackGroundColor'} />
        ))}
       </Box>

    </Box>

  )
}

export default ImagesViewer