import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";
import ModalWrapper from "../ModalWrapper";
import Login from "../../pages/login";
import { VISIBILITY, useModalState } from "../../states/modalState";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";

const VisibilityModal = () => {
  const [setAll, visibility] = useModalState((state) => [
    state.setAll,
    state.visibility,
  ]);
  const ref = useRef<BottomSheetModal>();
  const theme = useTheme<Theme>();

  useEffect(() => {
    ref.current.present();
  }, []);
  return (
    <ModalWrapper
      onClose={() => setAll({ showVisibility: false })}
      shouldScrroll
      snapPoints={["30%"]}
      ref={ref}
    >
      <Box flex={1} backgroundColor="mainBackGroundColor" paddingHorizontal="m">
        <CustomText variant="subheader" fontSize={20}>
          Who can see this post?
        </CustomText>

        <Pressable
          onPress={() => setAll({ visibility: VISIBILITY.EVERYONE })}
          style={{ ...style.button }}
        >
          <Ionicons
            name="people-outline"
            size={30}
            color={theme.colors.textColor}
          />
          <CustomText variant="body" marginLeft="m">
            Everyone
          </CustomText>
          {visibility === VISIBILITY.EVERYONE && (
            <Box
              marginLeft="s"
              width={15}
              height={15}
              borderRadius={7}
              bg="primaryColor"
              justifyContent="center"
              alignItems="center"
            >
              <Ionicons name="checkmark-outline" color="white" size={10} />
            </Box>
          )}
        </Pressable>

        <Pressable
          onPress={() => setAll({ visibility: VISIBILITY.FOLLOWERS })}
          style={{ ...style.button }}
        >
          <Ionicons
            name="person-add-outline"
            size={30}
            color={theme.colors.textColor}
          />
          <CustomText variant="body" marginLeft="m">
            My Followers
          </CustomText>
          {visibility === VISIBILITY.FOLLOWERS && (
            <Box
              marginLeft="s"
              width={15}
              height={15}
              borderRadius={7}
              bg="primaryColor"
              justifyContent="center"
              alignItems="center"
            >
              <Ionicons name="checkmark-outline" color="white" size={10} />
            </Box>
          )}
        </Pressable>
      </Box>
    </ModalWrapper>
  );
};

const style = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default VisibilityModal;
