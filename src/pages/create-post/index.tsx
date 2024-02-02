import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
import Box from "../../components/general/Box";
import SettingsHeader from "../../components/settings/Header";
import { useDetailsState } from "../../states/userState";
import { Image } from "expo-image";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import CustomText from "../../components/general/CustomText";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import FadedButton from "../../components/general/FadedButton";
import TabView, { TAB_BAR_ENUM } from "../../components/createpost/TabView";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import WritePost from "../../components/createpost/WritePost";
import WriteQuestion from "../../components/createpost/WriteQuestion";
import WritePoll from "../../components/createpost/WritePoll";
import * as DocumentPicker from "expo-document-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/MainNavigation";
import TagModal from "../../components/createpost/TagModal";
import { useModalState } from "../../states/modalState";
import { useMutation, useQuery } from "react-query";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import Emojipicker from "../../components/general/emojipicker";
import PrimaryButton from "../../components/general/PrimaryButton";
import useToast from "../../hooks/useToast";
import { Follower } from "../../models/Follower";
import { useCreatePostState } from "./state";
import { useCommentMentionState } from "../../components/feeds/commentState";
import Saveasdraft from "../../components/modals/SavaAsDraft";
import BorderButton from "../../components/general/BorderButton";
import { includes } from "lodash";
import { useGlobalFileState } from "../../states/pickedFileState";
import CommunitiesModal from "../../components/modals/CommunitiesModal";
import { ICommunity } from "../../models/Community";

