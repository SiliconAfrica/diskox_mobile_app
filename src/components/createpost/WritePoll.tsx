import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import * as ImagePicker from 'expo-image-picker';
import CustomText from '../general/CustomText'
import MediaCard from './MediaCard'
import { Feather } from '@expo/vector-icons'
import FadedButton from '../general/FadedButton'
import PrimaryButton from '../general/PrimaryButton'


interface IProps {
  files: ImagePicker.ImagePickerAsset[];
  handlePicker: () => {};
  onDelete: (data: { index?: number, clearAll?: boolean }) => void;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  polls: string[];
  setPolls: (e: string, i: number) => void;
  addPoll: () => void;
  deletePoll: (i: number) => void;
  day: string;
  setDay: (day: string) => void
}

const Poll = ({ choice, index, deletePoll, handleChange }: {
  index: number,
  choice: string,
  deletePoll: (i: number)=> void,
  handleChange: (e: string, i: number) => void;
}) => {
  const theme = useTheme<Theme>();
  return (
    <Box flexDirection='row' width='100%' height={50} borderRadius={10} borderWidth={2} borderColor='grey' alignItems='center' justifyContent='space-between' paddingHorizontal='m' marginBottom='s' >
      <TextInput placeholder='Choice' placeholderTextColor={theme.colors.textColor} value={choice} onChangeText={(e) => handleChange(e, index)} style={{ color: theme.colors.textColor, fontFamily: 'RedRegular', flex: 0.8 }} />
      <Feather name='x' size={25} color={theme.colors.textColor} onPress={() => deletePoll(index)} style={{ color: theme.colors.textColor }} />
    </Box>
  )
}

const WritePoll = ({ description, setDescription, files, handlePicker, onDelete, setPolls: handlePollChange, deletePoll, addPoll, polls, day, setDay }: IProps) => {
  const theme = useTheme<Theme>();
  const [showDays, setShowDays] = React.useState(false);
  const [dayLabel, setDayLabel] = React.useState('1 day');
  const days: { name: string, value: number}[] = [
    {
      name: '1 day',
      value: 1,
    },
    {
      name: '3 day',
      value: 3
    },
    {
      name: '1 week',
      value: 7,
    },
    {
      name: '1 month',
      value: 30,
    },
    {
      name: '3 months',
      value: 91,
    },
    {
      name: '6 months',
      value: 183,
    }
  ] 
  // const [polls, setPolls] = React.useState(['', ''])

  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      
      <ScrollView contentContainerStyle={{  paddingBottom: 150 }}>

        <Box>
            <TextInput value={description} onChangeText={setDescription} style={{ width: '100%', fontFamily: 'RedRegular', fontSize: 18, color: theme.colors.textColor, padding: 20 }} placeholderTextColor={theme.colors.textColor} multiline placeholder={`what do you want to ask?`} textAlignVertical='top' />
        </Box>

         <Box width='100%' paddingHorizontal='m' zIndex={5}>

            <Box width='100%' borderRadius={20} backgroundColor='secondaryBackGroundColor' padding='m'>
              <CustomText>Create your poll</CustomText>

              <Box flex={1} marginTop='m'>
                {
                  polls.map((item, index) => (
                    <Poll choice={item} index={index} handleChange={handlePollChange} deletePoll={deletePoll} key={index.toString()} />
                  ))
                }
              </Box>

              <Box width='100%' height={60} flexDirection='row' justifyContent='space-between' marginTop='m' alignItems='center' zIndex={10} >
                <PrimaryButton title='Add option' height={40} onPress={() => addPoll()} />

                <Box position='relative'  flexDirection='row' justifyContent='flex-end' alignItems='center'>
                  <Feather name='clock' size={20} color={theme.colors.textColor} />
                  <CustomText variant='xs' marginLeft='s'>Duration</CustomText>

                  <Pressable onPress={() => setShowDays(prev => !prev)} style={{ height: 40, width:85, borderRadius: 10, borderWidth: 2, borderColor: theme.colors.grey, flexDirection: 'row', justifyContent:'space-between',alignItems: 'center', paddingHorizontal: 7, marginLeft: 10 }}>
                    <CustomText>{dayLabel}</CustomText>
                    <Feather name={showDays ? 'chevron-up':'chevron-down'} size={15} color={theme.colors.textColor} />
                  </Pressable>

                  {
                    showDays && (
                      <Box position='absolute' width={100} borderRadius={10} zIndex={10} backgroundColor='mainBackGroundColor' top={40}>
                        {
                          days.map((item, i) => (
                            <Pressable onPress={() => {setDay(item.value.toString()); setDayLabel(item.name)}} key={i.toString()} style={{ width: '100%', height: 40, justifyContent: 'center', paddingLeft: 10, borderBottomWidth:i === days.length - 1 ? 0:1, borderBottomColor: theme.colors.secondaryBackGroundColor }}>
                              <CustomText >{item.name}</CustomText>
                            </Pressable>
                          ))
                        }
                      </Box>
                    )
                  }

                </Box>
              </Box>

            </Box>

         </Box>
         { files.length === 0 && (
          <Box width={100} height={200}></Box>
         )}

         {
          files.length > 0 && (
            <Box height={200} margin='m' borderWidth={2} borderColor='secondaryBackGroundColor' borderRadius={20} zIndex={0}>

              <Pressable onPress={() => onDelete({ clearAll: true })} style={{ ...style.deleteButton, backgroundColor: theme.colors.secondaryBackGroundColor }}>
                <Feather name='x' size={20} color={theme.colors.textColor} />
              </Pressable>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center', paddingLeft: 0, paddingRight: 100, zIndex: 1  }}>
                {files.map((file, index) => (
                  <MediaCard file={file} index={index} onDelete={onDelete} key={index} />
                ))}
                {files.length < 5 && (
                  <Pressable style={{
                    marginLeft: 20,
                    width: 150, height: '90%',
                    borderRadius: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: theme.colors.secondaryBackGroundColor,
                  }}
                    onPress={() => handlePicker()}
                  >
                    <CustomText variant='body'>Add Media File</CustomText>
                    <Feather name='image' size={40} color={theme.colors.textColor} />
                  </Pressable>
                )}
              </ScrollView>
            </Box>
          )
        }

      </ScrollView>
    </Box>
  )
}

const style = StyleSheet.create({
  deleteButton: {
    zIndex: 10,
    position: 'absolute',
    right: -10,
    top: -10,
    height: 30,
    width: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default WritePoll