import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import Box from "../../../../components/general/Box";
import SettingsHeader from "../../../../components/settings/Header";
import { useDetailsState } from "../../../../states/userState";
import { Image } from "expo-image";
import httpService, { IMAGE_BASE } from "../../../../utils/httpService";
import CustomText from "../../../../components/general/CustomText";
import Editable from "../../../../components/profile/Editable";
import CustomDropDwon from "../../../../components/general/DropDown";
import CountryPicker from "../../../../components/form/CountryPicker";
import { ScrollView } from "react-native-gesture-handler";
import Data from "../../../../utils/countries.json";
import States from "../../../../utils/states.json";
import { ICountry } from "../../../../models/country";
import { IState } from "../../../../models/state";
import moment from "moment";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as SecureStorage from "expo-secure-store";
import { useUtilState } from "../../../../states/util";
import * as ImagePicker from "expo-image-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../../navigation/MainNavigation";
import { useMutation, useQueryClient } from "react-query";
import { URLS } from "../../../../services/urls";
import useToast from "../../../../hooks/useToast";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../../../theme";
import { Ionicons } from "@expo/vector-icons";
import mime from "mime";
import { useMultipleAccounts } from "../../../../states/multipleAccountStates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handlePromise } from "../../../../utils/handlePomise";
import GenderPicker from "../../../../components/form/GenderPicker";
import CustomDropdown from "../../../../components/form/CustomDropdown";

