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

interface TAnnouncements {
  active: Boolean;
  title: String;
  content: String;
}
interface TSelectedAnnouncement {
  active: Boolean;
  index: number;
  title: String;
  content: String;
}
export default function AnnouncementBox() {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<TSelectedAnnouncement>(null);
  const [announcements, setAnnouncements] = useState<TAnnouncements[]>([
    {
      active: false,
      title: "Sticker Update!!!",
      content:
        "You can now chat using stickers and make comments on post with the newly added sticker feature of diskox with your friends and family...",
    },
    {
      active: false,
      title: "Hi guys",
      content:
        "Remeber how MMM scammed Nigerans, now imagine the pain and try to be great...",
    },
    {
      active: false,
      title: "22Sticker Update",
      content:
        "You can now chat using stickers and make comments on post with the newly added sticker feature of diskox with your friends and family...",
    },
  ]);
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
      const newAnnouncements = announcements.map((announc, index) => ({
        ...announc,
        active: index === 0 ? true : false,
      }));
      setAnnouncements([...newAnnouncements]);
      setSelectedAnnouncement({ ...announcements[0], index: 0 });
    }
  }, []);

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
      setSelectedAnnouncement({ ...filterAnnouncements[0] });
    }
  }, [announcements]);
  return (
    <>
      {selectedAnnouncement && (
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
            <Entypo name="cross" size={24} color={theme.colors.white} />
          </Box>
          <Image
            source={require("../../../assets/images/announcement.png")}
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
              onPress={() => navigation.navigate("singleAnnouncement")}
            >
              <CustomText color="white">
                {selectedAnnouncement.content}
                Read more
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
              <Box flexDirection="row">
                <Pressable onPress={() => changeShowing("prev")}>
                  <MaterialCommunityIcons
                    name="chevron-left-circle"
                    size={30}
                    color={theme.colors.fadedWhite}
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
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
