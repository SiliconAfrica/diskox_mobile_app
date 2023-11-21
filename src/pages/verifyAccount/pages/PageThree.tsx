import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'
import Box from '../../../components/general/Box'
import CustomText from '../../../components/general/CustomText'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme'
import { useUtilState } from '../../../states/util'
import PrimaryButton from '../../../components/general/PrimaryButton'
import BorderButton from '../../../components/general/BorderButton'
import * as ImagePicker from 'expo-image-picker';
import { useVerificationState } from '../state'
import { Image } from 'expo-image';
import useToast from '../../../hooks/useToast'

const items = [
    'Celebrity',
    'Government Official',
    'Public Figure',
    'Media Outlet'
]

const PageThree = ({next}: {
    next: (num: number) => void
}) => {
    const theme = useTheme<Theme>();

    const toast = useToast();
    const { setAll, self_with_id } = useVerificationState((state) => state);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          allowsMultipleSelection: false,
        });
    
    
        if (!result.canceled) {
         setAll({ self_with_id: result.assets[0] });
        //   setImage(result.assets[0].uri);
        }
      };

      const navigate = () => {
        if (self_with_id === null) {
            toast.show('You have to select an image to continue', { type: 'warning', placement: 'top', style: { marginTop: 50 } });
            return;
        }
        next(4);
      }

  return (
    <Box flex={1} paddingTop='m'>
        <CustomText variant='header' fontSize={26}>Verify your account</CustomText>
        <CustomText variant='body' marginTop='m' color='grey'> A verified profile has a green checkmark next the username. Keep in mind that verified badge are for well-known, often searched profiles.  </CustomText>

        <CustomText variant='header' fontSize={18} marginTop='m' marginBottom='s' >Upload a picture of you holding your valid ID below your face</CustomText>
        <CustomText variant='xs' style={{ color: 'red' }}>Uploading any forged document would attract a permanent ban from diskox</CustomText>


        <Box width={'100%'} height={200}  borderRadius={15} borderWidth={1} borderStyle='dashed' borderColor='primaryColor' marginTop='m' overflow='hidden' >
            <Box flex={1}>
                { self_with_id !== null && (
                    <Image source={{ uri: self_with_id.uri }} contentFit='cover' style={{ width: '100%', height: '100%' }} />
                )}
                {
                    self_with_id === null && (
                        <ImageBackground source={require('../../../../assets/images/userId.png')} style={{ ...StyleSheet.absoluteFillObject, }} resizeMode='contain' />
                    )
                }
            </Box>

            <Pressable onPress={pickImage} style={{ width: '100%', height: 50, backgroundColor: theme.colors.fadedButtonBgColor, justifyContent: 'center', alignItems: 'center'}} >
                <Ionicons name='folder-outline' size={25} color={theme.colors.primaryColor} />
                <CustomText variant='header' fontSize={18} color='primaryColor' marginLeft='m'>Browse file (PNG or JPG)</CustomText>
            </Pressable>
        </Box>       

        <Box width={'100%'} flex={1} flexDirection='row' justifyContent='space-between' alignItems='center'>
            <BorderButton width={100} borderColor='black' height={44} title='Go Back' onPress={() => next(2)} borderRadius={10} />
            <PrimaryButton width={100} height={44} title='Next' onPress={navigate} borderRadius={10} />
        </Box>
    </Box>
  )
}

export default PageThree