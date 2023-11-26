import { View, Text } from "react-native";
import React from "react";
import { useDetailsState } from "../states/userState";
import { useUtilState } from "../states/util";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../pages/login";
import useToast from "./useToast";

const useCheckLoggedInState = () => {
  const { isLoggedIn } = useUtilState((state) => state);
  const navigation = useNavigation<PageType>();
  const toast = useToast();
  const checkloggedInState = React.useCallback((): boolean => {
    if (isLoggedIn) {
      return true;
    } else {
      toast.show("You have to be logged in to be able to like, upvote, downvote or comment on a post", {
        type: "warning",
        placement: 'top',
        style: { marginTop: 50 },
        duration: 5000,
      });
      // navigation.navigate("onboarding", { showModal: 1 });
      return false;
    }
  }, [isLoggedIn]);
  return {
    checkloggedInState,
  };
};

export default useCheckLoggedInState;
