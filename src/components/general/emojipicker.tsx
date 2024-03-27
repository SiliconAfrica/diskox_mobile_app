import { View, Text } from 'react-native'
import React from 'react'
import Box from './Box'
import { ScrollView } from 'react-native-gesture-handler'
import CustomText from './CustomText'
import { activities, animals, food, hearts, nature, objects, smilies, symbols, travel } from '../../utils/emoijis'
import {emojis as emojiss, } from 'rn-emoji-picker/dist/data'
import { } from 'rn-emoji-picker'

interface IProps {
    onSelected: (data: string) => void
}
const Emojipicker = ({ onSelected } : IProps) => {
    const[selected, setSelected] = React.useState('emotion');
    const headers = ['smilies', 'hearts', 'activities', 'animals', 'travel', 'nature', 'objects','symbols', 'food'];
    const categories = ['emotion', 'activities', 'flags', 'food', 'place', 'nature'];


    const emotion = emojiss.filter((item) => item.category.includes('emotion') ?? []);
    const emojis = emojiss.filter((item) => item.category.includes('emojis') ?? []);
    const activities = emojiss.filter((item) => item.category.includes('activities') ?? []);
    const flags = emojiss.filter((item) => item.category.includes('flags') ?? []);
    const food = emojiss.filter((item) => item.category.includes('food') ?? []);
    const place = emojiss.filter((item) => item.category.includes('place') ?? []);
    const nature = emojiss.filter((item) => item.category.includes('nature') ?? []);

    const handleHeaderChanged = React.useCallback((): any[] => {
        const obj = {
            emotion,
            // emojis,
            activities,
            flags,
            food,
            place,
            nature,
        }
        return obj[selected];
    }, [selected]);

    const handleHeader = React.useCallback((header): any[] => {
        const obj = {
            emotion,
            // emojis,
            activities,
            flags,
            food,
            place,
            nature,
        }
        return obj[header][0].emoji;
    }, [selected]);

    const handleEmojiPicked = React.useCallback((emoji: string) => {
        onSelected(emoji);
    }, [onSelected])

  return (
    <Box width={'100%'} maxHeight={200} backgroundColor='secondaryBackGroundColor' borderRadius={20} padding='m'>
        {/* HEADERS */}
        <Box backgroundColor='mainBackGroundColor' width='100%' height={40} borderRadius={10} justifyContent='center'>
            <ScrollView horizontal contentContainerStyle={{ justifyContent: 'center', alignItems: 'center'}}>
                { categories.map((text, index) => (
                    <CustomText variant='xs' color={selected === text ? 'primaryColor':'textColor'} marginHorizontal='m' onPress={() => setSelected(text)} key={index.toString()}>{text}{handleHeader(text)}</CustomText>
                ))}
            </ScrollView>
        </Box>

        <Box width='100%' marginTop='s' backgroundColor='mainBackGroundColor' borderRadius={10} padding='s'>
            <ScrollView nestedScrollEnabled contentContainerStyle={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between',paddingBottom: 50 }}>
                { handleHeaderChanged().map((item, i) => (
                    <CustomText onPress={() => handleEmojiPicked(item.emoji)} key={i.toString()}  marginRight='m' marginBottom='s'>{item.emoji}</CustomText>
                )) }
            </ScrollView>
        </Box>
    </Box>
  )
}

export default Emojipicker