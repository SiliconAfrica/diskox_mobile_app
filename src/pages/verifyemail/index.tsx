import { View, Text } from "react-native";
import React from "react";
import Box from "../../components/general/Box";
import CustomText from "../../components/general/CustomText";
import { useVerifyState } from "./state";
import Verify from "./pages/verify";
import Verified from "./pages/verified";

const VerifyEmail = () => {
  const [stage] = useVerifyState((state) => [state.stage]);

  const switchStage = React.useCallback(() => {
    switch (stage) {
      case 1: {
        return <Verify />;
      }
      case 2: {
        return <Verified />;
      }
      default: {
        return <Verify />;
      }
    }
  }, [stage]);
  return (
    <Box
      backgroundColor="mainBackGroundColor"
      flex={1}
      paddingTop="xl"
      paddingHorizontal="m"
    >
      {switchStage()}
    </Box>
  );
};

export default VerifyEmail;
