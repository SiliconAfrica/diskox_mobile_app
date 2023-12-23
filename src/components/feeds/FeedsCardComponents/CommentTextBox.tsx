import { View, Text, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, ScrollView, Pressable, ActivityIndicator } from 'react-native'
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
import { MentionInput, MentionSuggestionsProps } from 'react-native-controlled-mentions'
import { Mention } from '../../../models/mention'
import { useQuery } from 'react-query'
import httpService, { IMAGE_BASE } from '../../../utils/httpService'
import { URLS } from '../../../services/urls'
import { PaginatedResponse } from '../../../models/PaginatedResponse'
import { CUSTOM_STATUS_CODE } from '../../../enums/CustomCodes'
import { uniqBy } from 'lodash'
import { useCommentMentionState } from '../commentState'
import { Image } from 'expo-image'
import { UserRound } from 'lucide-react-native'

const suggestions = [
  {id: '1', name: 'David Tabaka'},
  {id: '2', name: 'Mary'},
  {id: '3', name: 'Tony'},
  {id: '4', name: 'Mike'},
  {id: '5', name: 'Grey'},
];

const renderSuggestions: React.FC<MentionSuggestionsProps> = ({keyword, onSuggestionPress}) => {
  const [users, setUsers] = React.useState<Mention[]>([]);
  const [total, setTotal] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);

  const theme= useTheme<Theme>()
  const { setId, setSelectedUsers } = useCommentMentionState((state) => state)

  const {isLoading} = useQuery(['getMentions', keyword, currentPage],() => httpService.get(`${URLS.GET_MENTIONS}`, {
    params: {
      keyword,
      page: currentPage
    }
  }), {
    enabled: keyword != null,
    onSuccess: (data) => {
      const item: PaginatedResponse<Mention> = data.data;
      if (item.code == CUSTOM_STATUS_CODE.SUCCESS) {
        if (users.length > 0) {
          setUsers(uniqBy([...users, ...item.data.data],'id'));
        } else {
          setUsers(item.data.data);
          setTotal(item.data.total);
        }
      }
    },
    onError: (error) => {}
  })
 

  return (
    <Box width={'100%'} minHeight={0} maxHeight={180} bg='mainBackGroundColor' borderTopLeftRadius={10} borderTopRightRadius={10} position='absolute' top={-205} zIndex={10} marginTop={'l'} borderWidth={0.3} borderColor='lightGrey'  >
      {
        isLoading && (
          <Box width='100%' height={40} justifyContent='center' alignItems='center'>
            <ActivityIndicator size={'small'} color={theme.colors.primaryColor} />
          </Box>
        )
      }
      { keyword !== null && (
        <ScrollView nestedScrollEnabled>
          { users
          .filter(one => one?.name?.toLowerCase().includes(keyword?.toLowerCase()))
          .map(one => (
            <Pressable

              key={one.id}
              onPress={() => {
                onSuggestionPress({ id: '', name: one.name });
                setSelectedUsers(one);
                setId(one.id.toString());
              }}
  
              style={{padding: 10, flexDirection: 'row', alignItems:'center' }}
            > 
              { one.profile_image !== null && (
                <Image source={{ uri: `${IMAGE_BASE}${one.profile_image}`}} contentFit='cover' style={{ width: 30, height: 30, borderRadius: 15 }} />
              )}
              { one.profile_image === null && (
                <Box width={30} height={30} borderRadius={15} justifyContent='center' alignItems='center'>
                  <UserRound size={20} color={theme.colors.primaryColor} />
                </Box>
              )}
              <CustomText variant='body' marginLeft='m'>{one.name}</CustomText>
            </Pressable>
          ))
        }
        </ScrollView>
      )}
    </Box>
  );
};




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
    const { setId, ids } = useCommentMentionState((state) => state)


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
         <Box width={'100%'} minHeight={80} maxHeight={200} borderRadius={10} bg='secondaryBackGroundColor'>

                <Box flex={1} height={'80%'}>

                    <MentionInput
                      partTypes={[
                        {
                          trigger:'@',
                          renderSuggestions,
                          textStyle:{ fontWeight:'bold', color: theme.colors.primaryColor },
                          isInsertSpaceAfterMention: true,
                          pattern: /(@\w+)/g
                        }
                      ]}

                      
                      
                      value={text} onChange={handleTextChange} containerStyle={{ minHeight: 80,  paddingHorizontal: 10, }} style={{ fontFamily: 'RedRegular', fontSize: 14, color: theme.colors.textColor  }} placeholderTextColor={theme.colors.textColor} placeholder={isReply ? `@${username}`:'Write your comment here...'} multiline numberOfLines={2} onKeyPress={handleTextInputKeyPress} 
                    />

                </Box>

                <Box width={'100%'} height={40} flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='s'>
                    <Box flexDirection='row'>
                        <Ionicons name='images-outline' onPress={pickImage} size={20} color={theme.colors.lightGrey} />
                        <Ionicons name='happy-outline' onPress={() => setShowEmojis(prev => !prev)} size={20} color={ showEmojis ? theme.colors.primaryColor : theme.colors.lightGrey} style={{ marginLeft: 10 }} />
                    </Box>
                    <CustomButton title={buttonText} width={53} height={28} color={theme.colors.primaryColor} textColor='white' onPress={() => onSubmit()} isLoading={isLoading} />
                </Box>

            </Box>

           
{/* 
           { text.startsWith('@') && (
                <Box position='absolute' zIndex={10} top={-200} left={0} width={'100%'} height={200} borderTopRightRadius={20} borderTopLeftRadius={20} bg='secondaryBackGroundColor' borderWidth={0.5} borderColor='lightGrey'>
                      <ScrollView contentContainerStyle={{ padding: 20 }}>
                        {mentionedUsers.map(user => (
                          <CustomText variant='body' onPress={() => handleSelectMention(user)} key={user}>{user}</CustomText>
                        ))}
                        
                      </ScrollView>
                </Box>
           )} */}
    </Box>
  )
}

export default CommentTextBox