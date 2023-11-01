import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import Box from '../../components/general/Box'
import ChatList from '../../components/chats/ChatList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/MainNavigation';
import ChatSectionHeader from '../../components/chats/ChatSectionHeader';
import { Ionicons, Feather } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import httpService from '../../utils/httpService';
import { URLS } from '../../services/urls';
import CustomText from '../../components/general/CustomText';
import { FlashList } from '@shopify/flash-list';
import { IChatMessage, IPost_Image } from '../../models/chatmessages';
import MessageBubble from '../../components/chats/messageBubble';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import mime from 'mime';
import MediaCard from '../../components/createpost/MediaCard';
import { extract_day } from '../../utils/utils';
import moment from 'moment';
import ViewImageModal from '../../components/modals/ViewImageModal';
import pusher from '../../utils/pusher';
import { PusherEvent } from '@pusher/pusher-websocket-react-native';
import { useDetailsState } from '../../states/userState';

enum FILE_TYPE {
  IMAGE,
  DOC
}

const currentDate = moment(); // Current date
const previousDate = moment().subtract(1, 'day').format('MMMM DD YYYY'); 


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
  const [files, setFiles] = React.useState([]);
  const [showPickerModal, setShowPickerModal] = React.useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [fileType, setFileType] = React.useState(FILE_TYPE.IMAGE);
  const [showImagesModal, setShowImagesModals] = React.useState(false);
  const [activeImages, setActiveImages] = React.useState<Array<IPost_Image>>([]);
  const { id: loggedUser } = useDetailsState((state) => state);

  // query
  const getMessages = useQuery(['getMessages', userId], () => httpService.get(`${URLS.GET_CHAT_MESSAGES}/${userId}`), {
    onSuccess: (data) => {
      // console.log(data.data);
      setChats(data.data.data);
    },
  });

  React.useEffect(() => {
   (async function() {
   const uMessage = await pusher.subscribe({
      channelName: `private.send_message.${loggedUser}`,
      onEvent: (event: PusherEvent) => {
        console.log('---SEND MESSAGE---');
        console.log(event);
      }
    });


    pusher.subscribe({
      channelName: `private.delete_message.${loggedUser}`,
      onEvent: (event: PusherEvent) => {
        console.log('---DELETE MESSAGE---');
        console.log(event);
      }
    })

    pusher.subscribe({
      channelName: `react_to.${loggedUser}`,
      onEvent: (event: PusherEvent) => {
        console.log('---REACTION---');
        console.log(event);
      }
    })
   })()
    
    return () => {
      
    }
  }, [])

  const getUser = useQuery(['getChatUser', userId], () => httpService.get(`${URLS.GET_USER_BY_USERNAME}/${username}`), {
    onSuccess: (data) => {
      console.log(data.data);
    },
  });

  // mutations
  const sendMessage = useMutation({
    mutationFn: (data: FormData) => httpService.post(`${URLS.POST_CHAT_MESSAGE}`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['getMessages']);
      setMessage('');
      setFileType(null);
      setFiles([]);
    },
    onError: (error: any) => {
      alert(error.message);
    }
  });

  // functions 
  const openImagesModal = React.useCallback((data: IPost_Image[]) => {
    setActiveImages(data);
    setShowImagesModals(true)
  }, [])
  const filterMessages = React.useCallback(() => {
    if (chats?.length < 1) {
      return [];
    }
    const msgs = chats?.sort((a: IChatMessage, b: IChatMessage) => {
      if (a.created_at > b.created_at) {
        return 1;
      } else {
        return -1;
      }
      return 0;
    });
    return msgs;
  }, [chats]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: false,
    });
  
    if (!result.canceled) {
      const name = result.assets[0].uri.split('/').pop();
      const mimeType = mime.getType(result.assets[0].uri);
      setFiles(prev => [...prev,  { uri: result.assets[0].uri, type: mimeType, name }]);
      setFileType(FILE_TYPE.IMAGE);
      setShowPickerModal(false);
    }
  };

  const pickDoc = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword'],
      multiple: false,
    });

    if (result.type === 'success') {
      const name = result.name;
      const type = mime.getType(result.uri);
      const uri = result.uri;
      setFiles(prev => [...prev, { name, type, uri}]);
      setFileType(FILE_TYPE.DOC);
      setShowPickerModal(false);
    }
  };

  if (!getMessages.isLoading && getMessages.isError) {
    return (
      <Box flex={1} backgroundColor='mainBackGroundColor' justifyContent='center' alignItems='center'>
        <CustomText variant='body'>An Error occurred while getting your messgaes!</CustomText>
      </Box>
    )
  }

  const handleSubmit = React.useCallback(() => {
    if (sendMessage.isLoading) return;
    const formData = new FormData();
    formData.append('message', message);
    formData.append('receiver_id', userId.toString());
    if (fileType === FILE_TYPE.IMAGE) {
      files.map((item, i) => {
        formData.append('chat_images[]', item);
      })
    } else {
      files.map((item, i) => {
        formData.append('chat_files[]', item);
      })
    }
    // if (image.length > 0) {
    //   formData.append('chat_images[]', image[0] as any);
    // }
    sendMessage.mutate(formData);
  }, [message]);

  const handleMediaDelete = React.useCallback(
    ({ index, clearAll }: { index: number; clearAll: boolean }) => {
      if (clearAll) {
        setFiles([]);
        return;
      }
      setFiles(files.filter((item, i) => i !== index));
    },
    [files]
  );

  const groupChatMessagesByDate = () => {
    if (chats?.length < 1) {
      return [];
    }
    const groupedMessages: { [key: string]: IChatMessage[] } = {};
  
    filterMessages()?.forEach((message, index) => {
      const currentDate = moment(message.created_at).format("YYYY-MM-DD");
      const previousDate = index > 0 ? moment(chats[index - 1].created_at).format("YYYY-MM-DD") : null;
  
      if (currentDate !== previousDate) {
        groupedMessages[currentDate] = [message];
      } else {
        groupedMessages[currentDate].push(message);
      }
    });
  
    return groupedMessages;
  };

  // Render the grouped chat messages
