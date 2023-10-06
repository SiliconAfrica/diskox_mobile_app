import { Pressable } from 'react-native'
import React from 'react'
import { Picker } from 'react-native-ui-lib'
import { FlashList } from "@shopify/flash-list";
const { getNames, getCodes, getCodeList, getData } = require('country-list');
import Flag from 'react-native-flags';
import { Feather } from '@expo/vector-icons'
import Box from '../general/Box';
import CustomText from '../general/CustomText';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { ICountry } from '../../models/country';
import Data from '../../utils/countries.json';


// export interface ICountry {
//     code: string,
//     name: string
//   }
  
  const CustomModal = ({visible, children, toggleModal, handleSelect}) => {
    const [countries, setCountries] = React.useState<ICountry[]>([]);

    const handlePress = React.useCallback((item: ICountry) => {
      handleSelect(item);
      toggleModal();
    }, []);
    return (
      <Box width='100%' height={300}>
        <FlashList 
        data={Data as ICountry[]}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={60}
        renderItem={({item, index}) => (
          <Pressable style={{ width: '100%' }} onPress={() => handlePress(item)}>
            <Box height={60} key={index} flexDirection='row' justifyContent='flex-start' alignItems='center' paddingHorizontal='m'>
              {/* <Flag code={item.country_code} size={32} type="flat" /> */}
              <CustomText variant='body' marginLeft='s'>{item.name}</CustomText>
            </Box>
          </Pressable>
        )}
      />
      </Box>
    )
  }
  
  
  const CustomPicker = ({ country_code, name }: ICountry) => {
    const theme = useTheme<Theme>();
  
    return (
     <>
        <CustomText variant='body' marginTop='m'>Country</CustomText>
        <Box width='100%' height={50} marginTop='s' borderRadius={10} borderWidth={2} borderColor='secondaryBackGroundColor' flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='m'>
  
        <Box flexDirection='row' alignItems='center'>
          {/* <Flag code={country_code} size={32} type="flat" /> */}
          <CustomText variant='body' marginLeft='s'>{name}</CustomText>
        </Box>
  
        <Feather name='chevron-down' size={20} color={theme.colors.textColor} />
        </Box>
     </>
    )
  }

const CountryPicker = ({ onPicked }: { onPicked: (data: ICountry) => void}) => {
   const [selected, setSelected] = React.useState<ICountry>({
    "id": 158,
    "name": "Nigeria",
    "short_name": "NG",
    "flag_img": "wisdom_countrypkg/img/country_flags/NG.png",
    "country_code": "234",
    "created_at": "2023-03-20T10:17:12.000000Z",
    "updated_at": "2023-03-20T12:32:26.000000Z",
    "flag_emoji": ""
});
   // state
  const [val, setVal] = React.useState('');

  const handleSelect = (item: ICountry) => {
    setVal(item.name);
    setSelected(item);
    onPicked(item);
  }
  return (
    <Picker
    renderPicker={() => <CustomPicker {...selected} />}
    value={val}
    placeholder={'Placeholder'}
    onChange={(value) => console.log(value)}
    renderCustomModal={(props: any) => (
      <>
        { props.visible && <CustomModal {...props} handleSelect={handleSelect} />}
      </>
    ) }
  />
  )
}

export default CountryPicker