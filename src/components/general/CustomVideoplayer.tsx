import React from 'react'
import Box from './Box'
import { ResizeMode, Video } from 'expo-av'
import { VolumeCross, VolumeHigh } from 'iconsax-react-native'
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import CustomText from './CustomText';
import { Pressable, useWindowDimensions, Platform } from 'react-native';

const OS = Platform.OS;
function CustomVideoplayer({
    uri,
    poster = ''
}: {
    uri: string,
    poster: string
}) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isMute, setIsMute] = React.useState(true);
    const [playback, setPlayback] = React.useState(0);

    const seconds = Math.floor(playback / 1000);
    const minutes = Math.floor(seconds / 60);
    const formattedTime = `${minutes}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`;

    
    const theme = useTheme<Theme>();
    const videoRef = React.useRef<Video>(null);
    const WIDTH = useWindowDimensions().width;
    const HEIGHT = useWindowDimensions().height;

    React.useEffect(() => {
        if (videoRef.current) {
            videoRef.current.setIsMutedAsync(true).then();
            videoRef.current.getStatusAsync().then((status) => {
                setPlayback(0)
            });
            setIsMute(true)
        }
    }, [])

    const handlePlay = async () => {
        if (isPlaying) {
            await videoRef.current.pauseAsync();
            setIsPlaying(false);
            return;
        } else {
            await videoRef.current.playAsync();
            setIsPlaying(true);
            return;
        }
    }

    const handleMute = async () => {
        if (isMute) {
            await videoRef.current.setIsMutedAsync(false)
            setIsMute(false);
            return;
        } else {
            await videoRef.current.setIsMutedAsync(true)
            setIsMute(true);
            return;
        }
    }

  return (
   <Box width={'100%'} maxHeight={350} position='relative'>

        <Video onTouchStart={() => handlePlay()} posterSource={{ uri: poster }} source={{ uri: uri }} ref={videoRef} useNativeControls={false} style={{ width: '100%', height: 350 }} onPlaybackStatusUpdate={(status) => setPlayback(status['positionMillis'])} resizeMode={ResizeMode.COVER} />


        <Box position='absolute' bottom={0} bg='transparent2' width={'100%'} height={60} flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='m'>

            <Pressable style={{
                width: 40,
                height: 40,
                backgroundColor: theme.colors.secondaryBackGroundColor,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center'
            }} onPress={handleMute}>
                { isMute && <VolumeCross size={30} color={theme.colors.textColor} /> }
                { !isMute && <VolumeHigh size={30} color={theme.colors.textColor} /> }
            </Pressable>

            <Box   width={60} height={40} bg='secondaryBackGroundColor' borderRadius={20} justifyContent='center' alignItems='center'>
                <CustomText variant='body'>{playback === 0 ? '0:00' : formattedTime}</CustomText>
            </Box>
            
        </Box>

   </Box>
  )
}

export default CustomVideoplayer