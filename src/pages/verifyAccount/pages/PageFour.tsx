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
import { useModalState } from '../../../states/modalState'
import { Camera, CameraType, FlashMode, VideoCodec, VideoQuality, getCameraPermissionsAsync, requestCameraPermissionsAsync, requestMicrophonePermissionsAsync } from 'expo-camera';
import { Video, Audio } from 'expo-av';
import useToast from '../../../hooks/useToast'


const items = [
    'Celebrity',
    'Government Official',
    'Public Figure',
    'Media Outlet'
]

const PageFour = ({next}: {
    next: (num: number) => void
}) => {
    const { setAll } =useModalState((state) => state)
    const { isDarkMode } = useUtilState((state) => state)
    const [recording, setRecording] = React.useState(false);
    const cameraRef = React.useRef<Camera>(null);
    const [dataUrl, setDataUrl] = React.useState('');
    const [cameraReady, setCameraReady] = React.useState(false);
    const theme = useTheme<Theme>();
    const toast = useToast();

    React.useEffect(() => {
    }, [])


    const startRecording = async () => {
        alert('clicked');
        if (cameraRef.current) {
          try {
            const data = await cameraRef.current.recordAsync({
                quality: VideoQuality['480p'],
                maxDuration: 60 * 1000,
            });
            setRecording(true);
            setDataUrl(data.uri);
          } catch (error) {
            console.error('Failed to start recording:', error);
          }
        }
      };
    
      const stopRecording = () => {
        if (cameraRef.current) {
          cameraRef.current.stopRecording();
          setRecording(false);
        }
      };

  return (
    <Box flex={1} paddingTop='m'>
        <CustomText variant='header' fontSize={26}>Video selfie verification</CustomText>
        <CustomText variant='body' marginTop='m' color='grey'>Please rotate your head while verifying</CustomText>

        <Box width={'100%'} height={350}  borderRadius={15} borderWidth={1} backgroundColor={isDarkMode ? 'mainBackGroundColor' : 'black'} marginTop='m' overflow='hidden' justifyContent='center' alignItems='center' >

            <Box height={250} width={250} borderRadius={125} borderWidth={2} borderColor='primaryColor' borderStyle='dashed' justifyContent='center' alignItems='center' bg='white'>
                {/* <Camera style={{ flex: 1 }} flashMode={FlashMode.on} useCamera2Api ref={cameraRef} type={CameraType.front} onCameraReady={() => alert('Ready')} >
                    <Video source={{ uri: dataUrl }} style={{ flex: 1 }} />
                </Camera> */}
            </Box>
         
        </Box>       

        <Box width='100%' height={70} justifyContent='center' alignItems='center'>
            <Pressable style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center'
            }}
                onPress={() => recording ? stopRecording() : startRecording()}
            >
                { recording ? <Ionicons name='stop-outline' color='red' size={25} />:<Ionicons name='play-outline' size={25} color={theme.colors.textColor} />}
            </Pressable>
        </Box>

        <Box width={'100%'} flex={1} flexDirection='row' justifyContent='space-between' alignItems='center'>
            <BorderButton width={100} borderColor='black' height={44} title='Go Back' onPress={() => next(3)} borderRadius={10} />
            <PrimaryButton width={100} height={44} title='Next' onPress={() => setAll({ showVerification: true })} borderRadius={10} />
        </Box>
    </Box>
  )
}

export default PageFour