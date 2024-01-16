import React from 'react';
import { View } from 'react-native';
import ReactNavtieModalWrapper from '../ReactNavtieModalWrapper';
import Box from '../general/Box';
import CustomText from '../general/CustomText';
import CustomButton from '../general/CustomButton';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';

// import { Container } from './styles';
type IProps = {
    isVisible: boolean;
    action: () => void;
    close: () =>void;
    isLoading: boolean;
}

const Saveasdraft: React.FC<IProps> = ({ action, isVisible,close, isLoading }) => {
    const theme = useTheme<Theme>();
  return (
    <ReactNavtieModalWrapper isVisible={isVisible} height={150} backgroundColor={theme.colors.mainBackGroundColor} >
        <Box width='100%' justifyContent='center' height={'100%'}>
            <CustomText variant='body' textAlign='center'>You have unsaved changes, save your changes?</CustomText>
            <CustomText variant='body' textAlign='center'>Cancel the moodal to exit.</CustomText>
            <Box flexDirection='row' justifyContent='center' alignItems='center' marginTop='m'>
                <CustomText variant='xs' fontSize={16} marginRight='m' onPress={() => close()}>Cancel</CustomText>
                <CustomButton isLoading={isLoading} title='save'color='grey' textColor='black' width={50} height={30} onPress={() => action()} />
            </Box>
        </Box>
    </ReactNavtieModalWrapper>
  )
}

export default Saveasdraft;