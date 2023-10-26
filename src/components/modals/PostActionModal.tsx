import { View, Text, Pressable } from "react-native";
import React, { useEffect, useRef } from "react";
import ModalWrapper from "../ModalWrapper";
import Login from "../../pages/login";
import { useModalState } from "../../states/modalState";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomText from "../general/CustomText";
import Box from "../general/Box";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/MainNavigation";
import { useUtilState } from "../../states/util";
import { useMutation } from "react-query";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { useToast } from "react-native-toast-notifications";
import useCheckLoggedInState from "../../hooks/useCheckLoggedInState";
import * as Clipboard from 'expo-clipboard';


const ActionChip = ({
  icon,
  label,
  action,
  isLoading = false
}: {
  icon: any;
  label: string;
  action: () => void;
  isLoading?: boolean;
}) => {
  const { isDarkMode } = useUtilState((state) => state);
  const theme = useTheme<Theme>();
  return (
    <Pressable
      onPress={() => isLoading ? null : action()}
      style={{
        flexDirection: "row",
        paddingHorizontal: 20,
        height: 60,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Box
        width={40}
        height={40}
        style={{
          backgroundColor: isDarkMode
            ? theme.colors.secondaryBackGroundColor
            : "#F3FBF5",
        }}
        borderRadius={20}
        justifyContent="center"
        alignItems="center"
      >
        {icon}
      </Box>
      <CustomText variant="body" marginLeft="m">
        { isLoading ? "Loading..." : label}
      </CustomText>
    </Pressable>
  );
};

const PostActionModal = () => {
  const [setAll, activePost] = useModalState((state) => [
    state.setAll,
    state.activePost,
  ]);
  const ref = useRef<BottomSheetModal>();
  const theme = useTheme<Theme>();
  const toast = useToast();
  const { isLoggedIn } = useUtilState((state) => state);
  const { checkloggedInState } = useCheckLoggedInState();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "post">>();

    const { mutate, isLoading } = useMutation({
      mutationFn: () => httpService.post(`${URLS.BOOKMARK_POST}/${activePost.id}`),
      onSuccess: (data) => {
        toast.show(data.data.message, { type: 'success' });
        setAll({ activePost: { ...activePost, is_bookmarked: activePost.is_bookmarked === 1 ?0:1 } });
      },
      onError: (error: any) => {
        toast.show(error.message, { type: 'error' });

      },
    });

    const copyToClipboard = async () => {
      await Clipboard.setStringAsync(`https://test404.diskox.com/post/${activePost.id}`);
      toast.show('Post copied to clipboard', { type: 'success' });
    };
  

    const handleSave = React.useCallback(() => {
      const check = checkloggedInState();
      if (check) {
        mutate();
      }
    }, [activePost, checkloggedInState])

  const obj = [
    {
      id: 1,
      label: "View profile",
      action: () => {
        navigation.navigate("profile", { userId: activePost.user_id });
        setAll({ activePost: null, showPostAction: false });
      },
      icon: (
        <Ionicons
          name="person-outline"
          size={20}
          color={theme.colors.textColor}
        />
      ),
    },
    {
      id: 2,
      isLoading: isLoading,
      label: activePost.is_bookmarked === 1 ? 'Remove post':"Save post",
      action: () => handleSave(),
      icon: (
        <Ionicons
          name="bookmark-outline"
          size={20}
          color={activePost.is_bookmarked === 1 ? theme.colors.primaryColor:theme.colors.textColor}
        />
      ),
    },
    {
      id: 3,
      label: "Copy link",
      action: () => copyToClipboard(),
      icon: (
        <Ionicons
          name="link-outline"
          size={20}
          color={theme.colors.textColor}
        />
      ),
    },
    {
      id: 4,
      label: "Report post",
      action: () => handleReport(),
      icon: (
        <Ionicons
          name="flag-outline"
          size={20}
          color={theme.colors.textColor}
        />
      ),
    },
  ];

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.present();
    }
  }, []);

  const handleReport = () => {
    setAll({ showPostAction: false, showReportPost: true });
  }
  return (
    <ModalWrapper
      onClose={() => setAll({ showPostAction: false, activePost: null })}
      shouldScrroll={false}
      snapPoints={["40%"]}
      ref={ref}
    >
      <Box
        width="100%"
        height={40}
        paddingHorizontal="m"
        flexDirection="row"
        justifyContent="flex-end"
      >
        <Feather
          name="x"
          size={25}
          color={theme.colors.textColor}
          onPress={() => setAll({ showPostAction: false, activePost: null })}
        />
      </Box>

      {obj.filter((item) => {
        if(isLoggedIn) {
          return item
        } else {
          return item.id !== 2 && item.id !== 4;
        }

      }).map((item, i) => (
        <ActionChip {...item} key={i.toString()} />
      ))}
    </ModalWrapper>
  );
};

export default PostActionModal;