const CreatePost = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "create-post">) => {
  const { profile_image, name, username, id } = useDetailsState(
    (state) => state
  );

  const { files: PickedFiles, clearFiles } = useGlobalFileState(
    (state) => state
  );

  const theOrigin = route?.params?.origin;
  const communityId = route?.params?.communityId;
  const { setAll, visibility } = useModalState((state) => state);
  const [activeTab, setActive] = React.useState(TAB_BAR_ENUM.POST);
  const [files, setFiles] = React.useState<ImagePicker.ImagePickerAsset[]>([]);
  const [show, setShow] = React.useState(false);
  const [value, setValues] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [pollQuestion, setPollQuestion] = React.useState("");
  const [polls, setPolls] = React.useState(["", ""]);
  const [day, setDay] = React.useState("1 day");
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<Follower[]>([]);
  const [followers, setFollowers] = React.useState<Follower[]>([]);
  const [origin, setOrigin] = React.useState("post");
  const [showModal, setShowModal] = React.useState(false);
  const [status, setStatus] = React.useState<"active" | "draft">("active");
  const [cancel, setCancel] = React.useState(false);
  const [community, setCommunity] = React.useState<ICommunity|null>(null);
  const [showCommunities, setShowCommunities] = React.useState(false)

  const theme = useTheme<Theme>();
  const toast = useToast();
  const { tags, setTags, reset } = useCreatePostState((state) => state);
  const {
    users,
    selectedUsers: selectedMentionedUsers,
    reset: resetMention,
  } = useCommentMentionState((state) => state);

  useEffect(() => {
    if (theOrigin && theOrigin === "community") {
      setOrigin("community");
    } else {
      setOrigin("post");
    }
  }, []);

  useEffect(() => {
    if (PickedFiles.length > 0) {
      setFiles((prev) => [...prev, ...PickedFiles]);
    }
  }, [PickedFiles]);

  // effect for navigation
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!cancel) {
        if (
          value !== "" ||
          question !== "" ||
          pollQuestion !== "" ||
          files.length > 0 ||
          polls.length > 0
        ) {
          e.preventDefault();
          setShowModal(true);
        } else {
          return;
        }
      } else {
        return;
      }
    });
    return unsubscribe;
  }, [navigation, value, question, pollQuestion, files, cancel]);

  React.useEffect(() => {
    (async function () {
      if (status === "draft") {
        handleSubmit();
      }
    })();
  }, [status]);
  // functions
  const editPoll = React.useCallback(
    (e: string, i: number) => {
      const copy = [...polls];
      copy[i] = e;
      setPolls(copy);
    },
    [polls]
  );

  const addPoll = React.useCallback(() => {
    const arr = [...polls, ""];
    setPolls(arr);
  }, [polls]);

  const deletePoll = React.useCallback(
    (i: number) => {
      if (polls.length === 2) {
        return;
      }
      setPolls(polls.filter((_, index) => index !== i));
    },
    [polls]
  );

  React.useEffect(() => {
    setSelectedUsers(
      followers.filter((item) => tags.includes(item.follower.id))
    );
  }, [tags]);

  const { isLoading: followersLoading, isError } = useQuery(
    ["GetFollower", id],
    () => httpService.get(`/fetch_user_followers/${id}`),
    {
      enabled: true,
      onSuccess: (data) => {
        const followersArr: Follower[] = data.data.data.data;
        setFollowers(followersArr);
      },
      onError: (error) => {
        alert(JSON.stringify(error));
      },
    }
  );

  // mutation
  const { isLoading, mutate } = useMutation({
    mutationFn: (data: FormData) => httpService.post("/create_post", data),
    onSuccess: (data) => {
      toast.show("Post created", { type: "success" });
      // clean up
      setFiles([]);
      setValues("");
      setQuestion("");
      setPollQuestion("");
      reset();
      setValues("");
      setCancel(true);
      clearFiles();
      setCommunity(null);
      navigation.goBack();
    },
    onError: (error: any) => {
      toast.show(error?.message, { type: "error" });
    },
  });

  const handleTitle = (tit: string) => {
    if (title.length < 200) {
      setTitle(tit);
    } else if (title.length > tit.length) {
      setTitle(tit);
    }
  };

  const toggleTab = React.useCallback(() => {
    switch (activeTab) {
      case TAB_BAR_ENUM.POST: {
        return (
          <WritePost
            description={value}
            setDescription={setValues}
            files={files}
            handlePicker={handleDocumentPicker as any}
            onDelete={handleMediaDelete}
          />
        );
      }
      case TAB_BAR_ENUM.QUESTION: {
        return (
          <WriteQuestion
            description={question}
            setDescription={setQuestion}
            files={files}
            handlePicker={handleDocumentPicker as any}
            onDelete={handleMediaDelete}
            title={title}
            setTitle={handleTitle}
          />
        );
      }
      case TAB_BAR_ENUM.POLL: {
        return (
          <WritePoll
            description={pollQuestion}
            setDescription={setPollQuestion}
            onDelete={handleMediaDelete}
            files={files}
            handlePicker={handleDocumentPicker as any}
            polls={polls}
            setPolls={editPoll}
            addPoll={addPoll}
            deletePoll={deletePoll}
            day={day}
            setDay={(day) => setDay(day)}
          />
        );
      }
    }
  }, [
    activeTab,
    files,
    value,
    pollQuestion,
    question,
    setQuestion,
    polls,
    day,
    title,
    setTitle,
  ]);

  const handleCheck = React.useCallback((val: number) => {
    setTags(val);
  }, []);

  const handleSubmit = React.useCallback(async () => {
    if (activeTab === TAB_BAR_ENUM.POLL && includes(polls, "")) {
      toast.show("You must full out all poll options", { type: "warning" });
      return;
    }
    const formData = new FormData();
    if (origin === "community") {
      formData.append("community_id", communityId.toString());
    }
    if (community !== null) {
      formData.append("community_id", community.id.toString());
    }
    if (activeTab === TAB_BAR_ENUM.POST) {
      const regex = /@\[\S+]/g;
      const mentionss = value.match(regex) || [];
      const userIds: number[] = [];
      mentionss.forEach((item) => {
        const newItem = item.replace("[", "").replace("]", "");
        const user = selectedMentionedUsers.map((user) => {
          if (
            user.name.toLowerCase().includes(newItem.toLowerCase().substring(1))
          ) {
            userIds.push(user.id);
            return user.id;
          }
        });
      });
      const newText = value.replace(/@\[([^\]]*)\]\(\)/g, "@$1");
      formData.append("mentioned_users[]", userIds as any);
      formData.append("description", newText);
      formData.append("post_type", "post");
    }

    if (activeTab === TAB_BAR_ENUM.QUESTION) {
      const regex = /@\[\S+]/g;
      const mentionss = value.match(regex) || [];
      const userIds: number[] = [];
      mentionss.forEach((item) => {
        const newItem = item.replace("[", "").replace("]", "");
        const user = selectedMentionedUsers.map((user) => {
          if (
            user.name.toLowerCase().includes(newItem.toLowerCase().substring(1))
          ) {
            userIds.push(user.id);
            return user.id;
          }
        });
      });
      const newText = question.replace(/@\[([^\]]*)\]\(\)/g, "@$1");

      formData.append("description", newText);
      formData.append("post_type", "question");
      formData.append("title", title);
      formData.append("mentioned_users[]", userIds as any);
    }

    if (activeTab === TAB_BAR_ENUM.POLL) {
      const regex = /@\[\S+]/g;
      const mentionss = value.match(regex) || [];
      const userIds: number[] = [];
      mentionss.forEach((item) => {
        const newItem = item.replace("[", "").replace("]", "");
        const user = selectedMentionedUsers.map((user) => {
          if (
            user.name.toLowerCase().includes(newItem.toLowerCase().substring(1))
          ) {
            userIds.push(user.id);
            return user.id;
          }
        });
      });
      const newText = pollQuestion.replace(/@\[([^\]]*)\]\(\)/g, "@$1");

      formData.append("description", newText);
      formData.append("post_type", "poll");
      formData.append("poll_duration", day);
      formData.append("mentioned_users[]", userIds as any);
      polls.map((item) => {
        formData.append("polls[]", item);
      });
    }

    formData.append("visibility", visibility);

    //  const ht = value.match(/#\w+/g);
    //  if (ht.length > 0) {
    //   ht.map((item) => {
    //     formData.append('hashtags[]', item as any);
    //   })
    //  }
    if (tags.length > 0) {
      tags.map((item) => {
        formData.append("tags[]", item.toString() as any);
      });
    }
    formData.append("status", status);
    if (files.length > 0) {
      const images = files.filter((item, index) => item.type === "image");
      const videos = files.filter((item, index) => item.type === "video");
      images.map((item) => {
        const name = item.uri.split("/").pop();
        const mimeType = mime.getType(item.uri);
        formData.append("post_images[]", {
          uri: item.uri,
          name: name,
          type: mimeType,
        } as any);
      });
      videos.map((item) => {
        const name = item.uri.split("/").pop();
        const mimeType = mime.getType(item.uri);
        formData.append("post_videos[]", {
          uri: item.uri,
          name: name,
          type: mimeType,
        } as any);
      });
    }
    mutate(formData);
  }, [
    value,
    visibility,
    tags,
    files,
    polls,
    pollQuestion,
    question,
    day,
    activeTab,
    status,
  ]);

  const handleDocumentPicker = React.useCallback(
    async (documentType: "All" | "Images" | "Videos" | null) => {
      if (files.length === 10) {
        alert(`You can't add more than 10 files!`);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions[documentType || "Images"],
        allowsEditing: true,
        base64: false,
      });

      if (!result.canceled) {
        const formData = new FormData();
        const name = result.assets[0].uri.split("/").pop();
        const mimeType = mime.getType(result.assets[0].uri);
        const arr = [...files, result.assets[0]];
        setFiles(arr);
      }
    },
    [files]
  );

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

  const updateTextWithEmoji = React.useCallback(
    (emoji: string) => {
      switch (activeTab) {
        case TAB_BAR_ENUM.POST: {
          setValues((prev) => prev + emoji);
          break;
        }
        case TAB_BAR_ENUM.QUESTION: {
          setQuestion((prev) => prev + emoji);
          break;
        }
        case TAB_BAR_ENUM.POLL: {
          setPollQuestion((prev) => prev + emoji);
          break;
        }
      }
    },
    [activeTab]
  );
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <TagModal
        open={show}
        onClose={() => setShow(false)}
        tags={tags}
        setTags={(tags) => handleCheck(tags)}
      />
      <CommunitiesModal isVisisble={showCommunities} onClose={() => setShowCommunities(false)} activeCommunity={community} setActiveCommunity={(data) =>setCommunity(data)} />
      <Saveasdraft
        isLoading={isLoading}
        isVisible={showModal}
        close={() => {
          setShowModal(false);
          setCancel(true);
          navigation.goBack();
        }}
        action={() => setStatus("draft")}
      />
      <SettingsHeader
        showSave={true}
        onSave={() => {}}
        RightItem={
          <PrimaryButton
            isLoading={isLoading}
            title="Post"
            width={100}
            height={32}
            onPress={handleSubmit}
          />
        }
        title="Create Post"
        handleArrowPressed={() => navigation.goBack()}
      />

      {/* HEADER SECTTION */}
      <Box
        width={"100%"}
        height={'auto'}
        flexDirection="column"
        alignItems="center"
        px="m"
        justifyContent="space-between"
      >
        <Box width='100%' height={80} flexDirection="row" alignItems="center">
            <Pressable
                onPress={() => setShowCommunities(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 30,
                  backgroundColor: theme.colors.secondaryBackGroundColor,
                  paddingHorizontal: 10,
                  width: 'auto',
                  height: 30,
                  marginRight: 20,
                }}
              >
                <Ionicons
                  name={
                    "people"
                  }
                  size={20}
                  color={theme.colors.textColor}
                />
                <CustomText variant="xs">{community === null ? 'Choose community':community.name}</CustomText>
                <Feather
                  name="chevron-down"
                  size={20}
                  color={theme.colors.textColor}
                />
            </Pressable>

          {community === null && (
            <Pressable
            onPress={() => setAll({ showVisibility: true })}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 30,
              backgroundColor: theme.colors.secondaryBackGroundColor,
              padding: 2,
              width: 110,
              height: 30
            }}
          >
            <Ionicons
              name={
                visibility === "everyone" ? "globe-outline" : "people-outline"
              }
              size={20}
              color={theme.colors.textColor}
            />
            <CustomText variant="xs">{visibility}</CustomText>
            <Feather
              name="chevron-down"
              size={20}
              color={theme.colors.textColor}
            />
        </Pressable>
          )}
        </Box>

       <Box width={'100%'} flexDirection="row" justifyContent="space-between">

          <Box flexDirection="row" alignItems="center">
              <Box
                width={40}
                height={40}
                borderRadius={20}
                borderColor="primaryColor"
              >
                <Image
                  source={{ uri: `${IMAGE_BASE}${profile_image}` }}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                />
              </Box>

              <Box marginLeft="m">
                <CustomText variant="body">{username}</CustomText>
              </Box>
            </Box>

            {/* <FadedButton
              title="Tag people"
              onPress={() => setShow(true)}
              height={40}
            /> */}
            <BorderButton
              height={32}
              title="Tag people"
              onPress={() => setShow(true)}
              borderColor={theme.colors.primaryColor}
              color={theme.colors.primaryColor}
            />

       </Box>
      </Box>

      {/* TABVIEW */}
      <TabView active={activeTab} setActive={(data) => setActive(data)} />

      <Box flex={1}>
        <ScrollView style={{ flex: 1 }}>{toggleTab()}</ScrollView>
      </Box>

      {/* MEDIA UPLOAD SECTION */}
      <Box
        width={"100%"}
        height={100}
        flexDirection="row"
        borderTopWidth={1}
        borderTopColor="borderColor"
        paddingHorizontal="m"
        alignItems="center"
        position="relative"
        zIndex={9}
      >
        {showEmoji && (
          <Box
            width="80%"
            height={250}
            position="absolute"
            bottom={70}
            borderRadius={10}
            zIndex={10}
            backgroundColor="secondaryBackGroundColor"
          >
            <Emojipicker onSelected={updateTextWithEmoji} />
          </Box>
        )}

        <Box flexDirection="row">
          <Pressable
            onPress={() => setShowEmoji((prev) => !prev)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.secondaryBackGroundColor,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather
              name="smile"
              size={25}
              color={
                showEmoji ? theme.colors.primaryColor : theme.colors.textColor
              }
            />
          </Pressable>

          <Pressable
            onPress={() => handleDocumentPicker("Images")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.secondaryBackGroundColor,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 20,
            }}
          >
            <Ionicons
              name="image-outline"
              size={25}
              color={theme.colors.textColor}
            />
          </Pressable>

          {activeTab !== TAB_BAR_ENUM.POLL && (
            <Pressable
              onPress={() => handleDocumentPicker("Videos")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: theme.colors.secondaryBackGroundColor,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 20,
              }}
            >
              <Ionicons
                name="videocam-outline"
                size={25}
                color={theme.colors.textColor}
              />
            </Pressable>
          )}
        </Box>

        <Box flex={1} flexDirection="row" justifyContent="flex-end">
          {selectedUsers.length <= 4 &&
            selectedUsers.map((item, index) => (
              <Box
                width={30}
                height={30}
                borderRadius={15}
                overflow="hidden"
                backgroundColor="fadedButtonBgColor"
              >
                <Image
                  source={{
                    uri: `${IMAGE_BASE}${item.follower.profile_image}`,
                  }}
                  contentFit="cover"
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePost;