const groupedMessages = groupChatMessagesByDate();


  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      {/* MODALS */}
      <ViewImageModal isVisisble={showImagesModal} images={activeImages} onClose={() => setShowImagesModals(false)} />

      <ChatSectionHeader last_seen={last_seen} userId={userId} username={username} profile_image={profile_image} />

      {/* CHAT AREA */}
      <Box flex={1}>
        { getMessages.isLoading && (
          <Box flex={1} justifyContent='center' alignItems='center'>
            <ActivityIndicator size='small' color={theme.colors.primaryColor} />
            <CustomText variant='body'>Loading Messages</CustomText>
          </Box>
        )}
          <ScrollView contentContainerStyle={{ padding: 20 }}>
          {Object.keys(groupedMessages).length > 0 && Object.keys(groupedMessages).map((date) => (
            <React.Fragment key={date}>
              <CustomText textAlign="center" marginVertical='m'>
                { moment(date).subtract(1, 'day').format('MMM DD, YYYY') === previousDate && 'Yesterday'}
                { moment(date).format("MMMM DD, YYYY") === moment().format("MMMM DD, YYYY") && "Today" }
                { moment(date).format('MMMM DD YYYY') !== previousDate && moment(date).format('MMMM DD YYYY') !== moment().format('MMMM DD YYYY') && moment(date).format('MMMM DD YYYY') }
                {/* {moment(date).format("MMMM DD, YYYY") === moment().format("MMMM DD, YYYY") ? "Today" : moment(date).format("MMMM DD, YYYY")} */}
              </CustomText>
              {groupedMessages[date].map((message) => (
                <MessageBubble key={message.id} {...message} openModal={openImagesModal} />
              ))}
            </React.Fragment>
          ))}
              {
                getMessages.isLoading && (
                  <Box alignItems='center' justifyContent='center' width='100%' height={40}>
                    <ActivityIndicator size={'small'} color={theme.colors.primaryColor} />
                  </Box>
                )
              }

          </ScrollView>

          {files.length > 0 && (
            <Box width={'100%'} height={130} borderTopWidth={2} borderTopColor='secondaryBackGroundColor'>
              <ScrollView horizontal contentContainerStyle={{ alignItems: 'center', paddingLeft: 0, paddingRight: 100 }}>
                {files.map((item, index) => (
                  <MediaCard width={100} height={'70%'} file={item} index={index} onDelete={handleMediaDelete} key={index} />
                ))}
                 {files.length < 10 && (
              <Pressable style={{
                marginLeft: 20,
                width: 100, height: '70%',
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: theme.colors.secondaryBackGroundColor,
              }}
                onPress={() => {
                  if (fileType === FILE_TYPE.IMAGE) {
                    pickImage();
                  } else {
                    pickDoc();
                  }
                }}
              >
                <CustomText variant='xs'>{fileType === FILE_TYPE.DOC ? 'Add Doc':'Add File'}</CustomText>
                <Feather name={fileType === FILE_TYPE.IMAGE ? 'image' : 'file'} size={40} color={theme.colors.textColor} />
              </Pressable>
            )}
              </ScrollView>
            </Box>
          )}

      </Box>

      {/* TEXTBOX AREA */}
      <Box width='100%' height={100} flexDirection='row' borderTopWidth={2} borderTopColor='secondaryBackGroundColor' alignItems='center' justifyContent='space-between' paddingHorizontal='m' position='relative'>

         { showPickerModal && (
           <Box position='absolute' width={200} height={100} backgroundColor='secondaryBackGroundColor' zIndex={5} borderRadius={10} left={20} bottom={70} paddingHorizontal='m'>
           <Pressable onPress={pickImage} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1 }}>
             <Feather name='image' size={25} color={theme.colors.textColor} />
             <CustomText  marginLeft='s'>Photos & Video</CustomText>
           </Pressable>

           <Pressable onPress={pickDoc} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flex: 1 }}>
             <Feather name='file' size={25} color={theme.colors.textColor} />
             <CustomText marginLeft='s'>Document</CustomText>
           </Pressable>
         </Box>
         )}

          { files.length === 0 && (
            <Ionicons onPress={() => setShowPickerModal(prev => !prev)} name='images-outline' size={25} color={theme.colors.textColor} />
          )}

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