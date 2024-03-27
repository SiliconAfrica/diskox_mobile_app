import { useNavigation } from "@react-navigation/native";
import CustomText from "../components/general/CustomText";
import { PageType } from "../pages/login";
import {Linking} from "react-native";
import {Theme} from "../theme";
import {useTheme} from "@shopify/restyle";
import {TouchableOpacity} from "react-native-gesture-handler";



export const colorizeHashtags = (text) => {
  const navigation = useNavigation<PageType>();
    //const regex = /(#\w+)/g; // Regular expression to match words starting with a pound sign
    const regex = /(#[^#\s]*)|(https?:\/\/[^\s]*)/gi;
    const parts = text?.split(regex);

    const webRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    // Split the text using the regex pattern

    if (parts) {

      return parts.map((part: string, index) => {
     // Use the entire match for link text

        if (part) {
          if (part.startsWith('#')) {
            return <CustomText onPress={() => navigation.push('hashtag', { hashTag: part })} variant="body" key={index} fontSize={15} color="primaryColor">{part}</CustomText>
          } else {
            return <CustomText onPress={() => Linking.openURL(part)} variant="body" key={index} fontSize={15} >{part}</CustomText>
          }
        }

        return <CustomText variant="body" fontSize={15} key={index.toString()}>{part}</CustomText>;


        // if (part?.match(regex) || part?.match(webRegex)) {
        //   return <CustomText onPress={() => navigation.push('hashtag', { hashTag: part })} variant="body" key={index} fontSize={15} color="primaryColor">{part}</CustomText>; // Apply styling to matched words
        // }

      });
    }
  };


const ColorizeHashtagsAndUrls = ({ text }) => {
  const theme = useTheme<Theme>();
  const navigation = useNavigation<PageType>();

  // Regular expression patterns
  const hashtagPattern = /#\w+/g;
  const mentionRegex = /@\w+/g;
  const urlPattern = /\b(https?:\/\/\S+)\b/gi;

  const elements = [];
  let lastIndex = 0;

  const addText = (text, key, style = {}, onPress = null) => {
    elements.push(<CustomText key={key} onPress={onPress} style={style}>{text}</CustomText>);
  };

  const addHashtag = (hashtag, key) => {
    addText(hashtag, `hashtag-${key}`, { color: theme.colors.primaryColor }, () => navigation.push('hashtag', { hashTag: hashtag }) );
  };

  const addMention = (mention, key) => {
    addText(mention, `mention-${key}`, { color: theme.colors.primaryColor }, () => navigation.push('mention-profile', { username: mention.split('@')[1].toLowerCase() }) );
  };

  const addUrl = (url, key) => {
    addText(url, `url-${key}`, { color: '#3864AA', textDecorationLine: 'underline' }, () => Linking.openURL(url));
  };

  let match;


  while ((match = mentionRegex.exec(text))) {
    const mention = match[0];
    addText(text.slice(lastIndex, match.index), `text-${lastIndex}`);
    addMention(mention, match.index);
    lastIndex = match.index + mention.length;
  }

  while ((match = hashtagPattern.exec(text))) {
    const hashtag = match[0];
    addText(text.slice(lastIndex, match.index), `text-${lastIndex}`);
    addHashtag(hashtag, match.index);
    lastIndex = match.index + hashtag.length;
  }

  while ((match = urlPattern.exec(text))) {
    const url = match[0];
    addText(text.slice(lastIndex, match.index), `text-${lastIndex}`);
    addUrl(url, match.index);
    lastIndex = match.index + url.length;
  }

  addText(text.slice(lastIndex), `text-${lastIndex}`);

  return <CustomText>{elements}</CustomText>;
};

export default ColorizeHashtagsAndUrls;