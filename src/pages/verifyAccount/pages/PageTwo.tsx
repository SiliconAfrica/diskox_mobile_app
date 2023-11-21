import { View, Text, Pressable } from 'react-native'
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


const PageTwo = ({next}: {
    next: (num: number) => void
}) => {
    const theme = useTheme<Theme>();
    const toast = useToast();

    const { setAll, government_id } = useVerificationState((state) => state);
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
         setAll({ government_id: result.assets[0] });
        //   setImage(result.assets[0].uri);
        }
      };

      const navigate = () => {
        if (government_id === null) {
            toast.show('You have to select an image to continue', { type: 'warning', placement: 'top', style: { marginTop: 50 } });
            return;
        }
        next(3);
      }
  return (
    <Box flex={1} paddingTop='m'>
        <CustomText variant='header' fontSize={26}>Verify your account</CustomText>
        <CustomText variant='body' marginTop='m' color='grey'> A verified profile has a green checkmark next the username. Keep in mind that verified badge are for well-known, often searched profiles.  </CustomText>

        <CustomText variant='header' fontSize={18} marginTop='m' marginBottom='s' >Upload any official government issued ID</CustomText>
        <CustomText variant='xs' style={{ color: 'red' }}>Uploading any forged document would attract a permanent ban from diskox</CustomText>


        <Box width={'100%'} height={200}  borderRadius={15} borderWidth={1} borderStyle='dashed' borderColor='primaryColor' marginTop='m' overflow='hidden' >
            <Box flex={1}>
                { government_id !== null && (
                    <Image source={{ uri: government_id.uri }} contentFit='cover' style={{ width: '100%', height: '100%' }} />
                ) }
                {
                    government_id === null && (
                        <Image source={require('../../../../assets/images/nin.png')} contentFit='cover' style={{ width: '100%', height: '100%' }} />
                    )
                }
            </Box>

            <Pressable onPress={pickImage} style={{ width: '100%', height: 50, backgroundColor: theme.colors.fadedButtonBgColor, justifyContent: 'center', alignItems: 'center'}} >
                <CustomText variant='header' fontSize={18} color='primaryColor'>UploadID</CustomText>
            </Pressable>
        </Box>       

        <Box width={'100%'} flex={1} flexDirection='row' justifyContent='space-between' alignItems='center'>
            <BorderButton width={100} borderColor={theme.colors.mainBackGroundColor} height={44} title='Go Back' onPress={() => next(1)} borderRadius={10} />
            <PrimaryButton width={100} height={44} title='Next' onPress={navigate} borderRadius={10} />
        </Box>
    </Box>
  )
}

export default PageTwo