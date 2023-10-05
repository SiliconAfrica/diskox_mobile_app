import { View, Text, Modal } from 'react-native'
import React from 'react'
import Box from './general/Box'
import { ScrollView } from 'react-native-gesture-handler';

interface IProps {
    children: React.ReactNode;
    height?: number|string;
    isVisible: boolean;
    backgroundColor?: string;
}

const ReactNavtieModalWrapper = ({ children, height, isVisible, backgroundColor = 'white' }: IProps) => {
  return (
    <Modal visible={isVisible} transparent animationType='slide' >
        <View style={{ flex: 1, backgroundColor: '#0000006f', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '95%', height: height || '30%', backgroundColor, borderRadius: 10 }} >
                {/* { !height && ( */}
                    <ScrollView>
                        {children}
                    </ScrollView>
                {/* )}
                {
                    height && children
                } */}
            </View>
        </View>
    </Modal>
  )
}

export default ReactNavtieModalWrapper