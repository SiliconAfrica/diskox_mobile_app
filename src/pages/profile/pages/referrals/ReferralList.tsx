import { useTheme } from "@shopify/restyle";
import Box from "../../../../components/general/Box";
import CustomText from "../../../../components/general/CustomText";
import { Theme } from "../../../../theme";
import { ScrollView } from "react-native-gesture-handler";

export default function ReferralList() {
  const theme = useTheme<Theme>();
  const tableData = [
    { username: "JohnDoe", gender: "Female", date: "1996-11-08" },
    { username: "JaneSmith", gender: "Male", date: "2003-09-20" },
    { username: "DavidBrown", gender: "Male", date: "2009-05-15" },
    { username: "EmilyJohnson", gender: "Other", date: "2013-12-25" },
    { username: "MichaelLee", gender: "Female", date: "2000-06-02" },
    { username: "JaneSmith", gender: "Male", date: "1999-03-11" },
    { username: "EmilyJohnson", gender: "Female", date: "1990-07-30" },
    { username: "JohnDoe", gender: "Male", date: "1987-02-18" },
    { username: "DavidBrown", gender: "Other", date: "2011-08-03" },
    { username: "JaneSmith", gender: "Female", date: "1998-04-22" },
    { username: "DavidBrown", gender: "Male", date: "2005-10-14" },
    { username: "EmilyJohnson", gender: "Other", date: "1988-09-27" },
    { username: "MichaelLee", gender: "Female", date: "1995-01-05" },
    { username: "JohnDoe", gender: "Male", date: "2007-12-08" },
    { username: "DavidBrown", gender: "Other", date: "1994-03-19" },
    { username: "EmilyJohnson", gender: "Female", date: "1991-05-29" },
    { username: "JaneSmith", gender: "Male", date: "1985-10-10" },
    { username: "MichaelLee", gender: "Other", date: "2002-02-15" },
    { username: "DavidBrown", gender: "Male", date: "2004-06-23" },
    { username: "EmilyJohnson", gender: "Other", date: "2010-07-07" },
  ];

  return (
    <Box
      backgroundColor="white"
      flex={1}
      borderRadius={10}
      px="s"
      py="s"
      mx="s"
      my="s"
    >
      <CustomText variant="subheader" color="black">
        People you've invited
      </CustomText>
      <Box borderBottomWidth={1} borderBottomColor="primaryColor" mt="s">
        <CustomText variant="body" color="primaryColor">
          Total Referrals
        </CustomText>
      </Box>
      {!tableData[0] ? (
        <Box width="100%" px="s" py="xl" my="l">
          <CustomText textAlign="center">
            Refer your friends to Diskox and gain points
          </CustomText>
        </Box>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Box>
            <Box flexDirection="row">
              <Box width={80} padding={"s"}>
                <CustomText variant="body" fontFamily="RedBold" color="black">
                  S/N
                </CustomText>
              </Box>
              <Box width={200} padding={"s"}>
                <CustomText variant="body" fontFamily="RedBold" color="black">
                  Username
                </CustomText>
              </Box>
              <Box width={200} padding={"s"}>
                <CustomText variant="body" fontFamily="RedBold" color="black">
                  Gender
                </CustomText>
              </Box>
              <Box width={200} padding={"s"}>
                <CustomText variant="body" fontFamily="RedBold" color="black">
                  Reg Date
                </CustomText>
              </Box>
            </Box>
            {tableData.map((item, index) => (
              <Box key={index} flexDirection="row">
                <Box width={80} padding={"s"}>
                  <CustomText variant="body">{index + 1}</CustomText>
                </Box>
                <Box width={200} padding={"s"}>
                  <CustomText variant="body" color="primaryColor">
                    {item.username}
                  </CustomText>
                </Box>
                <Box width={200} padding={"s"}>
                  <CustomText variant="body" color="black">
                    {item.gender}
                  </CustomText>
                </Box>
                <Box width={200} padding={"s"}>
                  <CustomText variant="body">{item.date}</CustomText>
                </Box>
              </Box>
            ))}
          </Box>
        </ScrollView>
      )}
    </Box>
  );
}
