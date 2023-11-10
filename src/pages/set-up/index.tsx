import { View, Text, Pressable } from "react-native";
import React, { useEffect } from "react";
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
import Countries from "../../utils/countries.json";
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
import CustomDropdown from "../../components/form/CustomDropdown";
import useToast from "../../hooks/useToast";

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
  const toast = useToast();
  const image = useImage({ width: 70, height: 70 });
  const [date, setDate] = React.useState("");
  const [showDate, setShowDate] = React.useState(false);
  const { isDarkMode, setAll } = useUtilState((state) => state);
  const [gender, setGender] = React.useState("male");
  const [state, setState] = React.useState("");
  const [years, setYears] = React.useState<{ value: string }[]>([]);
  const [months, setMonths] = React.useState<
    { label: String; value: string }[]
  >([]);
  const [days, setDays] = React.useState<{ value: string }[]>([]);
  const [selectedDate, setSelectedDate] = React.useState({
    year:
      years.length > 0
        ? years[years.length - 1].value
        : Number(new Date().getFullYear()) - 13,
    month: months.length > 0 ? months[0].value : 0,
    day: 1,
  });
  const [showModal, setShowModal] = React.useState(false);

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: any) =>
      httpService.post(`${URLS.UPDATE_COUNTRY_SATE}`, data),
    onError: (error: any) => {
      // alert(error.message);
      toast.show(error.message, { type: "danger", placement: "top" });
    },
    onSuccess: (data: any) => {
      setShowModal(true);
      setAll({ isLoggedIn: true });
    },
  });

  // const handleSelect = (item: ICountry) => {
  //   setSelected(item);
  // };
  const handleSelect = (item) => {
    setSelected(item);
  };

  // const renderStates = React.useCallback(() => {
  //   return (States as IState[])
  //     .filter((item) => item.country_id === selected.id)
  //     .map((item) => item.name);
  // }, [selected.id]);
  const renderStates = React.useCallback(() => {
    return (States as IState[])
      .filter((item) => item.country_id === selected.id)
      .map((item) => ({ label: item.name }));
  }, [selected.id]);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShowDate(false);
    setDate(selectedDate.toDateString());
  };

  const handleSubmit = React.useCallback(() => {
    if (state === "" || date === "" || gender === "") {
      // alert("Please fill out the form");
      toast.show("Please fill out the form", {
        type: "danger",
        placement: "top",
      });
      return;
    }
    const obj = {
      country: selected.name,
      state,
      birthday: date,
      gender: gender,
    };
    mutate(obj);
  }, [date, selectedDate, gender, selected, state]);

  const handleSelectDate = (type: "year" | "month" | "day", value) => {
    if (type === "year") {
      setSelectedDate({ ...selectedDate, year: value });
    } else if (type === "month") {
      setSelectedDate({ ...selectedDate, month: value });
    } else if (type === "day") {
      setSelectedDate({ ...selectedDate, day: value });
    }
  };

  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const eligibleYearStart = Number(currentYear) - 13;
    const eligibleYearEnd = Number(currentYear) - 110;
    let theYears = [];
    for (let i = eligibleYearStart; i > eligibleYearEnd; i--) {
      theYears = [...theYears, { value: i }];
    }
    setYears([...theYears]);
  };

  const getMonths = () => {
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let theMonths = [];
    for (let i = 0; i < 12; i++) {
      theMonths = [...theMonths, { label: month[i], value: i }];
    }
    setMonths([...theMonths]);
  };
  const getDays = () => {
    let theDays = [];
    for (let i = 1; i < 32; i++) {
      if (selectedDate.month === 1 && i === 30) {
        break;
      } else if (
        (selectedDate.month === 3 ||
          selectedDate.month === 5 ||
          selectedDate.month === 8 ||
          selectedDate.month === 10) &&
        i === 31
      ) {
        break;
      }
      theDays = [...theDays, { value: i }];
    }
    setDays([...theDays]);
  };
  useEffect(() => {
    getYears();
    getMonths();
    getDays();
  }, []);
  useEffect(() => {
    const yyyy = Number(selectedDate.year);
    const mm = Number(selectedDate.month);
    const dd = Number(selectedDate.day);

    const theDate = new Date(yyyy, mm, dd);
    setDate(theDate.toDateString());
  }, [selectedDate]);
  useEffect(() => {
    getDays();
  }, [selectedDate.month]);
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

        {/* <CountryPicker onPicked={handleSelect} /> */}
        <CustomDropdown
          label="Country"
          options={Countries}
          labelField="name"
          valueField="name"
          placeholder="Nigeria"
          onChange={handleSelect}
          search
        />
        <CustomDropdown
          label="State"
          options={renderStates()}
          labelField="label"
          valueField="label"
          onChange={(data) => setState(data.label)}
          search
        />

        {/* <CustomPicker
          onPicked={(data) => setState(data)}
          data={renderStates()}
          label="State"
        /> */}

        <GenderPicker onChange={(gen: string) => setGender(gen)} />

        <CustomText variant="body" mt="l">
          Date of birth
        </CustomText>

        <Box flexDirection="row" justifyContent="space-between">
          <CustomDropdown
            boxStyle={{ width: "30%" }}
            options={years}
            labelField="value"
            valueField="value"
            placeholder={years.length > 0 ? years[0].value : ""}
            onChange={(value) => handleSelectDate("year", value.value)}
          />
          <CustomDropdown
            boxStyle={{ width: "35%" }}
            options={months}
            labelField="label"
            valueField="value"
            placeholder={months.length > 0 && months[0].label.toString()}
            onChange={(value) => handleSelectDate("month", value.value)}
          />
          <CustomDropdown
            boxStyle={{ width: "30%" }}
            options={days}
            labelField="value"
            valueField="value"
            placeholder={days.length > 0 && days[0].value}
            onChange={(value) => handleSelectDate("day", value.value)}
          />
        </Box>
        {/* <Box
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
        )} */}
      </Box>

      <Box flex={0.2}>
        <NormalButton
          label="Next"
          action={handleSubmit}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default Setup;
