import { View, Text } from 'react-native'
import React from 'react'
import { Image } from 'expo-image'
import { useUtilState } from '../states/util'

const useImage = ({
    width = 60,
    height = 60,
}: {
    width: number, height: number,
}) => {
    const [isDark] = useUtilState((state) => [state.isDarkMode]);
    const renderImage = React.useCallback(() => {
        if (!isDark) {
            return <Image source={require('../../assets/images/logoB.png')} style={{ width: width, height: height }} contentFit='contain' />
        } else {
            return <Image source={require('../../assets/images/logo.png')} style={{ width: width, height: height }} contentFit='contain' />
        }
    }, [isDark, width, height])
  return renderImage
}

export default useImage