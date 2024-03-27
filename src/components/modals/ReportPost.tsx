import { View, Text, Pressable, useWindowDimensions } from 'react-native'
import React from 'react'
import ReactNavtieModalWrapper from '../ReactNavtieModalWrapper'
import { useModalState } from '../../states/modalState'
import { Theme } from '../../theme'
import { useTheme } from '@shopify/restyle'
import Box from '../general/Box'
import CustomText from '../general/CustomText'
import { Feather, Ionicons } from '@expo/vector-icons';
import {ScrollView, TextInput} from 'react-native-gesture-handler'
import PrimaryButton from '../general/PrimaryButton'
import { useMutation } from 'react-query'
import httpService from '../../utils/httpService'
import { URLS } from '../../services/urls'
import useToast from '../../hooks/useToast'
import { useUtilState } from '../../states/util'


// Hey, I’m on diskox, to stay connected with family and friends. 
// Sign up with my referral code and get 1pt on your diskox wallet
// Referral code: dandolla98
type IReport = {
    name: string;
    description: string;
}

const Reports: IReport[] = [
    {
        name: 'Spam',
        description: 'Is the post unsolicited or a repetitive message, with the intention of promoting products, services, or websites?',
    },
    {
        name: "Harrasment",
        description: 'Does this post target individuals or groups with persistent, unwanted actions, comments, or messages, causing emotional distress or discomfort?'
    },
    {
        name: 'Threatening violence',
        description: 'Is this post or message inciting violence or encourage others to engage in harmful actions?',
    },
    {
        name: 'Hate',
        description: 'Does this post content express hostility, discrimination or prejudice against factors such as race, ethnicity, religion, gender or any other protected characteristics?'
    },
    {
        name: 'Self-harm or suicide',
        description: 'Does post encourage, glorify or provide instructions for self-harm or suicide? Does it include messages promoting dangerous behaviors that could lead to harm or loss of life?',
    },
    {
        name: 'Fraud or scam',
        description: 'This violation involves deceptive or dishonest activities aimed at tricking individuals into providing personal information, financial details, or engaging in transactions with fraudulent intent.'
    },
    {
        name: 'Misinformation', 
        description: 'This violation refers to spreading false or misleading information that could harm individuals, damage reputations or deceive others.'
    },
    {
        name: 'Other',
        description: 'This option is for reporting violations that do not fit into any specific category mentioned above. Users can provide details about the nature of the violation, allowing moderators to assess and address the situation accordingly.'
    }
]

const ReportItem = ({isActive, item, markAsActive, isDescriptionActive, showDescription}: {
    item: IReport,
    isActive: boolean
    markAsActive: (item: string) => void,
    isDescriptionActive: boolean,
    showDescription: () => void
}) => {
    const theme = useTheme<Theme>();
    const { setAll } = useModalState((state) => state);
    const { isDarkMode } = useUtilState((state) => state)
    return (
        <Box flexDirection='row' width={'100%'} height={50} alignItems='center' zIndex={15}>
            <Pressable onPress={() => markAsActive(item.name)} style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isActive ? theme.colors.primaryColor : isDarkMode ? theme.colors.fadedButtonBgColor: theme.colors.grey,
            }}>
                { isActive && <Feather name='check' size={13} color={'white'} /> }
            </Pressable>
            <CustomText marginHorizontal='m'>{item.name}</CustomText>
            <Pressable
            onPress={() => showDescription()}
            style={{
                width: 25,
                height: 25,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isDescriptionActive ? theme.colors.primaryColor:'#6a7280',
            }}>
                <Ionicons name='information-outline' color={theme.colors.white} selectable selectionColor={theme.colors.primaryColor} size={15} />
                { isDescriptionActive && (
                    <Box zIndex={20} width={200} bottom={30} right={-100} position='absolute' borderRadius={10} bg='mainBackGroundColor' padding='s'>
                        <CustomText variant='xs'>{item.description}</CustomText>
                    </Box>
                )}
                {/* <Feather name='info' size={15} color={'black'} /> */}
            </Pressable>
        </Box>
    )
}

