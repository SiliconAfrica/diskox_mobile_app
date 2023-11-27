import { View, Text, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, ScrollView } from 'react-native'
import React from 'react'
import Box from '../../general/Box'
import { Ionicons } from '@expo/vector-icons'
import CustomButton from '../../general/CustomButton'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../theme'
import { ImagePickerAsset, MediaTypeOptions, UIImagePickerPresentationStyle, launchImageLibraryAsync } from 'expo-image-picker'
import CustomText from '../../general/CustomText'
import EmojiPicker, {emojiFromUtf16} from "rn-emoji-picker"
import {emojis} from "rn-emoji-picker/dist/data"
import EmojiSelector from 'react-native-emoji-selector'



const CommentTextBox = ({ onImagePicked, text, onTextChange,  buttonText = 'Post', onSubmit, isLoading, isReply, username }: {
    onImagePicked: (image: ImagePickerAsset) => void,
    text: string,
    onTextChange: (text: string) => void,
    buttonText?: string,
    onSubmit?: () => void,
    isLoading?: boolean,
    isReply?: boolean,
    username?: string
}) => {
    const [mentionedUsers, setMentionedUsers] = React.useState<string[]>([]);
    const [recent, setRecent] = React.useState([]);
    const [showEmojis, setShowEmojis] = React.useState(false);



    const theme = useTheme<Theme>();

    const pickImage = async () => {
       try {
          const res = await launchImageLibraryAsync({
            allowsMultipleSelection: true,
            mediaTypes: MediaTypeOptions.Images,
            quality: 1,
            selectionLimit: 5,
            // presentationStyle: UIImagePickerPresentationStyle.POPOVER,
        });

        if (!res.canceled) {
            console.log(res.assets);
            onImagePicked(res.assets[0])
        }
       } catch (error) {
        console.log(error);
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

    const handleEmojiPicked = React.useCallback((emoji: string) => {
      // Get the current cursor position
      const cursorPosition = text.length;
    
      // Insert the emoji at the cursor position
      const updatedText = text.slice(0, cursorPosition) + emoji + text.slice(cursorPosition);
    
      // Update the text
      onTextChange(updatedText);
    }, [onTextChange, text]);

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
          {
            showEmojis && (
              <Box width='100%' maxHeight={300} position='absolute' zIndex={30} top={-200} bottom={80} >
                <ScrollView nestedScrollEnabled contentContainerStyle={{ height: 200 }}>
                <EmojiPicker

                      emojis={emojis} // emojis data source see data/emojis
                      recent={recent} // store of recently used emojis
                      autoFocus={true} // autofocus search input
                      loading={false} // spinner for if your emoji data or recent store is async
                      darkMode={true} // to be or not to be, that is the question
                      perLine={10} // # of emoji's per line
                      onSelect={(e) => handleEmojiPicked(e.emoji)} // callback when user selects emoji - returns emoji obj
                      onChangeRecent={setRecent} 
                      backgroundColor={theme.colors.secondaryBackGroundColor}// callback to update recent storage - arr of emoji objs
                      // backgroundColor={'#000'} // optional custom bg color
                      // enabledCategories={[ // optional list of enabled category keys
                      //   'recent', 
                      //   'emotion', 
                      //   'emojis', 
                      //   'activities', 
                      //   'flags', 
                      //   'food', 
                      //   'places', 
                      //   'nature'
                      // ]}
                      // defaultCategory={'food'} // optional default category key
                  />
                </ScrollView>
              </Box>
            )
          }
         <Box width={'100%'} height={80} borderRadius={10} bg='secondaryBackGroundColor'>

                <TextInput value={text} onChangeText={handleTextChange} style={{ flex: 1, paddingHorizontal: 10, fontFamily: 'RedRegular', fontSize: 14, color: theme.colors.textColor }} placeholderTextColor={theme.colors.textColor} placeholder={isReply ? `@${username}`:'Write your comment here...'} multiline numberOfLines={2} onKeyPress={handleTextInputKeyPress} />

                <Box width={'100%'} height={40} flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='s'>
                    <Box flexDirection='row'>
                        <Ionicons name='images-outline' onPress={pickImage} size={20} color={theme.colors.lightGrey} />
                        <Ionicons name='happy-outline' onPress={() => setShowEmojis(prev => !prev)} size={20} color={ showEmojis ? theme.colors.primaryColor : theme.colors.lightGrey} style={{ marginLeft: 10 }} />
                    </Box>
                    <CustomButton title={buttonText} width={53} height={28} color={theme.colors.primaryColor} textColor='white' onPress={() => onSubmit()} isLoading={isLoading} />
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