import { View, Text, Pressable } from "react-native";
import React from "react";
// import CountrySelectDropdown from "react-native-searchable-country-dropdown"
import Box from "../../components/general/Box";
import CustomText from "../../components/general/CustomText";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import useImage from "../../hooks/useImage";
// import { Picker } from 'react-native-ui-lib'
// const { getNames, getCodes, getCodeList, getData } = require('country-list');
// import Flag from 'react-native-flags';
import { Feather } from "@expo/vector-icons";
import CountryPicker from "../../components/form/CountryPicker";
// import { FlatList } from 'react-native-gesture-handler'
import CustomPicker from "../../components/form/CustomPicker";
import GenderPicker from "../../components/form/GenderPicker";
import { ICountry } from "../../models/country";
import States from "../../utils/states.json";
import { IState } from "../../models/state";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import NormalButton from "../../components/general/NormalButton";
import { useMutation } from "react-query";
import httpService from "../../utils/httpService";
import { URLS } from "../../services/urls";
import { useUtilState } from "../../states/util";
import { RootStackParamList } from "../../navigation/MainNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import PopupModal from "./PopupModal";

const Setup = ({ navigation }: NativeStackScreenProps<RootStackParamList>) => {
  const [selected, setSelected] = React.useState<ICountry>({
    id: 158,
    name: "Nigeria",
    short_name: "NG",
    flag_img: "wisdom_countrypkg/img/country_flags/NG.png",
    country_code: "234",
    created_at: "2023-03-20T10:17:12.000000Z",
    updated_at: "2023-03-20T12:32:26.000000Z",
    flag_emoji: "",
  });
  const theme = useTheme<Theme>();
  const image = useImage({ width: 70, height: 70 });
  const [date, setDate] = React.useState("");
  const [showDate, setShowDate] = React.useState(false);
  const { isDarkMode, setAll } = useUtilState((state) => state);
  const [gender, setGender] = React.useState("male");
  const [state, setState] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) =>
      httpService.post(`${URLS.UPDATE_COUNTRY_SATE}`, data),
    onError: (error: any) => {
      alert(error.message);
    },
    onSuccess: (data: any) => {
      setShowModal(true);
      setAll({ isLoggedIn: true });
    },
  });

  const handleSelect = (item: ICountry) => {
    setSelected(item);
  };

  const renderStates = React.useCallback(() => {
    return (States as IState[])
      .filter((item) => item.country_id === selected.id)
      .map((item) => item.name);
  }, [selected.id]);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShowDate(false);
    setDate(selectedDate.toDateString());
  };

  const handleSubmit = React.useCallback(() => {
    if (state === "" || date === "" || gender === "") {
      alert("Please fill out the form");
      return;
    }
    const obj = {
      country: selected.name,
      state,
      birthday: date,
      gender: gender,
    };
    mutate(obj);
  }, [date, gender, selected, state]);

  return (
    <Box
      backgroundColor="mainBackGroundColor"
      flex={1}
      paddingTop="xl"
      paddingHorizontal="m"
    >
      <PopupModal visible={showModal} />
      <Box flex={1}>
        <Box
          width="100%"
          height={100}
          justifyContent="center"
          alignItems="center"
        >
          {image()}
        </Box>
        <CustomText variant="subheader">Where are you from?</CustomText>

        <CountryPicker onPicked={handleSelect} />

        <CustomPicker
          onPicked={(data) => setState(data)}
          data={renderStates()}
          label="State"
        />

        <GenderPicker onChange={(gen: string) => setGender(gen)} />

        <CustomText variant="body" mt="l">
          Date of birth
        </CustomText>

        <Box
          width="100%"
          height={50}
          borderRadius={10}
          borderWidth={2}
          borderColor="secondaryBackGroundColor"
        >
          <Pressable
            onPress={() => setShowDate(true)}
            style={{
              flexDirection: "row",
              flex: 1,
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}
          >
            <CustomText variant="body">{date}</CustomText>
            <Feather
              name="chevron-down"
              size={25}
              color={theme.colors.textColor}
            />
          </Pressable>
        </Box>

        {showDate && (
          <DateTimePicker
            mode="date"
            display="calendar"
            onChange={handleDateChange}
            maximumDate={
              new Date(moment().subtract(10, "years").format("YYYY-MM-DD"))
            }
            value={new Date()}
            themeVariant={isDarkMode ? "dark" : "light"}
          />
        )}
      </Box>

      <Box flex={0.2}>
        <NormalButton label="Next" action={handleSubmit} isLoading={isLoading} />
      </Box>
    </Box>
  );
};

export default Setup;
