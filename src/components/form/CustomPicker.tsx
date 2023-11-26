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


export interface ICountry {
    code: string,
    name: string
  }
  
  const CustomModal = ({visible, children, toggleModal, handleSelect, data}) => {
    const handlePress = React.useCallback((item: string) => {
      handleSelect(item);
      toggleModal();
    }, []);
    return (
      <Box width='100%' height={300}>
        <FlashList 
        data={data as string[]}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={60}
        renderItem={({item, index}) => (
          <Pressable style={{ width: '100%' }} onPress={() => handlePress(item)}>
            <Box height={60} key={index} flexDirection='row' justifyContent='flex-start' alignItems='center' paddingHorizontal='m'>
              <CustomText variant='body' marginLeft='s'>{item}</CustomText>
            </Box>
          </Pressable>
        )}
      />
      </Box>
    )
  }
  
  
  const CustomPickerHeader = ({ name, label }: { name: string, label: string }) => {
    const theme = useTheme<Theme>();
  
    return (
     <>
        <CustomText variant='body' marginTop='m'>{label}</CustomText>
        <Box width='100%' height={50} marginTop='s' borderRadius={10} borderWidth={2} borderColor='secondaryBackGroundColor' flexDirection='row' justifyContent='space-between' alignItems='center' paddingHorizontal='m'>
  
        <Box flexDirection='row' alignItems='center'>
          <CustomText variant='body' marginLeft='s'>{name}</CustomText>
        </Box>
  
        <Feather name='chevron-down' size={20} color={theme.colors.textColor} />
        </Box>
     </>
    )
  }

const CustomPicker = ({ onPicked, data, label }: { onPicked: (data: string) => void, data: string[], label: string}) => {
   const [selected, setSelected] = React.useState<ICountry>({ code: 'NG', name: 'Nigeria' });
   // state
  const [val, setVal] = React.useState(null);

  const handleSelect = (item: string) => {
    setVal(item);
    onPicked(item);
  }
  return (
    <Picker
    renderPicker={() => <CustomPickerHeader {...selected} name={val || data[0]} label={label} />}
    value={val}
    placeholder={'Placeholder'}
    renderCustomModal={(props: any) => (
      <>
        { props.visible && <CustomModal {...props} handleSelect={handleSelect} data={data} />}
      </>
    ) }
  />
  )
}

export default CustomPicker