import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { ScrollView, TextInput,  } from 'react-native-gesture-handler';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Feather } from '@expo/vector-icons'
import MediaCard from './MediaCard';
import CustomText from '../general/CustomText';
import { DocumentResult } from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';


interface IProps {
  files: ImagePicker.ImagePickerAsset[];
  handlePicker: () => {};
  onDelete: (data:{ index?: number, clearAll?: boolean}) => void;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const WritePost = ({files, handlePicker, onDelete, description, setDescription }: IProps) => {
  const theme = useTheme<Theme>();

  const handleChange = (text: string) => {
    setDescription(text);
    const val = description.match(/#\w+/g);
  }

  return (
    <Box flex={1}>
     <ScrollView contentContainerStyle={{ flex: 1 }}>
    <Box flex={1}>
      <TextInput value={description} onChangeText={setDescription} style={{ flex: 1, fontFamily: 'RedRegular', fontSize: 18, color: theme.colors.textColor, padding: 20 }} placeholderTextColor={theme.colors.textColor} multiline placeholder={`Let's Diskox it...`} textAlignVertical='top'  />
    </Box>

      {
        files.length > 0 && (
          <Box height={200} margin='m' borderWidth={2} borderColor='secondaryBackGroundColor' borderRadius={20}>

            <Pressable onPress={() => onDelete({ clearAll: true })} style={{ ...style.deleteButton, backgroundColor: theme.colors.secondaryBackGroundColor }}>
              <Feather name='x' size={20} color={theme.colors.textColor} />
            </Pressable>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingLeft: 0, paddingRight: 100 }}>
              {files.map((file, index) => (
                <MediaCard file={file} index={index} onDelete={onDelete} key={index} />
              ))}
            {files.length < 10 && (
              <Pressable style={{
                marginLeft: 20,
                width: 150, height: '90%',
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: theme.colors.secondaryBackGroundColor,
              }}
                onPress={() => handlePicker()}
              >
                <CustomText variant='body'>Add Media File</CustomText>
                <Feather name='image' size={40} color={theme.colors.textColor} />
              </Pressable>
            )}
      </ScrollView>
    </Box>
  )
}
     </ScrollView>
    </Box>
  )
}

const style = StyleSheet.create({
  deleteButton: {
      zIndex: 10,
      position: 'absolute',
      right: -10,
      top: -10,
      height: 30,
      width: 30,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
  }
});

export default WritePost