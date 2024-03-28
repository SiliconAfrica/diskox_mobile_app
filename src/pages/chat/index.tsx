import {ActivityIndicator, Pressable, StyleSheet, TouchableWithoutFeedback,} from "react-native";
import React, {useEffect} from "react";
import Box from "../../components/general/Box";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../navigation/MainNavigation";
import ChatSectionHeader from "../../components/chats/ChatSectionHeader";
import {Feather, Ionicons} from "@expo/vector-icons";
import {useTheme} from "@shopify/restyle";
import {Theme} from "../../theme";
import {ScrollView, TextInput} from "react-native-gesture-handler";
import {useMutation, useQuery, useQueryClient} from "react-query";
import httpService from "../../utils/httpService";
import {URLS} from "../../services/urls";
import CustomText from "../../components/general/CustomText";
import {IChatMessage, IPost_Image, UNsentMessage,} from "../../models/chatmessages";
import MessageBubble from "../../components/chats/messageBubble";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import mime from "mime";
import MediaCard from "../../components/createpost/MediaCard";
import moment from "moment";
import ViewImageModal from "../../components/modals/ViewImageModal";
import {useDetailsState} from "../../states/userState";
import SelectedChatBottom from "../../components/modals/SelectedChatBottom";
import {useNavigation} from "@react-navigation/native";
import {PageType} from "../login";
import {uniqBy} from "lodash";
import {CUSTOM_STATUS_CODE} from "../../enums/CustomCodes";
import {IUser} from "../../models/user";
import {Image} from "expo-image";
import {ResizeMode, Video} from 'expo-av';
import Emojipicker from "../../components/general/emojipicker";

enum FILE_TYPE {
  IMAGE,
  DOC,
  VIDEO = 2,
}

export type IFile = {
  type: string;
  name: string;
  uri: string;
};

export interface ISelectedMessageAction {
  selected: boolean;
  reply: boolean;
  edit: boolean;
  delete: boolean;
}

interface TempMessage {
  date: string;
  message: string;
  files: IFile[];
}

const currentDate = moment(); // Current date
const previousDate = moment().subtract(1, "day").format("MMMM DD YYYY");

