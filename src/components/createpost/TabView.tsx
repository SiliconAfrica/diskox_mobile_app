import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Box from '../general/Box';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../theme';
import { Feather } from '@expo/vector-icons'
import CustomText from '../general/CustomText';

// import { Container } from './styles';

export enum TAB_BAR_ENUM {
    POST = 1,
    QUESTION,
    POLL
}

interface IProps {
    setActive: (num: number) => void;
    active?: number;
}

/**
+ * Renders a tab view component.
+ *
+ * @param {({ setActive }: { setActive: (num: number) => void })} props - The props object containing the setActive function.
+ * @return {React.ReactNode} - The rendered tab view component.
+ */


const TabView: React.FC<IProps> = ({ setActive, active }: { setActive: (num: number) => void, active: number }) => {
    const theme = useTheme<Theme>();

    const setActiveTab = React.useCallback((tab: TAB_BAR_ENUM) => {
        setActive(tab);
    }, [])
  return (
        <Box width='100%' height={60} flexDirection='row' borderBottomWidth={1} borderBottomColor='secondaryBackGroundColor' paddingHorizontal='m'>

            <Box flexDirection='row' width='100%'>

                <Pressable onPress={() => setActiveTab(TAB_BAR_ENUM.POST)} style={{ ...style.button, borderBottomWidth: active === TAB_BAR_ENUM.POST ? 2 : 0, borderBottomColor: theme.colors.primaryColor }}>
                    <Feather name='file-text' size={25} color={active === TAB_BAR_ENUM.POST ? theme.colors.primaryColor : theme.colors.textColor} />
                    <CustomText variant='body' marginLeft='s' color={active === TAB_BAR_ENUM.POST ? 'primaryColor':'textColor'}>Post</CustomText>
                </Pressable>

                <Pressable onPress={() => setActiveTab(TAB_BAR_ENUM.QUESTION)} style={{ ...style.button, borderBottomWidth: active === TAB_BAR_ENUM.QUESTION ? 2 : 0, borderBottomColor: theme.colors.primaryColor }}>
                    <Feather name='help-circle' size={25} color={active === TAB_BAR_ENUM.QUESTION ? theme.colors.primaryColor : theme.colors.textColor} />
                    <CustomText variant='body' marginLeft='s' color={active === TAB_BAR_ENUM.QUESTION ? 'primaryColor':'textColor'}>Question</CustomText>
                </Pressable>

                <Pressable onPress={() => setActiveTab(TAB_BAR_ENUM.POLL)} style={{ ...style.button, borderBottomWidth: active === TAB_BAR_ENUM.POLL ? 2 : 0, borderBottomColor: theme.colors.primaryColor }}>
                    <Feather name='list' size={25} color={active === TAB_BAR_ENUM.POLL ? theme.colors.primaryColor : theme.colors.textColor} />
                    <CustomText variant='body' marginLeft='s' color={active === TAB_BAR_ENUM.POLL ? 'primaryColor':'textColor'}>Poll</CustomText>
                </Pressable>

            </Box>

        </Box>
  )
}

const style = StyleSheet.create({
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'row',
    }
});

export default TabView;