const ReportPost = () => {
    const [activeReport, setActiveReport] = React.useState('');
    const [activeDescription, steActiveDescription] = React.useState('');
    const [activeIndex, setActiveIndex] = React.useState<number|null>(null);
    const [text, setText] = React.useState('');
    const { height: HEIGHT } = useWindowDimensions();

    const { showReportPost, activePost, setAll } = useModalState((state) => state);
    const theme = useTheme<Theme>();
    const toast = useToast();

    const handleShowDescription = (item: string, index: number) => {
        if (item === activeDescription) {
            steActiveDescription('');
            setActiveIndex(null);
        } else {
            steActiveDescription(item);
            setActiveIndex(index)
        }
    }

    const { mutate, isLoading } = useMutation({
        mutationFn: (data: FormData) => httpService.post(`${URLS.REPORT_USER}`, data),
        onSuccess: (data) => {
            toast.show(data.data.message,{ type: 'success', animationType: 'zoom-in' });
            setAll({ showReportPost: false, activePost: null });
        },
        onError: (error:any) => {
            toast.show(error.message, { type: 'error', animationType: 'zoom-in' });
        }
    });

    const report = () => {
        if (activeReport === '' || activePost?.id === null) {
            toast.show('You have to select an option', { type: 'warning' })
        }
        const formData = new FormData();
        formData.append('post_id', activePost?.id.toString());
        formData.append('reason', activeReport === 'Other' ? text:activeReport);
        mutate(formData);
    }
  return (
    <ReactNavtieModalWrapper isVisible={showReportPost} height={ activeReport !== 'Other' ? (HEIGHT / 100 * 60): (HEIGHT / 100 * 70)} backgroundColor={theme.colors.secondaryBackGroundColor} >
        <Box width='100%' padding='m' position='relative'>

            <Box flexDirection='row' width='100%' justifyContent='space-between' alignItems='center' position='relative' zIndex={2}>
                <CustomText variant='subheader'>Report User</CustomText>
                <Feather name='x' onPress={() => setAll({ showReportPost: false })} color={theme.colors.textColor} size={30} />
            </Box>

            <CustomText marginTop='s'>If this user has violated any of our community guidelines, let us know what happened and we will look into it.</CustomText>
            <Box width='100%' height={'65%'} marginVertical='s' overflow='visible' zIndex={9} position='relative'>
                <ScrollView style={{ position: 'relative', zIndex: 10 }} contentContainerStyle={{ width: '100%', paddingTop: activeDescription !== '' && activeIndex === 0 || activeIndex === 1 ?100:0, paddingBottom: 20 }}>
                    { Reports.map((item, index) => (
                        <ReportItem key={index.toString()} isActive={activeReport === item.name} item={item} markAsActive={() => setActiveReport(item.name)} isDescriptionActive={activeDescription === item.name} showDescription={() => handleShowDescription(item.name, index)} />
                    ))}
                    { activeReport === 'Other' && (
                        <TextInput value={text} onChangeText={(e) => setText(e)} style={{
                            fontFamily: 'RedRegular',
                            fontSize: 16,
                            width: '100%',
                            height: 45,
                            borderRadius: 10,
                            backgroundColor: theme.colors.mainBackGroundColor,
                            color: theme.colors.textColor,
                            paddingHorizontal: 10,
                        }}
                                   placeholderTextColor={theme.colors.textColor}
                                   placeholder={'Enter your reason here'}
                        />
                    )}
                </ScrollView>
            </Box>



            <Box width='100%' height={50} flexDirection='row' justifyContent='flex-end' alignItems='center'>
                <CustomText marginRight='m' onPress={() => setAll({ showReportPost: false })}>Cancel</CustomText>
                <PrimaryButton title='Submit' onPress={report} height={40} isLoading={isLoading} />
            </Box>

        </Box>
    </ReactNavtieModalWrapper>
  )
}

export default ReportPost