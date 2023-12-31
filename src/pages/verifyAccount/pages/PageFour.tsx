import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React, {useState, useRef } from 'react'
import Box from '../../../components/general/Box'
import CustomText from '../../../components/general/CustomText'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme'
import { useUtilState } from '../../../states/util'
import PrimaryButton from '../../../components/general/PrimaryButton'
import BorderButton from '../../../components/general/BorderButton'
import { useModalState } from '../../../states/modalState'
import { Video, Audio } from 'expo-av';
import useToast from '../../../hooks/useToast'
import { activities } from '../../../utils/emoijis'
import { Camera, CameraType } from 'expo-camera'
import { useMutation } from 'react-query'
import httpService from '../../../utils/httpService'
import { URLS } from '../../../services/urls'
import { useVerificationState } from '../state'
import mime from "mime";



const RecordVideoScreen = ({next}: {
       next: (num: number) => void
   }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);
  const { category, government_id, self_with_id, video, setAll: setVerificationState } = useVerificationState((state) => state);
  const [timer, setTimer] = React.useState(10);
  const toast = useToast();

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: FormData) => httpService.post(`${URLS.VERIFY_ACCOUNT}`, data),
    onSuccess: () => {
      setAll({ showVerification: true })
    },
    onError: (error: any) => {
      toast.show(error.message, { type: 'error', placement: 'top', duration: 5000, style: { marginTop: 50 } });
    },
  });

  React.useEffect(() => {
    let timerInterval;
   (async function() {
    if (timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }else{
      if (isRecording) {
        setIsRecording(false);
        await cameraRef.current.stopRecording();
        setTimer(0);
      }
    }
   })()

    return () => {
      clearInterval(timerInterval);
    };
  }, [timer]);

  const theme = useTheme<Theme>();
  const { setAll } =useModalState((state) => state)
  const { isDarkMode } = useUtilState((state) => state)
  React.useEffect(() => {
    (async () => {
      
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      const micStatus = await Camera.requestMicrophonePermissionsAsync();
        if (micStatus.granted){
            setHasMicPermission(true);}
    })();
  }, []);

  const handleRecordVideo = async () => {
    if (isRecording) {
      setIsRecording(false);
      await cameraRef.current.stopRecording();
    } else {
      setIsRecording(true);
      setTimer(10);
      const { uri } = await cameraRef.current.recordAsync({
        quality: Camera.Constants.VideoQuality['720p'],
        maxDuration: 5 * 1000,
        mute: true,
      });
      if (uri !== null || uri !== undefined) {
        setVerificationState({ video: uri });
      }
      setVideoUri(uri);

    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
        const gid = government_id.uri.split('/');
        let gname = gid[gid.length - 1];

        const with_id = self_with_id.uri.split('/');
        const self = with_id[with_id.length - 1]
        
        const fname = video.split('/');
        const ff: string = fname[fname.length - 1];
        console.log(`uri ${ff}`);

        formData.append('category', category);
        formData.append('id_card', { uri: government_id.uri, type: mime.getType(government_id.uri), name: gname} as any);
        formData.append('person_with_idcard', { uri: self_with_id.uri, type: mime.getType(self_with_id.uri), name: self} as any);
        formData.append('video_selfie', {
          uri: video,
          type: mime.getType(video),
          name: ff,
        } as any);
        mutate(formData);
  }

  const startAgain = () => {
    setVerificationState({ video: null });
    handleRecordVideo();
  }

  const cameraRef = useRef(null);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Box flex={1} paddingTop='m'>
    <CustomText variant='header' fontSize={26}>Video selfie verification</CustomText>
    <CustomText variant='body' marginTop='m' color='grey'>Please rotate your head while verifying</CustomText>

    <Box width={'100%'} height={350}  borderRadius={15} borderWidth={1} backgroundColor={isDarkMode ? 'mainBackGroundColor' : 'black'} marginTop='m' overflow='hidden' justifyContent='center' alignItems='center' >

    


        <Box height={249} width={202} borderRadius={125} borderWidth={2} borderColor='primaryColor' borderStyle='dashed' justifyContent='center' alignItems='center' bg='white' overflow='hidden'>
            <Camera style={{ width: 202, height: 249 }} ref={cameraRef} type={CameraType.front} >
                {/* <Video source={{ uri: dataUrl }} style={{ flex: 1 }} /> */}
            </Camera>
        </Box>
     
    </Box>       

    <Box width='100%' paddingTop='m' justifyContent='center' alignItems='center'>
        <Pressable style={{
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center'
        }}
            onPress={handleRecordVideo}
        >
            { isLoading ? <CustomText variant='header' fontSize={16} color='primaryColor'>Uploading Video</CustomText> : isRecording ? <CustomText style={{ color: 'red' }} variant='header' fontSize={16}>{timer}s</CustomText>: video === '' ? 
            <CustomText color='primaryColor' variant='header' fontSize={16}>START RECORDING</CustomText>:<CustomText color='primaryColor' variant='header' fontSize={16}>Ready for submission</CustomText> }

            { video !== null && !isRecording && !isLoading && (
              <CustomText marginTop='l' color='primaryColor' variant='header' fontSize={16}>Start Again</CustomText>
            )}
        </Pressable>
    </Box>

    <Box width={'100%'} flex={1} flexDirection='row' justifyContent='space-between' alignItems='center'>
        <BorderButton width={100} borderColor='black' height={44} title='Go Back' onPress={() => next(3)} borderRadius={10} />
        <PrimaryButton width={100} height={44} title='Next' isLoading={isLoading} onPress={handleSubmit} borderRadius={10} />
    </Box>
</Box>
  );
};

export default RecordVideoScreen;
