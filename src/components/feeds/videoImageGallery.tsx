import { AntDesign } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { useModalState } from "../../states/modalState";
import Box from "../general/Box";
import CustomText from "../general/CustomText";
import { useNavigation } from "@react-navigation/native";
import { PageType } from "../../pages/login";

const { width } = Dimensions.get("window");

export default function VideoImageGallery({}) {
  const {
    showImageVideoSlider: isOpen,
    imageVideoSliderData: data,
    setAll,
  } = useModalState((state) => state);
  const theme = useTheme<Theme>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [dataWithPlaceholders, setDataWithPlaceholders] = useState([]);
  const currentIndex = useRef(0);
  const flatListRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<PageType>();

  useEffect(() => {
    setDataWithPlaceholders([{ id: -1 }, ...data, { id: data.length }]);
    currentIndex.current = 1;
  }, [data]);

  const SPACING = 5;
  const ITEM_LENGTH = width; // Item is a square. Therefore, its height and width are of the same length.
  const EMPTY_ITEM_LENGTH = (width - ITEM_LENGTH) / 2;
  const BORDER_RADIUS = 20;
  const CURRENT_ITEM_TRANSLATE_Y = 48;

  const handleOnViewableItemsChanged = useCallback(
    ({ viewableItems }) => {
      const itemsInView = viewableItems.filter(({ item }) => item.uri);

      if (itemsInView.length === 0) {
        return;
      }

      currentIndex.current = itemsInView[0].index;
    },
    [data]
  );

  // `data` perameter is not used. Therefore, it is annotated with the `any` type to merely satisfy the linter.
  const getItemLayout = (_data, index) => ({
    length: ITEM_LENGTH,
    offset: 0,
    index,
  });

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        console.log("pppp", e);
        if (!isOpen) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        setAll({ showImageVideoSlider: false, imageVideoSliderData: [] });
      }),
    [navigation, isOpen]
  );

  useEffect(() => {
    const backAction = () => {
      if (isOpen) {
        setAll({ showImageVideoSlider: false, imageVideoSliderData: [] });
      } else {
        BackHandler.exitApp();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  if (!isOpen) {
    return <></>;
  }
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            top: 40,
            left: 20,
            position: "absolute",
            zIndex: 50,
          }}
          onPress={() =>
            setAll({ showImageVideoSlider: false, imageVideoSliderData: [] })
          }
        >
          <AntDesign name="back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        {loading && (
          <ActivityIndicator
            size={20}
            color={theme.colors.primaryColor}
            style={{
              position: "absolute",
              zIndex: 20,
              left: "45%",
              top: "45%",
            }}
          />
        )}
        <FlatList
          ref={flatListRef}
          data={dataWithPlaceholders}
          renderItem={({ item, index }) => {
            if (!item.uri) {
              return <View style={{ width: EMPTY_ITEM_LENGTH }} />;
            }

            const inputRange = [
              (index - 2) * ITEM_LENGTH,
              (index - 1) * ITEM_LENGTH,
              index * ITEM_LENGTH,
            ];

            const translateY = scrollX.interpolate({
              inputRange,
              outputRange: [
                CURRENT_ITEM_TRANSLATE_Y * 2,
                CURRENT_ITEM_TRANSLATE_Y,
                CURRENT_ITEM_TRANSLATE_Y * 2,
              ],
              // extrapolate: 'clamp',
            });

            return (
              <View
                style={{
                  width: ITEM_LENGTH,
                  backgroundColor: "black",
                  paddingVertical: "30%",
                  //   justifyContent: "center",
                }}
              >
                <Animated.View
                  style={[
                    {
                      transform: [{ translateY }],
                      marginHorizontal: SPACING * 3,
                      borderRadius: BORDER_RADIUS + SPACING * 2,
                      backgroundColor: "black",
                    },
                    styles.itemContent,
                  ]}
                >
                  {item.type && item.type.includes("video") ? (
                    <Video
                      source={{ uri: item.uri }}
                      style={[
                        styles.itemImage,
                        { height: ITEM_LENGTH, borderRadius: BORDER_RADIUS },
                      ]}
                      volume={1}
                      isLooping
                      shouldPlay={false}
                      onLoad={() => setLoading(false)}
                      useNativeControls
                    />
                  ) : (
                    <Image
                      source={{ uri: item.uri }}
                      style={[
                        styles.itemImage,
                        { height: ITEM_LENGTH, borderRadius: BORDER_RADIUS },
                      ]}
                      onLoad={() => setLoading(false)}
                    />
                  )}
                  <Box
                    style={{
                      width: "100%",
                      paddingVertical: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    backgroundColor="primaryColor"
                  >
                    <CustomText variant="subheader" color="white">
                      {`${index}/${data.length}`}
                    </CustomText>
                  </Box>
                </Animated.View>
              </View>
            );
          }}
          getItemLayout={getItemLayout}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.uri}
          bounces={false}
          initialNumToRender={1}
          decelerationRate={0}
          renderToHardwareTextureAndroid
          // contentContainerStyle={styles.flatListContent}
          snapToInterval={ITEM_LENGTH}
          snapToAlignment="start"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          onViewableItemsChanged={handleOnViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 100,
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    height: "100%",
    marginTop: "15%",
    alignItems: "center",
    // justifyContent: 'center',
  },
  item: {},
  itemContent: {
    alignItems: "center",
  },

  itemImage: {
    width: "100%",
  },
});
