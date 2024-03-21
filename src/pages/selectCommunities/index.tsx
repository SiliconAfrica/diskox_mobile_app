import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Box from "../../components/general/Box";
import PrimaryButton from "../../components/general/PrimaryButton";
import SettingsHeader from "../../components/settings/Header";
import { RootStackParamList } from "../../navigation/MainNavigation";
import CustomText from "../../components/general/CustomText";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { Image } from "expo-image";
import httpService, { IMAGE_BASE } from "../../utils/httpService";
import { useMutation, useQuery } from "react-query";
import { useState } from "react";
import { URLS } from "../../services/urls";
import { Pressable, ScrollView } from "react-native";
import useToast from "../../hooks/useToast";
import PopupModal from "../set-up/PopupModal";
import { saveScreen } from "../../utils/saveCurrentPosition";

const SelectCommunities = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "select-communities">) => {
  const theme = useTheme<Theme>();
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState([]);

  const { isLoading, isError, data } = useQuery(["getCommunities", page], () =>
    httpService.get(`${URLS.GET_COMMUNITIES}?page=${page}`)
  );
  const { mutate, isLoading: isJoining } = useMutation({
    mutationKey: ["join-multiple-communities"],
    mutationFn: (body: FormData) =>
      httpService.post(`${URLS.JOIN_MULTIPLE_COMMUNITIES}`, body),
    onSuccess: async (data) => {
      toast.show(data.data?.message || `Successful`, {
        type: "success",
      });
      await saveScreen("", {});
      setIsVisible(true);
    },
    onError: (err) => {
      toast.show(`An error occured`, {
        type: "danger",
      });
    },
  });

  const addToSelected = (id: number) => {
    const isSelected = selected.filter((communityId) => {
      return communityId === id;
    });

    if (isSelected.length > 0) {
      const removeSelected = selected.filter((communityId) => {
        return communityId !== id;
      });
      setSelected([...removeSelected]);
    } else {
      setSelected((prev) => [...prev, id]);
    }
  };
  const submit = () => {
    const form = new FormData();

    for (let i = 0; i < selected.length; i++) {
      form.append("community_ids[]", selected[i] as any);
    }
    mutate(form);
  };
  return (
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        title="Select Communities"
        showSave={false}
        handleArrowPressed={() => navigation.goBack()}
        showBackBtn={false}
      />
      <PopupModal visible={isVisible} setVisible={setIsVisible} />
      <ScrollView>
        <Box>
          <Box width={"100%"} padding="m">
            <CustomText variant="subheader" textAlign="center">
              Top Communities
            </CustomText>
            <CustomText variant="body" marginVertical="s" textAlign="center">
              Select at least 5 communities to get started.
            </CustomText>
          </Box>
          {data &&
            data.data &&
            data.data.data &&
            Array.isArray(data.data.data.data) &&
            data.data.data.data.map((community, index) => (
              <Pressable
                key={community.id}
                onPress={() => addToSelected(community.id)}
              >
                <Box paddingHorizontal="m" marginVertical="s">
                  <Box flexDirection="row" justifyContent="space-between">
                    <Box
                      width={"5%"}
                      borderRadius={5}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor={
                        selected.includes(community.id)
                          ? "fadedButtonBgColor"
                          : "secondaryBackGroundColor"
                      }
                      borderWidth={1}
                      borderColor={
                        selected.includes(community.id)
                          ? "primaryColor"
                          : "secondaryBackGroundColor"
                      }
                    >
                      <CustomText
                        color={
                          selected.includes(community.id)
                            ? "primaryColor"
                            : "black"
                        }
                      >
                        {index + 1}
                      </CustomText>
                    </Box>
                    <Box
                      width={"92.5%"}
                      paddingVertical="m"
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      backgroundColor={
                        selected.includes(community.id)
                          ? "fadedButtonBgColor"
                          : "secondaryBackGroundColor"
                      }
                      borderRadius={5}
                      paddingHorizontal="s"
                      borderWidth={1}
                      borderColor={
                        selected.includes(community.id)
                          ? "primaryColor"
                          : "secondaryBackGroundColor"
                      }
                    >
                      <Box
                        width={50}
                        height={50}
                        borderRadius={25}
                        // backgroundColor="primaryColor"
                        overflow="hidden"
                        justifyContent="center"
                        alignItems="center"
                      >
                        {community.profile_image ? (
                          <Image
                            source={{
                              uri: `${IMAGE_BASE}${community.profile_image}`,
                            }}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                          />
                        ) : (
                          <FontAwesome
                            name="users"
                            size={35}
                            color={theme.colors.grey}
                          />
                        )}
                      </Box>

                      <Box width={"75%"}>
                        <CustomText style={{ fontSize: 18 }}>
                          c/{community.username}
                        </CustomText>
                        <CustomText>{community.description}</CustomText>
                      </Box>
                      {selected.includes(community.id) ? (
                        <FontAwesome5
                          name="check-circle"
                          size={24}
                          color={theme.colors.primaryColor}
                        />
                      ) : (
                        <FontAwesome
                          name="plus-square-o"
                          size={24}
                          color={theme.colors.black}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Pressable>
            ))}
        </Box>
      </ScrollView>
      <Box
        width="100%"
        height={120}
        justifyContent="center"
        alignItems="center"
      >
        <PrimaryButton
          width="90%"
          title="Continue"
          onPress={selected.length > 4 ? submit : () => {}}
          isLoading={isJoining}
          color={
            selected.length > 4
              ? theme.colors.primaryColor
              : theme.colors.fadedButtonBgColor
          }
          textColor={
            selected.length > 4 ? theme.colors.white : theme.colors.grey
          }
        />
      </Box>
    </Box>
  );
};

export default SelectCommunities;
