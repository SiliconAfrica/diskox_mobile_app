import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Box from "../general/Box";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { Feather } from "@expo/vector-icons";
import MediaCard from "./MediaCard";
import CustomText from "../general/CustomText";
import * as ImagePicker from "expo-image-picker";
import {
  MentionInput,
  MentionSuggestionsProps,
} from "react-native-controlled-mentions";
import { Mention } from "../../models/mention";
import { useCommentMentionState } from "../feeds/commentState";
import { useQuery } from "react-query";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { PaginatedResponse } from "../../models/PaginatedResponse";
import { CUSTOM_STATUS_CODE } from "../../enums/CustomCodes";
import { uniqBy } from "lodash";
import { Image } from "expo-image";
import { UserRound } from "lucide-react-native";
import { MediaPost } from "../../models/post";
import UploadedImage from "./UploadedImage";

interface IProps {
  files: ImagePicker.ImagePickerAsset[];
  handlePicker: () => {};
  onDelete: (data: { index?: number; clearAll?: boolean }) => void;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: (e: string) => void;
  uploadedImages?: MediaPost[];
  removeImage?: (data: { id?: number; type: "image" | "video" }) => void;
}

const renderSuggestions: React.FC<MentionSuggestionsProps> = ({
  keyword,
  onSuggestionPress,
}) => {
  const [users, setUsers] = React.useState<Mention[]>([]);
  const [total, setTotal] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);

  const theme = useTheme<Theme>();
  const { setId, setSelectedUsers } = useCommentMentionState((state) => state);

  const { isLoading } = useQuery(
    ["getMentions", keyword, currentPage],
    () =>
      httpService.get(`${URLS.GET_MENTIONS}`, {
        params: {
          keyword,
          page: currentPage,
        },
      }),
    {
      enabled: keyword != null,
      onSuccess: (data) => {
        const item: PaginatedResponse<Mention> = data.data;
        if (item.code == CUSTOM_STATUS_CODE.SUCCESS) {
          if (users.length > 0) {
            setUsers(uniqBy([...users, ...item.data.data], "id"));
          } else {
            setUsers(item.data.data);
            setTotal(item.data.total);
          }
        }
      },
      onError: (error) => {},
    }
  );

  return (
    <Box
      width={"100%"}
      minHeight={0}
      maxHeight={180}
      bg="mainBackGroundColor"
      position="absolute"
      top={0}
      zIndex={40}
      marginTop={"l"}
      marginLeft="s"
      borderRadius={10}
      overflow="hidden"
    >
      {isLoading && (
        <Box
          width="100%"
          height={40}
          justifyContent="center"
          alignItems="center"
        >
          <ActivityIndicator size={"small"} color={theme.colors.primaryColor} />
        </Box>
      )}
      {keyword !== null && (
        <ScrollView
          nestedScrollEnabled
          contentContainerStyle={{
            borderWidth: 0,
            borderColor: theme.colors.lightGrey,
            backgroundColor: theme.colors.secondaryBackGroundColor,
            width: "100%",
          }}
        >
          {users
            .filter((one) =>
              one?.name?.toLowerCase().includes(keyword?.toLowerCase())
            )
            .map((one) => (
              <Pressable
                key={one.id}
                onPress={() => {
                  onSuggestionPress({ id: "", name: one.name });
                  setSelectedUsers(one);
                  setId(one.id.toString());
                }}
                style={{
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {one.profile_image !== null && (
                  <Image
                    source={{ uri: `${IMAGE_BASE}${one.profile_image}` }}
                    contentFit="cover"
                    style={{ width: 30, height: 30, borderRadius: 15 }}
                  />
                )}
                {one.profile_image === null && (
                  <Box
                    width={30}
                    height={30}
                    borderRadius={15}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <UserRound size={20} color={theme.colors.primaryColor} />
                  </Box>
                )}
                <CustomText variant="body" marginLeft="m">
                  {one.name}
                </CustomText>
              </Pressable>
            ))}
        </ScrollView>
      )}
    </Box>
  );
};

const WriteQuestion = ({
  files,
  handlePicker,
  onDelete,
  description,
  setDescription,
  title,
  setTitle,
  uploadedImages = [],
  removeImage,
}: IProps) => {
  const theme = useTheme<Theme>();

  const handleChange = (text: string) => {
    setDescription(text);
    const val = description.match(/#\w+/g);
  };

  return (
    <Box flex={1}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <Box flex={1} height={350} paddingTop="m" paddingHorizontal="m">
          <Box
            marginBottom="m"
            width={"100%"}
            flexDirection="row"
            justifyContent="space-between"
            height={60}
            alignItems="center"
            borderRadius={10}
            padding="s"
            borderWidth={1}
            borderColor="borderColor"
          >
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={{
                width: "80%",
                fontFamily: "RedMedium",
                fontSize: 14,
                color: theme.colors.textColor,
              }}
              placeholderTextColor={theme.colors.textColor}
              multiline
              placeholder={`Question Title`}
              textAlignVertical="top"
            />

            <CustomText variant="xs">{title.length}/200</CustomText>
          </Box>

          <MentionInput
            partTypes={[
              {
                trigger: "@",
                renderSuggestions,
                textStyle: {
                  fontWeight: "bold",
                  color: theme.colors.primaryColor,
                },
                isInsertSpaceAfterMention: true,
                pattern: /(@\w+)/g,
              },
            ]}
            value={description}
            onChange={setDescription}
            containerStyle={{
              minHeight: 80,
              paddingHorizontal: 10,
              marginTop: 20,
            }}
            style={{
              fontFamily: "RedRegular",
              fontSize: 14,
              color: theme.colors.textColor,
            }}
            placeholderTextColor={theme.colors.textColor}
            multiline
            placeholder={`What do you want to ask?`}
            textAlignVertical="top"
          />
        </Box>

        {
           (
            <Box height={200} margin='m' borderWidth={2} borderColor='secondaryBackGroundColor' borderRadius={20}>

              <Pressable onPress={() => onDelete({ clearAll: true })} style={{ ...style.deleteButton, backgroundColor: theme.colors.secondaryBackGroundColor }}>
                <Feather name='x' size={20} color={theme.colors.textColor} />
              </Pressable>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingLeft: 0, paddingRight: 100 }}>
                {
                  uploadedImages.map((item, index) => (
                    <UploadedImage file={item as any} index={index} onDelete={onDelete} key={index} />
                  ))
                }
                {files.map((file, index) => (
                  <MediaCard file={file as any} index={index} onDelete={onDelete} key={index} />
                ))}
                {files.length > 0 && files.length < 10 && (
                  <Pressable style={{
                    marginLeft: 20,
                    width: 150,
                    height: "90%",
                    borderRadius: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 0.5,
                    borderColor: theme.colors.borderColor,
                  }}
                  onPress={() => handlePicker()}
                >
                  <CustomText variant="body">Add Media File</CustomText>
                  <Feather
                    name="image"
                    size={40}
                    color={theme.colors.textColor}
                  />
                </Pressable>
              }
            </ScrollView>
          </Box>
        )}
      </ScrollView>
    </Box>
  );
};

const style = StyleSheet.create({
  deleteButton: {
    zIndex: 10,
    position: "absolute",
    right: -10,
    top: -10,
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WriteQuestion;
