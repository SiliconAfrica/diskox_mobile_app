import { useTheme } from "@shopify/restyle";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import { Theme } from "../../theme";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../pages/login";
import httpService, { BASE_URL } from "../../utils/httpService";
import { useQuery } from "react-query";
import { URLS } from "../../services/urls";

interface TAnnouncements {
  active: boolean;
  id: number;
  title: string;
  slug: string;
  message: string;
  created_at: string;
  status: string;
  is_pinned: number;
  content_type: string;
  cover_photo: [string];
}
interface TSelectedAnnouncement {
  active: Boolean;
  index: number;
  title: String;
  id: number;
  slug: string;
  message: string;
  created_at: string;
  status: string;
  is_pinned: number;
  content_type: string;
  cover_photo: [string];
}
export default function AnnouncementBox() {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const [showModal, setShowModal] = useState<boolean>(true);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<TSelectedAnnouncement>(null);
  const [announcements, setAnnouncements] = useState<TAnnouncements[]>([]);

  const startAnnouncements = (data: any) => {
    const newAnnouncements = data.map((announc, index) => ({
      ...announc,
      active: index === 0 ? true : false,
    }));
    setAnnouncements([...newAnnouncements]);
    setSelectedAnnouncement({ ...data[0], index: 0 });
  };
  const { isLoading } = useQuery(
    ["announcements"],
    () => httpService.get(`${URLS.FETCH_ANNOUNCEMENTS}?page=1`),
    {
      onSuccess: (data) => {
        if (
          data.data.code === 1 &&
          data.data.data &&
          Array.isArray(data.data.data)
        ) {
          setShowModal(true);
          startAnnouncements(data.data.data);
        }
      },
      onError: (error: any) => {
        alert(error.message);
      },
    }
  );
  const changeShowing = (action: "next" | "prev") => {
    if (action === "next") {
      const newAnnouncements = announcements.map((announc, index) => ({
        ...announc,
        active:
          index === 0 && announcements[announcements.length - 1].active === true
            ? true
            : index > 0 && announcements[index - 1].active === true
            ? true
            : false,
      }));
      setAnnouncements([...newAnnouncements]);
    } else {
      const newAnnouncements = announcements.map((announc, index) => ({
        ...announc,
        active:
          index === announcements.length - 1 && announcements[0].active === true
            ? true
            : index < announcements.length - 1 &&
              announcements[index + 1].active === true
            ? true
            : false,
      }));
      setAnnouncements([...newAnnouncements]);
    }
  };

  useEffect(() => {
    if (announcements.length > 0) {
      const filterAnnouncements = announcements
        .map((data, i) => ({
          ...data,
          index: i,
        }))
        .filter((announcement, i) => {
          return announcement.active === true;
        });
      if (filterAnnouncements.length > 0) {
        setSelectedAnnouncement({ ...filterAnnouncements[0] });
      }
    }
  }, [announcements]);
  return (
    <>
      {showModal && selectedAnnouncement && selectedAnnouncement.title && (
        <Box>
          <Box
            backgroundColor="primaryColor"
            px="l"
            py="m"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box flexDirection="row" alignItems="center">
              <Image
                source={require("../../../assets/images/mic.png")}
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: "contain",
                  marginRight: 5,
                }}
                contentFit="contain"
                transition={1000}
              />

              <CustomText fontFamily="RedBold" color="white">
                {selectedAnnouncement.title}
              </CustomText>
            </Box>
            <Entypo
              name="cross"
              size={24}
              color={theme.colors.white}
              onPress={() => setShowModal(false)}
            />
          </Box>
          <Image
            source={
              selectedAnnouncement.cover_photo &&
              selectedAnnouncement.cover_photo.length > 0
                ? `${BASE_URL.replace("/api/v1", "")}/storage/${
                    selectedAnnouncement.cover_photo[0]
                  }`
                : require("../../../assets/images/diskoxLarge.png")
            }
            style={{
              width: "100%",
              height: 150,
              resizeMode: "cover",
            }}
            contentFit="contain"
            transition={1000}
          />
          <Box backgroundColor="primaryColor" px="l" py="m">
            <Pressable
              onPress={() =>
                navigation.navigate("singleAnnouncement", {
                  announcementId: selectedAnnouncement.slug,
                })
              }
            >
              <CustomText color="white">
                {`${selectedAnnouncement?.message?.substring(
                  0,
                  100
                )}... Read more`}
              </CustomText>
            </Pressable>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mt="s"
            >
              <CustomText color="white">
                ({selectedAnnouncement.index + 1}/{announcements.length})
              </CustomText>
              {announcements.length > 1 && (
                <Box flexDirection="row">
                  <Pressable onPress={() => changeShowing("prev")}>
                    <MaterialCommunityIcons
                      name="chevron-left-circle"
                      size={30}
                      color={theme.colors.white}
                    />
                  </Pressable>
                  <Pressable onPress={() => changeShowing("next")}>
                    <MaterialCommunityIcons
                      name="chevron-right-circle"
                      size={30}
                      color={theme.colors.white}
                    />
                  </Pressable>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
