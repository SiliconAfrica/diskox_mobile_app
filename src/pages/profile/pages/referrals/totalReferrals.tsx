import Box from "../../../../components/general/Box";
import CustomText from "../../../../components/general/CustomText";

export default function TotalReferrals() {
  return (
    <Box
      backgroundColor="white"
      borderRadius={10}
      px="s"
      py="s"
      mx="s"
      my="s"
      alignItems="center"
    >
      <Box
        backgroundColor="lightGrey"
        borderRadius={10}
        width={"100%"}
        px="l"
        py="xl"
        mx="s"
        my="s"
        alignItems="center"
      >
        <CustomText variant="subheader" color="grey">
          Total Referrals
        </CustomText>
        <CustomText variant="subheader" color="black">
          0
        </CustomText>
      </Box>
    </Box>
  );
}
