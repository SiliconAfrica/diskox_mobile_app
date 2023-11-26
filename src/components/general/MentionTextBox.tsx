import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';

const MentionTextInput = () => {
  const [text, setText] = useState('');
  const [mentions, setMentions] = useState([]);

  const handleTextChange = (inputText) => {
    // Update the text
    setText(inputText);

    // Find mentions in the text (you can customize this regex based on your needs)
    const mentionMatches = inputText.match(/@(\w+)/g);

    // Update mentions array
    setMentions(mentionMatches || []);
  };

  return (
    <View>
      {/* Display the mentions */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {mentions.map((mention, index) => (
          <Text key={index} style={{ backgroundColor: 'yellow' }}>
            {mention}
          </Text>
        ))}
      </View>

      {/* Custom TextInput */}
      <TextInput
        multiline
        value={text}
        onChangeText={handleTextChange}
        placeholder="Type here..."
      />
    </View>
  );
};

export default MentionTextInput;