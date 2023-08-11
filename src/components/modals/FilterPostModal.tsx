import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useRef } from 'react'
import ModalWrapper from '../ModalWrapper'
import Login from '../../pages/login'
import { useModalState } from '../../states/modalState'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { POST_FILTERR } from '../../enums/Postfilters'


const FilterPostModal = () => {
    const { setAll, filterBy } = useModalState((state) => state);
    const ref = useRef<BottomSheetModal>();
    const theme = useTheme<Theme>();

    useEffect(() => {
        ref.current.present();
    }, [])
  return (
    <ModalWrapper
        onClose={() => setAll({ showFilter: false })}
        shouldScrroll
        snapPoints={['30%']}
        ref={ref}
    >
       <Box flex={1} backgroundColor='mainBackGroundColor' paddingHorizontal='m'>

        <Pressable onPress={() => setAll({ filterBy: POST_FILTERR.HIGHEST_UPVOTES  })} style={{ ...style.button }}>
            <Box width={30} height={30} borderRadius={15} justifyContent='center' alignItems='center' backgroundColor='fadedButtonBgColor'>
                <Ionicons name='arrow-up-outline' size={15} color={theme.colors.primaryColor}  />
            </Box>
            <CustomText variant='body' marginLeft='m'>Highest upvotes</CustomText>
            {
                filterBy === POST_FILTERR.HIGHEST_UPVOTES && (
                    <Box marginLeft='s' width={15} height={15} borderRadius={7} bg='primaryColor' justifyContent='center' alignItems='center'>
                        <Ionicons name='checkmark-outline' color='white' size={10} />
                    </Box>
                )
            }
        </Pressable>

        <Pressable onPress={() => setAll({ filterBy: POST_FILTERR.MOST_COMMENTS  })} style={{ ...style.button }}>
            <Box width={30} height={30} borderRadius={15} justifyContent='center' alignItems='center' backgroundColor='fadedButtonBgColor'>
                <Ionicons name='chatbox-ellipses-outline' size={15} color={theme.colors.primaryColor}  />
            </Box>
            <CustomText variant='body' marginLeft='m'>Most comments</CustomText>
            {
                filterBy === POST_FILTERR.MOST_COMMENTS && (
                    <Box marginLeft='s' width={15} height={15} borderRadius={7} bg='primaryColor' justifyContent='center' alignItems='center'>
                        <Ionicons name='checkmark-outline' color='white' size={10} />
                    </Box>
                )
            }
        </Pressable>

        <Pressable onPress={() => setAll({ filterBy: POST_FILTERR.MOST_REACTIONS  })} style={{ ...style.button }}>
            <Box width={30} height={30} borderRadius={15} justifyContent='center' alignItems='center' backgroundColor='fadedButtonBgColor'>
                <Ionicons name='heart-outline' size={15} color={theme.colors.primaryColor}  />
            </Box>
            <CustomText variant='body' marginLeft='m'>Most reactions</CustomText>
            {
                filterBy === POST_FILTERR.MOST_REACTIONS && (
                    <Box marginLeft='s' width={15} height={15} borderRadius={7} bg='primaryColor' justifyContent='center' alignItems='center'>
                        <Ionicons name='checkmark-outline' color='white' size={10} />
                    </Box>
                )
            }
        </Pressable>

       </Box>
    </ModalWrapper>
  )
}

const style = StyleSheet.create({
    button: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    }
});

export default FilterPostModal