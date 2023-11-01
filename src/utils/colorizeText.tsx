import CustomText from "../components/general/CustomText";

export const colorizeHashtags = (text) => {
    const regex = /(#\w+)/g; // Regular expression to match words starting with a pound sign
    const parts = text?.split(regex); // Split the text using the regex pattern
  
    if (parts) {
      return parts.map((part, index) => {
        if (part.match(regex)) {
          return <CustomText variant="body" key={index} fontSize={15} color="primaryColor">{part}</CustomText>; // Apply styling to matched words
        }
        return <CustomText variant="body" fontSize={15} key={index}>{part}</CustomText>; // Preserve non-matched parts
      });
    }
  };