import { View, Text, Pressable } from "react-native";
import React from "react";
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
import { useMutation } from "react-query";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";

const CreatePost = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "create-post">) => {
  const { profile_image, name, username } = useDetailsState((state) => state);
  const { setAll, visibility } = useModalState((state) => state);
  const [activeTab, setActive] = React.useState(TAB_BAR_ENUM.POST);
  const [files, setFiles] = React.useState<ImagePicker.ImagePickerAsset[]>([]);
  const [show, setShow] = React.useState(false);
  const [tags, setTags] = React.useState<number[]>([]);
  const [value, setValues] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const theme = useTheme<Theme>();

  // mutation
  const { isLoading, mutate } = useMutation({
    mutationFn: (data: FormData) => httpService.post("/create_post", data),
    onSuccess: (data) => {
      console.log(data.data);
      alert("Post created");
      // clean up
      setFiles([]);
      setTags([]);
      setValues("");
      navigation.goBack();
    },
    onError: (error: any) => {
      console.log(error.message);
      alert(error.message);
    },
  });

  const toggleTab = React.useCallback(() => {
    switch (activeTab) {
      case TAB_BAR_ENUM.POST: {
        return (
          <WritePost
            description={value}
            setDescription={setValues}
            files={files}
            handlePicker={handleDocumentPicker}
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
            handlePicker={handleDocumentPicker}
            onDelete={handleMediaDelete}
          />
        );
      }
      case TAB_BAR_ENUM.POLL: {
        return (
          <WritePoll
            description={question}
            setDescription={setQuestion}
            onDelete={handleMediaDelete}
          />
        );
      }
    }
  }, [activeTab, files, value, setValues]);

  const handleCheck = React.useCallback(
    (val: number, valu: boolean) => {
      if (valu && !tags.includes(val)) {
        setTags([...tags, val]);
      } else {
        setTags(tags.filter((item) => item !== val));
      }
    },
    [tags]
  );

  const handleSubmit = React.useCallback(() => {
    const formData = new FormData();
    formData.append("description", value);
    formData.append("visibility", visibility);
    formData.append("post_type", "post");
    //  const ht = value.match(/#\w+/g);
    //  if (ht.length > 0) {
    //   ht.map((item) => {
    //     formData.append('hashtags[]', item as any);
    //   })
    //  }
    if (tags.length > 0) {
      tags.map((item) => {
        formData.append("tags[]", item as any);
      });
    }
    formData.append("status", "active");
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
  }, [value, visibility, tags, files]);

  const handleDocumentPicker = React.useCallback(async () => {
    if (files.length === 5) {
      alert(`You can't add more than 5 files!`);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: false,
    });

    if (!result.canceled) {
      console.log(result.assets[0]);
      const formData = new FormData();
      const name = result.assets[0].uri.split("/").pop();
      const mimeType = mime.getType(result.assets[0].uri);
      const arr = [...files, result.assets[0]];
      setFiles(arr);
    }
  }, [files]);

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
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <TagModal
        open={show}
        onClose={() => setShow(false)}
        tags={tags}
        setTags={(tags, val) => handleCheck(tags, val)}
      />
      <SettingsHeader
        showSave={false}
        onSave={() => {}}
        rightItem={
          <FadedButton
            isLoading={isLoading}
            title="Post"
            width={100}
            height={40}
            onPress={handleSubmit}
          />
        }
        title="Create Post"
        handleArrowPressed={() => navigation.goBack()}
      />

      {/* HEADER SECTTION */}
      <Box
        width={"100%"}
        height={100}
        flexDirection="row"
        alignItems="center"
        px="m"
        justifyContent="space-between"
      >
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

            <Pressable
              onPress={() => setAll({ showVisibility: true })}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 30,
                backgroundColor: theme.colors.secondaryBackGroundColor,
                padding: 2,
              }}
            >
              <Ionicons
                name="globe-outline"
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
          </Box>
        </Box>

        <FadedButton
          title="Tag people"
          onPress={() => setShow(true)}
          height={40}
        />
      </Box>

      {/* TABVIEW */}
      <TabView setActive={(data) => setActive(data)} />

      <Box flex={1}>{toggleTab()}</Box>

      {/* MEDIA UPLOAD SECTION */}
      <Box
        width={"100%"}
        height={100}
        flexDirection="row"
        borderTopWidth={2}
        borderTopColor="secondaryBackGroundColor"
        paddingHorizontal="m"
        alignItems="center"
      >
        <Pressable
          onPress={handleDocumentPicker}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.secondaryBackGroundColor,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="image-outline"
            size={25}
            color={theme.colors.textColor}
          />
        </Pressable>

        <Pressable
          onPress={handleDocumentPicker}
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
      </Box>
    </Box>
  );
};

export default CreatePost;
