import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Box from '../../../../../components/general/Box'
import CustomText from '../../../../../components/general/CustomText'
import { Ionicons, Feather } from '@expo/vector-icons'
import { useTheme } from '@shopify/restyle'
import { Theme } from '../../../../../theme'

const SectionHeader = ({ icon, title, color = undefined }: {
    icon: JSX.Element,
    title: string,
    color?: string 
}) => {
    const theme = useTheme<Theme>();
    return (
        <Box flexDirection='row' alignItems='center' paddingHorizontal='m' marginTop='m'>
            { icon }
            <CustomText variant='body' marginLeft='m' style={{ color: color !== undefined ? color:theme.colors.textColor}}>{title || ''}</CustomText>
        </Box>
    )
}

const ListItem = ({ action, title }: {
    title: string,
    action: () => void
}) => {
    const theme = useTheme<Theme>();

    return (
        <Pressable style={{ flexDirection: 'row', width: '100%', height: 40,  alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 0, marginTop: 25 }} onPress={action}>
            <CustomText variant='body' marginLeft='m'>{title || ''}</CustomText>
            <Feather name='chevron-right' size={30} color={theme.colors.textColor} />
        </Pressable>
    )
}

const Settings = () => {
    const theme = useTheme<Theme>();
  return (
    <Box flex={1}>
        {/* SETTINGS SECTION */}
        <SectionHeader title={"Community settings"} icon={<Ionicons name='person' size={25} color={theme.colors.textColor}  />} />
        <ListItem title='Profile' action={() => {}} />
        <ListItem title='Community type' action={() => {}} />
        <ListItem title='Member request' action={() => {}} />
        <ListItem title='All members' action={() => {}} />

        {/* MANAGEMENT SECTION */}
        <SectionHeader title={"Management"} icon={<Ionicons name='settings-outline' size={25} color={theme.colors.textColor}  />} />
        <ListItem title='Post approval' action={() => {}} />
        <ListItem title='Moderators' action={() => {}} />
        <ListItem title='Suspended' action={() => {}} />
        <ListItem title='Blocked' action={() => {}} />
        <ListItem title='Invite' action={() => {}} />

        {/* RULES SECTION */}
        <SectionHeader title={"Rules & Regulations"} icon={<Ionicons name='file-tray-stacked' size={25} color={theme.colors.textColor}  />} />
        <ListItem title='Rules' action={() => {}} />
        <ListItem title='Removal reason' action={() => {}} />
        <ListItem title='Content controls' action={() => {}} />

        <SectionHeader title={"DELETE COMMUNITY"} icon={<Ionicons name='trash-outline' size={25} color={'red'} />} color='red' />
    </Box>
  )
}

export default Settings