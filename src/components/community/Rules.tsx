import { View, Text } from 'react-native'
import React from 'react'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import { Feather } from '@expo/vector-icons'
import { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../theme'
import { ScrollView } from 'react-native-gesture-handler'

const Accordion = () => {
  const theme = useTheme<Theme>();
  const [show, setShow] = React.useState(false);
  return (
    <Box width='100%' justifyContent='center' paddingVertical='s' borderBottomColor='secondaryBackGroundColor' borderBottomWidth={2} paddingHorizontal='m'>
      <Box borderBottomColor='secondaryBackGroundColor' borderBottomWidth={show ? 2:0} paddingBottom='s' flexDirection='row' width='100%' justifyContent='space-between' alignItems='center'>
        <Box flexDirection='row' alignItems='center'>
          <Box width={2} height={2} borderRadius={1} backgroundColor='black' />
          <CustomText variant='body' fontSize={16} marginLeft='m'>No hate speech or bullying acts</CustomText>
        </Box>
        <Feather name={show ? 'chevron-up' : 'chevron-down' } size={25} color={theme.colors.textColor} onPress={() => setShow(prev => !prev)} />
      </Box>
      { show && (
        <Box paddingVertical='s' maxHeight={150} overflow='hidden'>
          <ScrollView>
            <CustomText>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus voluptatibus deserunt vitae ipsum, sunt nobis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt nulla iste dicta minus necessitatibus fuga ratione possimus! Asperiores commodi similique dolorem fuga illo ad vel sit dolore? Veniam earum nostrum, inventore unde velit, sunt hic quis ea magnam consectetur tenetur. Facere officia, quod pariatur a soluta officiis ad, commodi voluptate qui ullam perferendis id, ea temporibus tempora. Alias, debitis doloribus molestiae dolores inventore facilis earum iste blanditiis vitae itaque autem, maxime voluptatum odio aliquam incidunt fuga ut rem, possimus ex ea neque aliquid ipsa officiis. Rerum necessitatibus dignissimos soluta dolorum. Eaque suscipit rem illo aliquid id sequi quia, natus quos, aperiam cum ab aspernatur voluptatibus laboriosam debitis itaque ipsam numquam fugiat sunt, accusamus asperiores a laudantium distinctio quam accusantium. Tempore nemo quisquam soluta cupiditate enim voluptates sunt reiciendis ab aspernatur inventore voluptatibus facilis excepturi amet, culpa iste blanditiis doloremque accusamus eum numquam cumque adipisci. Nulla maxime quae iusto dolorum, laborum fugit consectetur excepturi natus soluta dolor corrupti delectus vel magnam quaerat voluptate facere ipsa, adipisci neque porro doloribus at laudantium ea autem? Fugiat placeat nam illum alias! Quisquam beatae, blanditiis ea libero veniam illum voluptatibus eum dolores! Sint explicabo harum illum amet non doloribus deserunt, quos mollitia quis. Atque, impedit.</CustomText>
            </ScrollView>
        </Box>
      )}
    </Box>
  )
}

const Rules = () => {

  return (
    <Box flex={1} padding='m'>

      <Box marginTop='l' width='100%' borderRadius={10} borderWidth={2} borderColor='secondaryBackGroundColor' paddingBottom='s'>
        <Box width='100%' padding='m' borderBottomWidth={2} borderBottomColor='secondaryBackGroundColor'>
        <CustomText variant='subheader' fontSize={18}>Our rules & regulations</CustomText>
        </Box>

        <Accordion />
        <Accordion />
        <Accordion />
        <Accordion />
        <Accordion />
        <Accordion />
        <Accordion />
        <Accordion />
        <Accordion />
        <Accordion />
        <Accordion />
        <Accordion />
        <Accordion />
      </Box>  

    </Box>
  )
}

export default Rules