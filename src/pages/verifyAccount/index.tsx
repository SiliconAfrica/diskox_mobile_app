import { View, Text } from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import SettingsHeader from '../../components/settings/Header'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../navigation/MainNavigation'
import CustomText from '../../components/general/CustomText'
import PageOne from './pages/PageOne'
import PageTwo from './pages/PageTwo'
import PageThree from './pages/PageThree'
import PageFour from './pages/PageFour'
import { useVerificationState } from './state'
import { BackHandler } from 'react-native';


const VerifyAccount = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'verification'>) => { 
    const [step, setStep] = React.useState(1);
    const { clearAll } = useVerificationState((state) => state);

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if(step > 1) {
                setStep(step - 1);
            } else {
                navigation.goBack();
            }
            return true;
          });
        return () => {
            backHandler.remove();
        }
    }, [step]);

    React.useEffect(() => {
        return () => {
            clearAll();
        }
    }, [])

    const handlePage = React.useCallback(() => {
        switch(step) {
            case 1: {
                return <PageOne next={(num: number) => setStep(num)} />
            }
            case 2: {
                return <PageTwo next={(num: number) => setStep(num)} />
            }
            case 3: {
                return <PageThree next={(num: number) => setStep(num)} />
            }
            case 4: {
                return <PageFour next={(num: number) => setStep(num)} />
            }
        }
    }, [step])

    const handleBack = () => {
        if(step > 1) {
            setStep(step - 1)
        }else {
            navigation.goBack();
        }
    }
    
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
        <SettingsHeader title='Verify Account' showSave={false} handleArrowPressed={handleBack} />
        <Box flex={1} backgroundColor='secondaryBackGroundColor' padding='m'>
            <CustomText variant='subheader' fontSize={16} style={{ color: 'grey'}}>STEP {step} OF 4</CustomText>
            {handlePage()}
        </Box>
    </Box>
  )
}

export default VerifyAccount