import { View, Text, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, ScrollView } from 'react-native'
import React from 'react'
import Box from '../../general/Box'
import { Ionicons } from '@expo/vector-icons'
import CustomButton from '../../general/CustomButton'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme'
import { ImagePickerAsset, MediaTypeOptions, UIImagePickerPresentationStyle, launchImageLibraryAsync } from 'expo-image-picker'
import CustomText from '../../general/CustomText'

const CommentTextBox = ({ onImagePicked, text, onTextChange,  buttonText = 'Post' }: {
    onImagePicked: (image: ImagePickerAsset) => void,
    text: string,
    onTextChange: (text: string) => void,
    buttonText?: string
}) => {
    const [mentionedUsers, setMentionedUsers] = React.useState<string[]>([]);
    const theme = useTheme<Theme>();

    const pickImage = async () => {
        const res = await launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: MediaTypeOptions.Images,
            quality: 1,
            selectionLimit: 5,
            presentationStyle: UIImagePickerPresentationStyle.POPOVER,
        });

        if (!res.canceled) {
            console.log(res.assets);
            onImagePicked(res.assets[0])
        }
    }
    const handleTextChange = (text: string) => {
      onTextChange(text);
    
      const regex = /@(\w+)/g;
      const matches = text.match(regex);
    
      if (matches) {
        const users = matches.map(match => match.slice(1)); // remove the "@" symbol
        setMentionedUsers(users);
      } else {
        setMentionedUsers([]);
      }
    };

    const handleSelectMention = (user: string) => {
        const updatedText = text.replace(`@${user}`, `@${user} `);
        onTextChange(updatedText);
        setMentionedUsers([]);
      };
      
      const handleTextInputKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (event.nativeEvent.key === ' ') {
          setMentionedUsers([]);
        }
      };

  return (
    <Box width={'100%'}>
         <Box width={'100%'} height={80} borderRadius={10} bg='secondaryBackGroundColor'>

                <TextInput value={text} onChangeText={handleTextChange} style={{ flex: 1, paddingHorizontal: 10, fontFamily: 'RedRegular', fontSize: 14, color: theme.colors.textColor }} placeholderTextColor={theme.colors.textColor} placeholder='Writw your comment here...' multiline numberOfLines={2} onKeyPress={handleTextInputKeyPress} />

                <Box width={'100%'} height={40} flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='s'>
                    <Box flexDirection='row'>
                        <Ionicons name='images-outline' onPress={pickImage} size={20} color={theme.colors.lightGrey} />
                        <Ionicons name='happy-outline' size={20} color={theme.colors.lightGrey} style={{ marginLeft: 10 }} />
                    </Box>
                    <CustomButton title={buttonText} width={53} height={28} color={theme.colors.primaryColor} textColor='white' onPress={() => {}} />
                </Box>

            </Box>

           { text.startsWith('@') && (
                <Box position='absolute' zIndex={10} top={-200} left={0} width={'100%'} height={200} borderTopRightRadius={20} borderTopLeftRadius={20} bg='secondaryBackGroundColor' borderWidth={0.5} borderColor='lightGrey'>
                      <ScrollView contentContainerStyle={{ padding: 20 }}>
                        {mentionedUsers.map(user => (
                          <CustomText variant='body' onPress={() => handleSelectMention(user)} key={user}>{user}</CustomText>
                        ))}
                        {/* Render other components */}
                      </ScrollView>
                </Box>
           )}
    </Box>
  )
}

export default CommentTextBox