const Profile = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "profile-setting">) => {
  const theme = useTheme<Theme>();
  const { isDarkMode } = useUtilState((state) => state);
  const { refreshAccounts } = useMultipleAccounts((state) => state);
  const {
    profile_image,
    phone_number,
    name,
    describes_you,
    username,
    email: userEmail,
    about,
    gender,
    country: nation,
    state: MyState,
    birthday,
    setAll,
  } = useDetailsState((state) => state);
  const [sex, setSex] = React.useState<"male" | "female" | any>(gender);
  const [image, setImage] = React.useState(profile_image);
  const [fullname, setFullname] = React.useState(name === "null" ? "" : name);
  const [email, setEmail] = React.useState(userEmail);
  const [description, setDescription] = React.useState(
    describes_you === "null" ? "" : describes_you
  );
  console.log({ describes_you });
  const [country, setCountry] = React.useState(nation);
  const [state, setState] = React.useState(MyState);
  const [selected, setSelectedId] = React.useState<number | null>(null);
  const [date, setDate] = React.useState(birthday);
  const [showDate, setShowDate] = React.useState(false);
  const [years, setYears] = React.useState<{ value: string }[]>([]);
  const [months, setMonths] = React.useState<
    { label: String; value: string }[]
  >([]);
  const [days, setDays] = React.useState<{ value: string }[]>([]);
  const [selectedDate, setSelectedDate] = React.useState({
    year: birthday
      ? new Date(Date.parse(birthday)).getFullYear()
      : years.length > 0
      ? years[years.length - 1].value
      : Number(new Date().getFullYear()) - 13,
    month: birthday
      ? new Date(Date.parse(birthday)).getMonth()
      : months.length > 0
      ? months[0].value
      : 0,
    day: birthday ? new Date(Date.parse(birthday)).getDate() : 1,
  });
  const [file, setFile] = React.useState<ImagePicker.ImagePickerAsset | null>(
    null
  );

  const queryClient = useQueryClient();

  const toast = useToast();

  const { isLoading, mutate } = useMutation({
    mutationFn: (data: FormData) =>
      httpService.post(`${URLS.UPDATE_PROFILE}`, data),
    onSuccess: async (data) => {
      toast.show("Profile updated successfully", { type: "success" });
      setAll({ ...data?.data?.data });
      const [saveUser, saveUserErr] = await handlePromise(
        AsyncStorage.setItem(`user`, JSON.stringify(data?.data?.data))
      );
      refreshAccounts(data?.data?.data);
      queryClient.invalidateQueries(["getLoggedInDetails"]);
      setFile(null);
      navigation.navigate("home");
    },
    onError: (error: any) => {
      toast.show(error?.message || "An error occured", { type: "error" });
    },
  });
  const handleSubmit = () => {
    if (isLoading) return;
    const formData = new FormData();
    formData.append("country", country);
    formData.append("state", state);
    formData.append("describes_you", description);
    formData.append("phone_number", phone_number);
    formData.append("gender", sex);
    formData.append("birthday", date);
    formData.append("name", fullname);
    if (file !== null) {
      const name = file.uri.split("/").pop();
      const mimeType = mime.getType(file.uri);
      formData.append("profile_image", {
        uri: file.uri,
        name: name,
        type: mimeType,
      } as any);
    }
    mutate(formData);
  };

  const handleImageSelect = React.useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setFile(result.assets[0]);
    }
  }, []);

  // data serializing
  const renderStates = React.useCallback(() => {
    const theSelectedCountry = Data.filter((item) => item.name === country).map(
      (item) => item.id
    )[0];
    return (States as IState[])
      .filter((item) => item.country_id === theSelectedCountry)
      .map((item) => ({
        label: item.name,
      }));
  }, [country]);
  const [countries, setCountries] = React.useState(
    (Data as ICountry[]).map((item) => item.name)
  );

  React.useEffect(() => {
    setSelectedId(
      Data.filter((item) => item.name === nation).map((item) => item.id)[0]
    );
  });

  // function
  const handleSelectCountry = (val: string) => {
    setSelectedId(
      Data.filter((item) => item.name === val).map((item) => item.id)[0]
    );
    setCountry(val);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date) => {
    const currentDate = selectedDate || date;
    setShowDate(false);
    setDate(selectedDate.toDateString());
  };

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
      theYears = [...theYears, { value: i.toString() }];
    }
    if (birthday) {
      const oldYear = new Date(Date.parse(birthday)).getFullYear().toString();

      setYears([{ value: oldYear }, ...theYears]);
    } else {
      setYears([...theYears]);
    }
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
    if (birthday) {
      const oldMonth = new Date(Date.parse(birthday)).getMonth();
      const filteredMonths = theMonths.filter(
        (mont) => mont.value !== oldMonth
      );
      setMonths([
        { value: oldMonth, label: month[oldMonth] },
        ...filteredMonths,
      ]);
    } else {
      setMonths([...theMonths]);
    }
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
      theDays = [...theDays, { value: i.toString() }];
    }

    if (birthday) {
      const oldDate = new Date(Date.parse(birthday)).getDate();
      const filteredDates = theDays.filter(
        (item) => item.value !== oldDate.toString()
      );
      setDays([{ value: oldDate }, ...filteredDates]);
    } else {
      setDays([...theDays]);
    }
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
    <Box flex={1} backgroundColor="mainBackGroundColor">
      <SettingsHeader
        title="Profile"
        showSave
        RightItem={
          <CustomText
            variant="header"
            fontSize={18}
            color="primaryColor"
            onPress={() => handleSubmit()}
          >
            {isLoading && "Saving..."}
            {!isLoading && "Save"}
          </CustomText>
        }
        handleArrowPressed={() => navigation.goBack()}
      />

      <Box
        flexDirection="row"
        paddingHorizontal="m"
        marginTop="m"
        alignItems="center"
      >
        <Pressable
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 10,
            position: "relative",
          }}
          onPress={handleImageSelect}
        >
          <Box width="100%" height="100%" borderRadius={25} overflow="hidden">
            <Image
              source={{
                uri:
                  image && image.startsWith("file")
                    ? image
                    : `${IMAGE_BASE}${image}`,
              }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </Box>
          <Box
            position="absolute"
            width={25}
            height={25}
            borderRadius={20}
            bottom={-5}
            right={-5}
            backgroundColor="secondaryBackGroundColor"
            justifyContent="center"
            alignItems="center"
          >
            <Ionicons
              name="camera-outline"
              size={15}
              color={theme.colors.textColor}
            />
          </Box>
        </Pressable>

        <Box>
          <CustomText variant="body">{name === "null" ? "" : name}</CustomText>
          <CustomText variant="xs">@{username}</CustomText>
        </Box>
      </Box>

      {/* MAIN SECTION */}

      <Box marginTop="l">
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 400,
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          <Editable
            title="Email"
            value={email}
            showEditIcon={false}
            onChangeText={(e) => setEmail(e)}
          />
          <Editable
            title="Display name"
            value={fullname}
            onChangeText={(e) => setFullname(e)}
            showEditIcon={true}
          />
          <Editable
            title="About"
            subtitle="A brief description of yourself shown on your profile"
            onChangeText={(e) => setDescription(e)}
            value={description}
            showEditIcon={true}
            textarea
          />

          <Box style={{ marginBottom: 20 }}>
            <GenderPicker value={sex} onChange={(gen: string) => setSex(gen)} />
          </Box>

          <CustomDropdown
            label="Country"
            options={Data}
            labelField="name"
            valueField="name"
            placeholder="Nigeria"
            value={country}
            onChange={(val) => handleSelectCountry(val.name)}
            search
          />
          <CustomDropdown
            label="State"
            options={renderStates()}
            labelField="label"
            valueField="label"
            value={state}
            onChange={(data) => setState(data.label)}
            search
          />
          <CustomText variant="subheader" marginTop="m" fontSize={16}>
            Birth date
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
        </ScrollView>
      </Box>
    </Box>
  );
};

export default Profile;
