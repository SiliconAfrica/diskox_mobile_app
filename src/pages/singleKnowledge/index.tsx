import { ScrollView, StyleSheet } from "react-native";
import Box from "../../components/general/Box";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import SettingsHeader from "../../components/settings/Header";
import { PageType } from "../login";
import CustomText from "../../components/general/CustomText";

export default function SingleKnowledge() {
  const navigation = useNavigation<PageType>();
  return (
    <Box flex={1}>
      <SettingsHeader
        showSave={false}
        title="Knowledge Base"
        handleArrowPressed={() => navigation.goBack()}
      />
      <ScrollView>
        <Box px="s" py="m">
          <CustomText variant="xs">22 Aug, 2023</CustomText>
          <CustomText variant="body" fontFamily="RedBold" color="black">
            Knowledge Diskox Is Now Putting Two & Two Together To Make It Four
            or Forever!
          </CustomText>

          <Box style={{ width: "100%", height: 250 }} mt="l">
            <Image
              source={require("../../../assets/images/announcementBanner.png")}
              style={styles.banner}
              contentFit="fill"
              transition={1000}
            />
          </Box>
          <CustomText variant="body" color="black" mt="m">
            In a world that thrives on connectivity, social media has become an
            integral part of our daily lives. It enables us to share
            experiences, connect with friends and family, and stay informed
            about global events. However, as the landscape of social media
            evolves, a new player has emerged with the promise of
            revolutionizing how we engage online. Enter Diskox, a groundbreaking
            social media platform that seeks to empower individuals and reshape
            the way we interact in the digital realm. Diskox isn't just another
            run-of-the-mill social media platform. It's driven by a powerful
            vision: to empower every user to have a meaningful and impactful
            online presence. In an era where algorithms often dictate the
            content we see, Diskox takes a different approach. It believes that
            users should have control over the content they consume, share, and
            engage with. To achieve this, Diskox employs an innovative content
            discovery system that prioritizes user preferences over ad-driven
            content.
          </CustomText>
        </Box>
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: "100%",
  },
});
