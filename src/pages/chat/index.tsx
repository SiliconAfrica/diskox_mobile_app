import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import ChatList from '../../components/chats/ChatList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigation';
import ChatSectionHeader from '../../components/chats/ChatSectionHeader';
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { TextInput } from 'react-native-gesture-handler';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import httpService from '../../utils/httpService';
import { URLS } from '../../services/urls';
import CustomText from '../../components/general/CustomText';
import { FlashList } from '@shopify/flash-list';
import { IChatMessage } from '../../models/chatmessages';
import MessageBubble from '../../components/chats/messageBubble';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import mime from 'mime';


const Chat = ({ route }: NativeStackScreenProps<RootStackParamList, 'chat'>) => {
  const theme = useTheme<Theme>();
  const queryClient = useQueryClient();

  // states
  const { userId, last_seen, profile_image, username } = route.params;
  const [page, setPage] = React.useState(0);
  const [message, setMessage] = React.useState('');
  const [image, setImage] = React.useState<Array<ImagePicker.ImagePickerAsset>>([]);
  const [chats, setChats] = React.useState<Array<IChatMessage>>([]);
  const [search, setSearch] = React.useState('');

  // query
  const getMessages = useQuery(['getMessages', userId], () => httpService.get(`${URLS.GET_CHAT_MESSAGES}/${userId}`), {
    onSuccess: (data) => {
      // console.log(data.data);
      setChats(data.data.data);
    },
  });

  const getUser = useQuery(['getChatUser', userId], () => httpService.get(`${URLS.GET_USER_BY_USERNAME}/${username}`), {
    onSuccess: (data) => {
      console.log(data.data);
    },
  });

  // mutations
  const sendMessage = useMutation({
    mutationFn: (data: FormData) => httpService.post(`${URLS.POST_CHAT_MESSAGE}`, data),
    onSuccess: (data) => {
      alert('Message sent!');
      queryClient.invalidateQueries(['getMessages']);
      setMessage('');
    },
    onError: (error: any) => {
      alert(error.message);
    }
  });

  // functions 
  const filterMessages = React.useCallback(() => {
    const msgs = chats.sort((a: IChatMessage, b: IChatMessage) => {
      if (a.created_at > b.created_at) {
        return 1;
      } else {
        return -1;
      }
      return 0;
    });
    return msgs;
  }, [chats]);

  const pickImage = React.useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['image/*'],
      multiple: false,
      copyToCacheDirectory: true,
    });
    if (result.type === 'success') {
      console.log(result);
      const formData = new FormData();
      // formData.append('message', 'image post');
      formData.append('receiver_id', userId.toString());
      formData.append('chat_images[]', { uri: result.uri, type: result.mimeType, name: result.name } as any);
      sendMessage.mutate(formData);
    }
  }, []);

  if (!getMessages.isLoading && getMessages.isError) {
    return (
      <Box flex={1} backgroundColor='mainBackGroundColor' justifyContent='center' alignItems='center'>
        <CustomText variant='body'>An Error occurred while getting yourr messgaes!</CustomText>
      </Box>
    )
  }

  const handleSubmit = React.useCallback(() => {
    if (message.length < 1 || sendMessage.isLoading) {
      return;
    }
    const formData = new FormData();
    formData.append('message', message);
    formData.append('receiver_id', userId.toString());
    if (image.length > 0) {
      formData.append('chat_images[]', image[0] as any);
    }
    sendMessage.mutate(formData);
  }, [message])

  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <ChatSectionHeader last_seen={last_seen} userId={userId} username={username} profile_image={profile_image} />

      {/* CHAT AREA */}
      <Box flex={1}>
        { getMessages.isLoading && (
          <Box flex={1} justifyContent='center' alignItems='center'>
            <ActivityIndicator size='small' color={theme.colors.primaryColor} />
            <CustomText variant='body'>Loading Messages</CustomText>
          </Box>
        )}
        {
          !getMessages.isLoading && (
              <FlashList 
                contentContainerStyle={{ padding: 20 }}
                estimatedItemSize={100}
                keyExtractor={(item, i)=> i.toString()}
                data={filterMessages()}
                renderItem={({ item }) => (
                  <MessageBubble {...item} />
                )}
              />
          )
        }
      </Box>

      {/* TEXTBOX AREA */}
      <Box width='100%' height={100} flexDirection='row' borderTopWidth={2} borderTopColor='secondaryBackGroundColor' alignItems='center' justifyContent='space-between' paddingHorizontal='m'>
          <Ionicons onPress={pickImage} name='images-outline' size={25} color={theme.colors.textColor} />

          <Box flex={0.9} height={50} maxHeight={200} justifyContent='center' borderWidth={2} borderColor='secondaryBackGroundColor' borderRadius={25} backgroundColor='secondaryBackGroundColor'>
              <TextInput value={message} onChangeText={(e) => setMessage(e)} textAlignVertical='center'  multiline placeholder='Type your message here' placeholderTextColor={theme.colors.textColor} style={{ flex: 1, height: 50, maxHeight: 200, paddingHorizontal: 10, fontFamily: 'RedRegular', color: theme.colors.textColor }} />
          </Box>

          <Pressable onPress={handleSubmit} style={{ ...style.sendButton, backgroundColor: theme.colors.primaryColor}} >
            <Ionicons name='send-outline' size={20} color='white' />
          </Pressable>
      </Box>
    </Box>
  )
}

const style = StyleSheet.create({
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Chat