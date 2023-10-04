import { View, Text } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'

interface IProps {
  onDelete: (data: { index?: number, clearAll?: boolean }) => void;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const WritePoll = ({ description, setDescription }: IProps) => {
  const theme = useTheme<Theme>();

  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <Box flex={1}>
        <TextInput value={description} onChangeText={setDescription} style={{ flex: 1, fontFamily: 'RedRegular', fontSize: 18, color: theme.colors.textColor, padding: 20 }} placeholderTextColor={theme.colors.textColor} multiline placeholder={`what do you want to ask?`} textAlignVertical='top' />
        </Box>
      </ScrollView>
    </Box>
  )
}

export default WritePoll