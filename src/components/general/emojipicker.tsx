import { View, Text } from 'react-native'
import React from 'react'
import Box from './Box'
import { ScrollView } from 'react-native-gesture-handler'
import CustomText from './CustomText'
import { activities, animals, food, hearts, nature, objects, smilies, symbols, travel } from '../../utils/emoijis'

interface IProps {
    onSelected: (data: string) => void
}
const Emojipicker = ({ onSelected } : IProps) => {
    const[selected, setSelected] = React.useState('smilies');
    const headers = ['smilies', 'hearts', 'activities', 'animals', 'travel', 'nature', 'objects','symbols', 'food'];

    const handleHeaderChanged = React.useCallback((): string[] => {
        const obj = {
            hearts: hearts,
            activities: activities,
            travel: travel,
            animals: animals,
            nature: nature,
            objects: objects,
            symbols:  symbols,
            food: food,
            smilies: smilies,
        }
        return obj[selected];
    }, [selected]);

    const handleEmojiPicked = React.useCallback((emoji: string) => {
        onSelected(emoji);
    }, [])

  return (
    <Box width={'100%'} maxHeight={400} backgroundColor='secondaryBackGroundColor' borderRadius={20} padding='m'>
        {/* HEADERS */}
        <Box backgroundColor='mainBackGroundColor' width='100%' height={40} borderRadius={10} justifyContent='center'>
            <ScrollView horizontal contentContainerStyle={{ justifyContent: 'center', alignItems: 'center'}}>
                { headers.map((text, index) => (
                    <CustomText variant='xs' color={selected === text ? 'primaryColor':'textColor'} marginHorizontal='m' onPress={() => setSelected(text)} key={index.toString()}>{text}</CustomText>
                ))}
            </ScrollView>
        </Box>

        <Box width='100%' marginTop='s' backgroundColor='mainBackGroundColor' borderRadius={10} padding='s'>
            <ScrollView nestedScrollEnabled contentContainerStyle={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between',paddingBottom: 50 }}>
                { handleHeaderChanged().map((item, i) => (
                    <CustomText onPress={() => handleEmojiPicked(item)} key={i.toString()}  marginRight='m' marginBottom='s'>{item}</CustomText>
                )) }
            </ScrollView>
        </Box>
    </Box>
  )
}

export default Emojipicker