const Chat = ({
  route,
}: NativeStackScreenProps<RootStackParamList, "chat">) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const queryClient = useQueryClient();
  const scrollViewRef = React.useRef<ScrollView>(null)

  // states
  const { userId, last_seen, profile_image, username } = route.params;
  const [page, setPage] = React.useState(0);
  const [message, setMessage] = React.useState("");
  const [selectedMessage, setSelectedMessage] = React.useState<
    Partial<IChatMessage>
  >({});

  const [selectedMessageAction, setSelectedMessageAction] =
    React.useState<ISelectedMessageAction>({
      selected: false,
      reply: false,
      edit: false,
      delete: false,
    });
  const [image, setImage] = React.useState<Array<ImagePicker.ImagePickerAsset>>(
    []
  );
  const [chats, setChats] = React.useState<Array<IChatMessage>>([]);
  const [previous, setPrevious] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [files, setFiles] = React.useState<IFile[]>([]);
  const [showPickerModal, setShowPickerModal] = React.useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [fileType, setFileType] = React.useState(null);
  const [showImagesModal, setShowImagesModals] = React.useState(false);
  const [activeImages, setActiveImages] = React.useState<Array<IPost_Image>>(
    []
  );
  const [tempMessages, setTempMessages] = React.useState<TempMessage[]>([]);

  const [user, setUser] = React.useState<IUser>(null);
  const [unsent, seetUnsent] = React.useState<UNsentMessage[]>([]);
  const [showSmiley, setShowSmiley] = React.useState(false);
  const { id: loggedUser } = useDetailsState((state) => state);
  const [selection, setSelection] = React.useState({ start: 0, end: 0});


  const unselectMessage = (closereply?: boolean) => {
    setSelectedMessageAction((prev) => ({
      selected: false,
      reply: closereply ? false : prev.reply,
      edit: false,
      delete: false,
    }));
  };
  // query
  const getMessages = useQuery(
    ["getMessages", userId],
    () => httpService.get(`${URLS.GET_CHAT_MESSAGES}/${userId}`),
    {
      refetchInterval: 1000,
      onSuccess: (data) => {
        if (data.data.code === CUSTOM_STATUS_CODE.SUCCESS) {
          const messages: IChatMessage[] = data.data?.data;
          const arr = uniqBy([...chats, ...messages], 'id')
          if (chats.length < 1) {
            setChats(arr);
            if (scrollViewRef.current) {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }
          } 
          if (arr.length > chats.length) {
            setChats(arr);
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }
          setChats(arr);

          if (arr.length > previous && tempMessages.length > 0) {
            setTempMessages([]);
          }
        }
        
      },
    }
  );

  const getUser = useQuery(
    ["getChatUser", userId],
    () => httpService.get(`${URLS.GET_USER_BY_ID}/${userId}`),
    {
      onSuccess: (data) => {
        setUser(data.data.data);
        // alert(JSON.stringify(data.data.data));
      },
    }
  );

  // mutations
  const sendMessage = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.POST_CHAT_MESSAGE}`, data),
    onSuccess: (data) => {
      setPrevious(chats.length);
      queryClient.invalidateQueries(["getMessages"]);
      setMessage("");
      setFileType(null);
      setFiles([]);
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });
  const editMessage = useMutation({
    mutationFn: (data: any) =>
      httpService.put(
        `${URLS.UPDATE_CHAT_MESSAGE}/${selectedMessage.id}`,
        data
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["getMessages"]);
      setMessage("");
      setFileType(null);
      setFiles([]);
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  useEffect(() => {
    if (selectedMessageAction.edit === true) {
      setMessage(selectedMessage.message);
    }
  }, [selectedMessageAction]);


  // functions
  const openImagesModal = React.useCallback((data: IPost_Image[]) => {
    setActiveImages(data);
    setShowImagesModals(true);
  }, []);

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
      mediaTypes: fileType === null ? ImagePicker.MediaTypeOptions.All : fileType === FILE_TYPE.IMAGE ? ImagePicker.MediaTypeOptions.Images:ImagePicker.MediaTypeOptions.Videos,
      base64: false,
      allowsMultipleSelection: files.length > 0,
    });

    if (!result.canceled) {
      if (result.assets.length === 1) {
        const name = result.assets[0].uri.split("/").pop();
        const mimeType = mime.getType(result.assets[0].uri);
        if (mimeType.includes('image')) {
          setFileType(FILE_TYPE.IMAGE)
        }
        if (mimeType.includes('video')) {
          setFileType(FILE_TYPE.VIDEO);
        }
      }
      //
      // const name = result.assets[0].uri.split("/").pop();
      // const mimeType = mime.getType(result.assets[0].uri);
        const arr = [...files];
        result.assets.map((item) => {
          arr.push({ uri: item.uri, type: mime.getType(item.uri), name: item.uri.split('/').pop() })
        });

        if (arr.length > 10) {
          const newArr = arr.splice(0, 10);
          setFiles(newArr);
        } else {
          setFiles(arr);
        }
      // setFileType(FILE_TYPE.IMAGE);
      setShowPickerModal(false);
    }
  };

  const pickDoc = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "application/msword"],
      multiple: true,

    });

    if (!result.canceled) {

      const arr = [...files];
      result.assets.map((item) => {
        arr.push({ uri: item.uri, type: mime.getType(item.uri), name: item.uri.split('/').pop() })
      });

      setFileType(FILE_TYPE.DOC);

      if (arr.length > 10) {
        const newArr = arr.splice(0, 10);
        setFiles(newArr);
      } else {
        setFiles(arr);
      }
      setShowPickerModal(false);
    }
  };

  if (!getMessages.isLoading && getMessages.isError) {
    return (
      <Box
        flex={1}
        backgroundColor="mainBackGroundColor"
        justifyContent="center"
        alignItems="center"
      >
        <CustomText variant="body">
          An Error occurred while getting your messgaes!
        </CustomText>
      </Box>
    );
  }

  const handleSubmit = React.useCallback(() => {
    if (sendMessage.isLoading) return;
    const formData = new FormData();
    formData.append("message", message);
    formData.append("receiver_id", userId.toString());
    if (fileType === FILE_TYPE.IMAGE) {
      files.map((item, i) => {
        formData.append("chat_images[]", item as any);
      });
    } else if (fileType === FILE_TYPE.DOC) {
      files.map((item, i) => {
        formData.append("chat_files[]", item as any);
      });
    } else {
      files.map((item, index) => {
        formData.append('chat_videos[]', item as any);
      })
    }
    // if (image.length > 0) {
    //   formData.append('chat_images[]', image[0] as any);
    // }
    if (selectedMessageAction.edit === true) {
      editMessage.mutate({ message });
    } else {
      setTempMessages((prev) => [...prev, {
        message,
        files,
        date: new Date().toISOString(),
      }])
      sendMessage.mutate(formData);
      setMessage('');
      setFiles([]);
    }
  }, [message, selectedMessageAction, fileType, files]);

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

  const handleEmojiPicked = React.useCallback((emoji: string) => {
    const { start, end } = selection;

    // Create the new text with inserted content
    const insertedText = 'Your text to insert';
    const updatedText = `${message.substring(0, start)}${emoji}${message.substring(end)}`;
    setMessage(updatedText);
    setShowSmiley(false);
  }, [setMessage, message, selection]);

  const groupChatMessagesByDate = () => {
    if (chats?.length < 1) {
      return [];
    }
    const groupedMessages: { [key: string]: IChatMessage[] } = {};

    filterMessages()?.forEach((message, index) => {
      const currentDate = moment(message.created_at).format("YYYY-MM-DD");
      const previousDate =
        index > 0
          ? moment(chats[index - 1].created_at).format("YYYY-MM-DD")
          : null;

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

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (!selectedMessageAction.selected) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }
        e.preventDefault();
        unselectMessage(true);
      }),
    [navigation, selectedMessageAction]
  );
  return (
    <TouchableWithoutFeedback onPress={() => unselectMessage}>
      <Box flex={1} backgroundColor="mainBackGroundColor">
        {/* MODALS */}
        <ViewImageModal
          isVisisble={showImagesModal}
          images={activeImages}
          onClose={() => setShowImagesModals(false)}
        />

        <ChatSectionHeader
          last_seen={user?.last_seen}
          userId={userId}
          username={user?.username}
          profile_image={user?.profile_image}
        />

        {/* CHAT AREA */}
        <Box flex={1}>
          {getMessages.isLoading && (
            <Box flex={1} justifyContent="center" alignItems="center">
              <ActivityIndicator
                size="small"
                color={theme.colors.primaryColor}
              />
              <CustomText variant="body">Loading Messages</CustomText>
            </Box>
          )}
          <ScrollView contentContainerStyle={{ padding: 20 }} ref={scrollViewRef}>
            {Object.keys(groupedMessages).length > 0 &&
              Object.keys(groupedMessages).map((date) => (
                <React.Fragment key={date}>
                  <CustomText textAlign="center" marginVertical="m">
                    {moment(date).subtract(1, "day").format("MMM DD, YYYY") ===
                      previousDate && "Yesterday"}
                    {moment(date).format("MMMM DD, YYYY") ===
                      moment().format("MMMM DD, YYYY") && "Today"}
                    {moment(date).format("MMMM DD YYYY") !== previousDate &&
                      moment(date).format("MMMM DD YYYY") !==
                        moment().format("MMMM DD YYYY") &&
                      moment(date).format("MMMM DD YYYY")}
                    {/* {moment(date).format("MMMM DD, YYYY") === moment().format("MMMM DD, YYYY") ? "Today" : moment(date).format("MMMM DD, YYYY")} */}
                  </CustomText>
                  {groupedMessages[date].map((message) => (
                    <MessageBubble
                      key={message.id}
                      theMessage={message}
                      selectedMessage={selectedMessage}
                      setSelectedMessage={setSelectedMessage}
                      selectedMessageAction={selectedMessageAction}
                      unselectMessage={unselectMessage}
                      setSelectedMessageAction={setSelectedMessageAction}
                      {...message}
                      openModal={openImagesModal}
                    />
                  ))}
                </React.Fragment>
              ))}

            {tempMessages.length > 0 && (
                <Box width={'100%'} alignItems={'flex-end'}>
                  {tempMessages.map((item, index) => (
                      <Box zIndex={10}
                           maxWidth="70%"
                           minWidth="10%"
                           marginBottom="m"
                           borderTopRightRadius={10}
                           borderTopLeftRadius={10}
                           borderBottomLeftRadius={10}
                           borderBottomRightRadius={0}
                           padding={'s'}
                           backgroundColor={'secondaryBackGroundColor'}
                      >
                        {item.files.length > 0 && fileType === FILE_TYPE.IMAGE && (
                            <Box height={140}>
                              <ScrollView horizontal={true} style={{ width: '100%'}}>
                                { item.files.map((item, index) => (
                                    <Pressable

                                        style={{
                                          width: 150,
                                          maxHeight: 120,
                                          overflow: "hidden",
                                          borderRadius: 10,
                                          marginRight: 20,
                                        }}
                                        key={index.toString()}
                                    >
                                      <Image
                                          source={{ uri: item.uri }}
                                          style={{ width: "100%", height: "100%" }}
                                          contentFit="cover"
                                      />
                                    </Pressable>
                                ))}
                              </ScrollView>
                            </Box>
                        )}
                        {item.files.length > 0 && fileType === FILE_TYPE.VIDEO && (
                            <Box height={140}>
                              <ScrollView style={{ width: '100%'}}>
                                { item.files.map((item, index) => (
                                    <Pressable

                                        style={{
                                          width: 150,
                                          maxHeight: 120,
                                          overflow: "hidden",
                                          borderRadius: 10,
                                          marginRight: 20,
                                        }}
                                        key={index.toString()}
                                    >
                                      <Video
                                          source={{ uri: item.uri }}
                                          style={{ width: "100%", height: "100%" }}
                                          resizeMode={ResizeMode.COVER}
                                      />
                                    </Pressable>
                                ))}
                              </ScrollView>
                            </Box>
                        )}
                        {item.files.length > 0 && fileType === FILE_TYPE.DOC && (
                            <Box height={140}>
                              <ScrollView horizontal={true} style={{ width: '100%'}}>
                                { item.files.map((item, index) => (
                                    <Pressable

                                        style={{
                                          width: 150,
                                          maxHeight: 120,
                                          overflow: "hidden",
                                          borderRadius: 10,
                                          marginRight: 20,
                                        }}
                                        key={index.toString()}
                                    >
                                      <CustomText marginRight="m">{item.name.split('.')[1]}</CustomText>
                                      <Feather
                                          name="download-cloud"
                                          size={25}
                                          color={theme.colors.textColor}
                                      />
                                    </Pressable>
                                ))}
                              </ScrollView>
                            </Box>
                        )}
                        <CustomText
                            variant="body"
                            fontSize={15}
                        >
                          {item.message}
                        </CustomText>

                        <Box flexDirection={'row'} marginTop={'s'}>
                          <CustomText variant={'xs'} color={'lightGrey'} marginRight={'s'}>{moment(item.date).startOf('s').fromNow()}</CustomText>
                          {/*<Ionicons*/}
                          {/*    name="checkmark-circle-sharp"*/}
                          {/*    size={15}*/}
                          {/*    color={theme.colors.primaryColor}*/}
                          {/*/>*/}
                        </Box>
                      </Box>
                  ))}
                </Box>
            )}
            { user?.iBlocked === 1 && (
                <Box width={'100%'} height={40} alignItems={'center'} justifyContent={'center'} marginTop={'m'}>
                  <CustomText variant={'subheader'} fontSize={16}>You have blocked this contact</CustomText>
                  <CustomText variant={"body"} color={'lightGrey'}>You cannot send or recieve messages from this user</CustomText>
                </Box>
            )}
          </ScrollView>

          {files.length > 0 && (
            <Box
              width={"100%"}
              height={130}
              borderTopWidth={2}
              borderTopColor="secondaryBackGroundColor"
            >
              <ScrollView
                horizontal
                contentContainerStyle={{
                  alignItems: "center",
                  paddingLeft: 0,
                  paddingRight: 100,
                }}
              >
                {files.map((item, index) => (
                  <MediaCard
                    width={100}
                    height={"70%"}
                    file={item}
                    index={index}
                    onDelete={handleMediaDelete}
                    key={index}
                  />
                ))}
                {files.length < 10 && (
                  <Pressable
                    style={{
                      marginLeft: 20,
                      width: 100,
                      height: "70%",
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: theme.colors.secondaryBackGroundColor,
                    }}
                    onPress={() => {
                      if (fileType === FILE_TYPE.IMAGE || fileType === FILE_TYPE.VIDEO) {
                        pickImage();
                      } else  {
                        pickDoc();
                      }
                    }}
                  >
                    <CustomText variant="xs">
                      {fileType === FILE_TYPE.DOC ? "Add Doc" : "Add File"}
                    </CustomText>
                    <Feather
                      name={fileType === FILE_TYPE.IMAGE ? "image" : "file"}
                      size={40}
                      color={theme.colors.textColor}
                    />
                  </Pressable>
                )}
              </ScrollView>
            </Box>
          )}
        </Box>
        {selectedMessage.id && selectedMessageAction.selected === true ? (
          <SelectedChatBottom
            selectedMessage={selectedMessage}
            setSelectedMessageAction={setSelectedMessageAction}
            unselectMessage={unselectMessage}
          />
        ) : (
          <>
            {selectedMessageAction.reply && (
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                padding="m"
                borderTopWidth={0.2}
                borderBottomWidth={0.2}
                borderColor="grey"
                backgroundColor="secondaryBackGroundColor"
              >
                <Box width="90%">
                  <CustomText>
                    Replying {selectedMessage.sender_user?.username}
                  </CustomText>
                  <CustomText color="grey">
                    {selectedMessage.message}
                  </CustomText>
                </Box>
                <Box width="8%">
                  <Box
                    width={30}
                    height={30}
                    borderRadius={20}
                    backgroundColor="lightGrey"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Ionicons
                      name="close"
                      onPress={() => unselectMessage(true)}
                      size={20}
                      color={theme.colors.black}
                    />
                  </Box>
                </Box>
              </Box>
            )}
            {/* TEXTBOX AREA */}
            <Box
              width="100%"
              height={100}
              flexDirection="row"
              borderTopWidth={2}
              borderTopColor="secondaryBackGroundColor"
              alignItems="center"
              justifyContent="space-between"
              paddingHorizontal="m"
              position="relative"
            >
              {showPickerModal && (
                <Box
                  position="absolute"
                  width={200}
                  height={100}
                  backgroundColor="secondaryBackGroundColor"
                  zIndex={5}
                  borderRadius={10}
                  left={20}
                  bottom={70}
                  paddingHorizontal="m"
                >
                  <Pressable
                    onPress={pickImage}
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Feather
                      name="image"
                      size={25}
                      color={theme.colors.textColor}
                    />
                    <CustomText marginLeft="s">Photos & Video</CustomText>
                  </Pressable>

                  <Pressable
                    onPress={pickDoc}
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Feather
                      name="file"
                      size={25}
                      color={theme.colors.textColor}
                    />
                    <CustomText marginLeft="s">Document</CustomText>
                  </Pressable>
                </Box>
              )}

              {files.length === 0 && (
                <Ionicons
                  onPress={() => setShowPickerModal((prev) => !prev)}
                  name="images-outline"
                  size={25}
                  color={theme.colors.textColor}
                />
              )}

              { showSmiley && (
                  <Box width='100%' maxHeight={300} overflow={'hidden'} borderRadius={10} position='absolute' zIndex={30} top={-200} bottom={80} >
                    <Emojipicker onSelected={(e) => handleEmojiPicked(e)} />
                  </Box>
              )}

              <Box
                flex={0.9}
                height={50}
                maxHeight={200}
                justifyContent="center"
                borderWidth={2}
                borderColor="secondaryBackGroundColor"
                borderRadius={25}
                backgroundColor="secondaryBackGroundColor"
                flexDirection={'row'}
                alignItems={'center'}
                paddingLeft={'s'}
              >
                <Feather
                  name={'smile'}
                  color={showSmiley ? theme.colors.primaryColor:theme.colors.textColor}
                  size={25}
                  onPress={() => setShowSmiley((prev) =>!prev)}
                />
                <TextInput
                  value={message}
                  onChangeText={(e) => setMessage(e)}
                  textAlignVertical="center"
                  multiline
                  placeholder="Type your message here"
                  placeholderTextColor={theme.colors.textColor}
                  onSelectionChange={(e) => setSelection({ start: e.nativeEvent.selection.start, end: e.nativeEvent.selection.end})}
                  style={{
                    flex: 1,
                    height: 50,
                    maxHeight: 200,
                    paddingHorizontal: 10,
                    fontFamily: "RedRegular",
                    color: theme.colors.textColor,
                  }}
                />
              </Box>

              <Pressable
                onPress={handleSubmit}
                style={{
                  ...style.sendButton,
                  backgroundColor: theme.colors.primaryColor,
                }}
              >
                <Ionicons name="send" size={20} color="white" />
              </Pressable>
            </Box>
          </>
        )}
      </Box>
    </TouchableWithoutFeedback>
  );
};

const style = StyleSheet.create({
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chat;
