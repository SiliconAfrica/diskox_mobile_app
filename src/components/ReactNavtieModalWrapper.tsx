import { View, Text, Modal } from 'react-native'
import React from 'react'
import Box from './general/Box'
import { ScrollView } from 'react-native-gesture-handler';

interface IProps {
    children: React.ReactNode;
    height?: number|string;
    isVisible: boolean;
}

const ReactNavtieModalWrapper = ({children, height, isVisible}: IProps) => {
  return (
    <Modal visible={isVisible} transparent animationType='slide' >
        <View style={{ flex: 1, backgroundColor: '#0000006f', justifyContent: 'center', alignItems: 'center' }}>
            <Box width='95%' height={height || '30%'} borderRadius={20} backgroundColor='mainBackGroundColor'>
                {/* { !height && ( */}
                    <ScrollView>
                        {children}
                    </ScrollView>
                {/* )}
                {
                    height && children
                } */}
            </Box>
        </View>
    </Modal>
  )
}

export default ReactNavtieModalWrapper