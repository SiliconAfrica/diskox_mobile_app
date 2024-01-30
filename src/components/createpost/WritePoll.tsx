import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Box from "../general/Box";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import * as ImagePicker from "expo-image-picker";
import CustomText from "../general/CustomText";
import MediaCard from "./MediaCard";
import { Feather } from "@expo/vector-icons";
import FadedButton from "../general/FadedButton";
import PrimaryButton from "../general/PrimaryButton";
import { UserRound } from "lucide-react-native";
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
import { includes, uniqBy } from "lodash";
import { Image } from "expo-image";
import { MediaPost } from "../../models/post";
import UploadedImage from "./UploadedImage";

interface IProps {
  files: ImagePicker.ImagePickerAsset[];
  handlePicker: () => {};
  onDelete: (data: { index?: number; clearAll?: boolean }) => void;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  polls: string[];
  setPolls: (e: string, i: number) => void;
  addPoll: () => void;
  deletePoll: (i: number) => void;
  day: string;
  setDay: (day: string) => void;
  uploadedImages?: MediaPost[];
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

const Poll = ({
  choice,
  index,
  deletePoll,
  handleChange,
  uploadedImages,
}: {
  index: number;
  choice: string;
  deletePoll: (i: number) => void;
  handleChange: (e: string, i: number) => void;
  uploadedImages?: MediaPost[];
}) => {
  const theme = useTheme<Theme>();
  return (
    <Box
      flexDirection="row"
      width="100%"
      height={50}
      borderRadius={10}
      borderWidth={1}
      borderColor="borderColor"
      alignItems="center"
      justifyContent="space-between"
      paddingLeft="m"
      marginBottom="s"
      overflow="hidden"
    >
      <TextInput
        placeholder={`Option ${index + 1}`}
        placeholderTextColor={theme.colors.textColor}
        value={choice}
        onChangeText={(e) => handleChange(e, index)}
        style={{
          color: theme.colors.textColor,
          fontFamily: "RedRegular",
          flex: 0.8,
        }}
      />
      <Pressable
        onPress={() => deletePoll(index)}
        style={{
          width: "15%",
          height: "100%",
          backgroundColor: theme.colors.secondaryBackGroundColor,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Feather
          name="x"
          size={20}
          color={theme.colors.textColor}
          style={{ color: theme.colors.textColor }}
        />
      </Pressable>
    </Box>
  );
};

const WritePoll = ({
  description,
  setDescription,
  files,
  handlePicker,
  onDelete,
  setPolls: handlePollChange,
  deletePoll,
  addPoll,
  polls,
  day,
  setDay,
  uploadedImages,
}: IProps) => {
  const theme = useTheme<Theme>();
  const [showDays, setShowDays] = React.useState(false);
  const [dayLabel, setDayLabel] = React.useState("2 days");
  const days: { name: string; value: number }[] = [
    {
      name: "2 days",
      value: 2,
    },
    {
      name: "3 days",
      value: 3,
    },
    {
      name: "1 week",
      value: 7,
    },
    {
      name: "1 month",
      value: 30,
    },
    {
      name: "3 months",
      value: 91,
    },
    {
      name: "6 months",
      value: 183,
    },
  ];
  // const [polls, setPolls] = React.useState(['', ''])

  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <Box>
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
            placeholder={`Describe your poll`}
            textAlignVertical="top"
          />
        </Box>

        <Box width="100%" paddingHorizontal="m" zIndex={5}>
          <Box
            width="100%"
            borderRadius={20}
            borderWidth={0.5}
            borderColor="borderColor"
            padding="m"
          >
            {/* <CustomText variant='subheader' fontSize={16}>Describe your poll</CustomText> */}

            <Box flex={1} marginTop="m">
              {polls.map((item, index) => (
                <Poll
                  choice={item}
                  index={index}
                  handleChange={handlePollChange}
                  deletePoll={deletePoll}
                  key={index.toString()}
                />
              ))}
            </Box>

            <Box
              width="100%"
              height={60}
              flexDirection="row"
              justifyContent="space-between"
              marginTop="m"
              alignItems="center"
              zIndex={10}
            >
              <PrimaryButton
                borderRadius={5}
                width={120}
                title="Add option"
                height={40}
                onPress={() => addPoll()}
              />

              <Box
                position="relative"
                flexDirection="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Feather
                  name="clock"
                  size={20}
                  color={theme.colors.textColor}
                />
                <CustomText variant="xs" marginLeft="s">
                  Duration
                </CustomText>

                <Pressable
                  onPress={() => setShowDays((prev) => !prev)}
                  style={{
                    height: 40,
                    width: 85,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: theme.colors.borderColor,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 7,
                    marginLeft: 10,
                  }}
                >
                  <CustomText>{dayLabel}</CustomText>
                  <Feather
                    name={showDays ? "chevron-up" : "chevron-down"}
                    size={15}
                    color={theme.colors.textColor}
                  />
                </Pressable>

                {showDays && (
                  <Box
                    position="absolute"
                    width={100}
                    borderRadius={10}
                    zIndex={10}
                    backgroundColor="mainBackGroundColor"
                    top={40}
                  >
                    {days.map((item, i) => (
                      <Pressable
                        onPress={() => {
                          setDay(item.value.toString());
                          setDayLabel(item.name);
                        }}
                        key={i.toString()}
                        style={{
                          width: "100%",
                          height: 40,
                          justifyContent: "center",
                          paddingLeft: 10,
                          borderBottomWidth: i === days.length - 1 ? 0 : 0.3,
                          // borderBottomColor: theme.colors.borderColor,
                        }}
                      >
                        <CustomText>{item.name}</CustomText>
                      </Pressable>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>

            {includes(polls, "") && (
              <CustomText variant="body" fontSize={14} style={{ color: "red" }}>
                You must fill in the options
              </CustomText>
            )}
          </Box>
        </Box>
        {files.length === 0 && <Box width={100} height={200}></Box>}

        {files.length > 0 && (
          <Box
            height={200}
            margin="m"
            borderWidth={0.5}
            borderColor="borderColor"
            borderRadius={20}
          >
            <Pressable
              onPress={() => onDelete({ clearAll: true })}
              style={{
                ...style.deleteButton,
                backgroundColor: theme.colors.secondaryBackGroundColor,
              }}
            >
              <Feather name="x" size={20} color={theme.colors.textColor} />
            </Pressable>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: "center",
                paddingLeft: 0,
                paddingRight: 100,
              }}
            >
              {/* {
                  uploadedImages.length > 0 && uploadedImages.map((item, index) => (
                    <UploadedImage file={item as any} index={index} onDelete={removeImage} key={index} />
                  ))
                } */}
              {files.map((file, index) => (
                <MediaCard
                  file={file as any}
                  index={index}
                  onDelete={onDelete}
                  key={index}
                />
              ))}
              {
                <Pressable
                  style={{
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

export default WritePoll;
