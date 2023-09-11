import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Box from '../../../../components/general/Box'
import SettingsHeader from '../../../../components/settings/Header'
import { useDetailsState } from '../../../../states/userState'
import { Image } from 'expo-image'
import { IMAGE_BASE } from '../../../../utils/httpService'
import CustomText from '../../../../components/general/CustomText'
import Editable from '../../../../components/profile/Editable'
import CustomDropDwon from '../../../../components/general/DropDown'
import CountryPicker from '../../../../components/form/CountryPicker'
import { ScrollView } from 'react-native-gesture-handler'
import Data from '../../../../utils/countries.json';
import States from '../../../../utils/states.json';
import { ICountry } from '../../../../models/country'
import { IState } from '../../../../models/state'
import moment from 'moment';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useUtilState } from '../../../../states/util'
import * as ImagePicker from 'expo-image-picker'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../../navigation/MainNavigation'

const Profile = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'profile-setting'>) => {
  const { isDarkMode } = useUtilState((state) => state);
  const { profile_image,name, username, email, about, gender, country: nation, state: MyState, birthday } = useDetailsState((state) => state);
  const [sex, setSex] = React.useState(gender);
  const [image, setImage] = React.useState(profile_image);
  const [fullname, setName] = React.useState(name);
  const [description, setDescription] = React.useState(about);
  const [country, setCountry] = React.useState(nation);
  const [state,  setState] = React.useState(MyState);
  const [selected, setSelectedId] = React.useState<number | null>(null);
  const [date, setDate] = React.useState(birthday);
  const [showDate, setShowDate] = React.useState(false);

  const handleImageSelect = React.useCallback(async() => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }, []);

  // data serializing
  const renderStates = React.useCallback(() => {
    return (States as IState[]).filter((item) => item.country_id === selected).map((item) => item.name);
  }, [selected])
  const [countries, setCountries] = React.useState((Data as ICountry[]).map((item) => item.name));

  React.useEffect(() => {
    setSelectedId(Data.filter((item) => item.name === nation).map((item) => item.id)[0])
  });

  // function
  const handleSelectCountry = (val: string) => {
    setSelectedId(Data.filter((item) => item.name === val).map((item) => item.id)[0])
    setCountry(val);
  }

  const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShowDate(false);
    setDate(selectedDate.toDateString());
  }
  return (
    <Box flex={1} backgroundColor='mainBackGroundColor'>
      <SettingsHeader title='Profile' showSave rightItem={<></>} handleArrowPressed={() => navigation.goBack()} />

      <Box flexDirection='row' paddingHorizontal='m' marginTop='m' alignItems='center'>
        <Pressable style={{ width: 50, height: 50, borderRadius: 25, overflow: 'hidden', marginRight: 10 }} onPress={handleImageSelect} >
          <Image source={{ uri: image.startsWith('file') ? image:`${IMAGE_BASE}${image}` }}  style={{ width: '100%', height: '100%' }} contentFit='cover' />
        </Pressable>

        <Box>
          <CustomText variant='body'>{name}</CustomText>
          <CustomText variant='xs'>@{username}</CustomText>
        </Box>
      </Box>

      {/* MAIN SECTION */}

      <Box marginTop='l'>
        <ScrollView contentContainerStyle={{ paddingBottom: 400, paddingHorizontal: 20, paddingTop: 20 }}>
          <Editable title='Email' value={email} showEditIcon={false}  />
          <Editable title='name' value={fullname} showEditIcon={true}  />
          <Editable title='About' subtitle='A brief description of yourself shown on your profile' value={about} showEditIcon={true} textarea  />
          <CustomDropDwon title='Gender' options={['Male', 'Female']} value={sex} onSelected={(val) => setSex(val)} />
          <CustomDropDwon title='country' options={Data.map((item) => item.name)} value={country} onSelected={(val) => handleSelectCountry(val)} />
          <CustomDropDwon title='State' options={renderStates()} value={state} onSelected={(val) => setState(val)} />

          <Box>
            <CustomText variant='subheader' fontSize={16}>Birth date</CustomText>
            <CustomText variant='body' marginTop='s' onPress={() => setShowDate(true)}>{moment(date).format('YYYY-MM-DD')}</CustomText>
          </Box>
          { showDate && <DateTimePicker 
            mode='date'
            display='calendar'
            onChange={handleDateChange} 
            maximumDate={new Date(moment().subtract(10, 'years').format('YYYY-MM-DD'))}
            value={moment(date).toDate()} 
            themeVariant={ isDarkMode ? 'dark' : 'light'}
          /> }
        </ScrollView>
      </Box>
    </Box>
  )
}

export default Profile