import { View, Text, TextInput } from 'react-native'
import React from 'react'
import Box from '../../../../components/general/Box'
import { Feather } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../../theme'
import CustomText from '../../../../components/general/CustomText'
import { ScrollView } from 'react-native-gesture-handler'
import FadedButton from '../../../../components/general/FadedButton'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/MainNavigation'

const testArray = [2,2,3,4,5,6,7,7,6,5,4,3];

const MemberCard = () => {
    return (
        <Box flexDirection='row' justifyContent='space-between' marginBottom='l' paddingHorizontal='m' alignItems='center'>
            <Box flexDirection='row' alignItems='center'>
                <Box width={30} height={30} borderRadius={15} borderColor='primaryColor' borderWidth={2} />
                
                <Box marginLeft='m'>
                    <CustomText variant='subheader' fontSize={17}>Robby Mark</CustomText>
                    <Box flexDirection='row' alignItems='center' marginTop='s'>
                        <CustomText variant='xs'>450 followers</CustomText>
                        <CustomText variant='xs' marginLeft='m'>98 following</CustomText>
                    </Box>
                </Box>
            </Box>

            <FadedButton title='Follow' onPress={() => {}} width={80} height={35} />
        </Box>
    )
}

const Members = ({ navigation }: NativeStackScreenProps<RootStackParamList>) => {
    const theme = useTheme<Theme>();
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
        <Box flexDirection='row' height={50} paddingHorizontal='m' alignItems='center'>
            <Feather name='arrow-left' size={30} color={theme.colors.textColor} onPress={() => navigation.goBack()} />
            <CustomText variant='subheader' fontSize={18} marginLeft='m' >Communtiy members</CustomText>
        </Box>

        {/* SEARCH BOX */}

        <Box paddingHorizontal='m' width='100%' marginTop='s'>
            <Box width={'100%'} height={45} borderRadius={25} backgroundColor='secondaryBackGroundColor' flexDirection='row' alignItems='center' paddingHorizontal='m' >
                <Feather name='search' size={25} color={theme.colors.textColor} />
                <TextInput style={{ flex: 1, color: theme.colors.textColor, fontFamily: 'RedRegular', paddingLeft: 10 }} placeholder='Search for a member' placeholderTextColor={theme.colors.textColor} />
            </Box>
        </Box>

        <CustomText variant='subheader' fontSize={14} marginTop='m' marginLeft='m'>230 Members</CustomText>

        {/* MEMBERS LIST */}
        <Box flex={1} marginTop='l'>
            <ScrollView>
                { testArray.map((item, index) => (
                    <MemberCard key={index.toString()} />
                ))}
            </ScrollView>
        </Box>
    </Box>
  )
}

export default Members