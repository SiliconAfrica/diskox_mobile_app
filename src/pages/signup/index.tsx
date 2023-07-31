import { BackHandler, Platform } from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import Username from './pages/Username';
import Password from './pages/Password';
import { useSignupState } from './state';
import { useModalState } from '../../states/modalState';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';

const OS = Platform.OS;

const SignUp = () => {
  const [stage, setStage, reset] = useSignupState((state) => [state.stage, state.setAll, state.reset]);
  const [setModalState] = useModalState((state) => [state.setAll]);
  const theme = useTheme<Theme>();


  // handle back for IOS
  const back = React.useCallback(() => {
    if (stage === 1) {
      setModalState({ showSignup: false });
    }else {
      setStage({ stage: stage - 1 });
    }
  }, [stage]);

  const switchStage = React.useCallback(() => {
    switch(stage) {
      case 1: {
        return <Username />
      }
      case 2: {
        return <Password />
      }
      default: {
        return <Username />
      }
    }
  }, [stage])
  return (
    <Box flex={1}>
      { OS === 'ios' && stage > 1 && (
        <Box>
          <Feather name='chevron-left' size={30} color={theme.colors.textColor} onPress={back} />
        </Box>
      )}
      {switchStage()}
    </Box>
  )
}

export default SignUp