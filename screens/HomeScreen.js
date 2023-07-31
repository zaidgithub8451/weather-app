import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, ScrollView, Text, TouchableOpacity, View, Image, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import { theme1 } from "../theme";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForeCast } from "../api/weather";
import { weatherImages } from "../constants";
import * as Progress from "react-native-progress"
import { getData, storeData } from "../utils/asyncStorage";

const ios = Platform.OS == "ios"
export default function HomeScreen() {
    const [showSearch, toggleSearch] = useState(false)
    const [locations, setLocation] = useState([])
    const [weather,setWeather] = useState({})
    const [loading,setLoading] = useState(true)

    const handleLocation =(loc) => {
        setLocation([])
        toggleSearch(false)
        setLoading(true)
        fetchWeatherForeCast({
            cityName: loc.name,
            days: "7"
        }).then(data => {
            setWeather(data)
            setLoading(false)
            storeData("city", loc.name)
        })
    }

    const handleSearch = (value) => {
        // fetch locations
        if(value.length > 2){
            fetchLocations({cityName: value}).then(data => {
                setLocation(data)
            })
        }
    }

    useEffect(() => {
        fetchMyWeatherData()
    }, [])

    const fetchMyWeatherData = async() => {
        let myCity = await getData("city");
        let cityName = "Mumbai"
        if(myCity) cityName = myCity
        fetchWeatherForeCast({
            cityName,
            days: "7"
        }).then(data => {
            setWeather(data)
            setLoading(false)
        })
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

    const {current, location} = weather;

    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            <StatusBar style="auto" />
            <Image blurRadius={70} style={{position: "absolute", height: "100%", width: "100%"}} source={require("../assets/images/bg.png")}/>

            {
                loading ? (
                    <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                        <Text style={{color: "white", fontSize: 20}}>Loading..</Text>
                    </View>
                ) : (
                    <SafeAreaView style={{flex: 1, display: "flex"}}>
                <View style={{height: "7%", marginVertical: 4, marginHorizontal: 15, position: "relative", zIndex: 50 }}>
                    <View style={{flexDirection: "row", justifyContent: "flex-end", alignItems: "center", borderRadius: 100, backgroundColor: showSearch ? theme1.bgWhite(0.2) : "transparent"}}>
                        {
                            showSearch ? (
                                <TextInput onChangeText={handleTextDebounce}  placeholder="Search City" placeholderTextColor={"gray"} style={{paddingLeft: 15, height: 30, flex: 1, paddingBottom: 1, fontSize: 16, color: "white"}}/>
                            ) : null
                        }
                        <TouchableOpacity onPress={()=> toggleSearch(!showSearch)} style={{backgroundColor: theme1.bgWhite(0.3), borderRadius: 100, padding: 3, margin: 1, marginRight: 1}}>
                        <Entypo name="magnifying-glass" size={25} color={"lightgray"}/>
                        </TouchableOpacity>
                    </View>
                    {
                        locations.length > 0 && showSearch ? (
                            <View style ={{position: "absolute", width: "100%", backgroundColor: "white", top: 40, borderRadius: 24}}>
                                {
                                    locations.map((loc, index) => {
                                        let showBorder = index+1 != locations.length
                                        const borderClass = showBorder ? { borderBottomWidth: 1, borderBottomColor: "gray" } : {};
                                        return (
                                            <TouchableOpacity key={index} onPress={() => handleLocation(loc)} style={{flexDirection: "row", alignItems: "center", borderWidth: 0, marginTop: 10, padding: 10, paddingHorizontal: 15, marginBottom: 1, borderClass}}>
                                                <Entypo name="location-pin" size={25} color={"lightgray"}/>
                                                <Text style={{color: "black", fontSize: 15, marginLeft: 10}}>{loc?.name}, {loc?.country}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        ) : null
                    }
                </View>
                {/* Forecast Section */}
                <View style ={{marginHorizontal: 4, display: "flex", justifyContent: "space-around", flex: 1, marginBottom: 2}}>
                    {/* locations */}
                    <Text style={{color: "white", textAlign: "center", fontSize: 20, fontWeight: "bold"}}>
                        {location?.name}, <Text style={{fontSize: 17, fontWeight: "500", color: "gray"}}>{location?.country}</Text>
                    </Text>
                    {/* Weather Image */}
                    <View style={{flexDirection: "row", justifyContent: "center"}}>
                        <Image style={{width: 150, height: 150}} source={weatherImages[current?.condition?.text]} />
                    </View>
                    {/* Degree Celcius */}
                    <View style={{gap: 2}}>
                        <Text style={{textAlign: "center", color: "white", fontSize: 30, marginLeft: 5}}>{current?.temp_c}&#176;</Text>
                        <Text style={{textAlign: "center", color: "white", fontSize: 20,  }}>{current?.condition?.text}</Text>
                    </View>
                    {/* Other Stats */}
                    <View style={{flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20}}>
                        <View style={{flexDirection: "row", gap: 5, alignItems: "center"}}>
                            <Image source={require("../assets/icons/wind.png")} style={{height: 20, width: 20}} />
                            <Text style={{color: "white", fontWeight: "500", fontSize: 16, lineHeight: 24}}>{current?.wind_kph}km</Text>
                        </View>
                        <View style={{flexDirection: "row", gap: 5, alignItems: "center"}}>
                            <Image source={require("../assets/icons/drop.png")} style={{height: 20, width: 20}} />
                            <Text style={{color: "white", fontWeight: "500", fontSize: 16, lineHeight: 24}}>{current?.humidity} %</Text>
                        </View>
                        <View style={{flexDirection: "row", gap: 5, alignItems: "center"}}>
                            <Image source={require("../assets/icons/sunn.png")} style={{height: 20, width: 20}} />
                            <Text style={{color: "white", fontWeight: "500", fontSize: 16, lineHeight: 24}}>{ weather?.forecast?.forecastday[0]?.astro?.sunrise }</Text>
                        </View>
                    </View>
                    </View>
                    {/* Forecast for next days */}
                    <View style={{marginBottom: 2, spacing: {marginVertical: 3}}}>
                        <View style={{flexDirection: "row", alignItems: "center", marginHorizontal: 5, spacing: {marginHorizontal: 2}}}>
                        <AntDesign name="calendar" size={25} color={"lightgray"}/>
                        <Text style={{color: "white", marginLeft: 10 }}>Daily Forecast</Text>
                        </View>
                    
                    <ScrollView
                        horizontal={true}
                        contentContainerStyle={{paddingHorizontal: 15}}
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            weather?.forecast?.forecastday.map((item, index) => {
                                let date = new Date(item.date)
                                let options = {weekday: "long"}
                                let dayName = date.toLocaleDateString("en-US", options);
                                dayName = dayName.split(",")[0]
                                return (
                                    <View key={index} style={{justifyContent: "center", alignItems: "center", width: 80, borderRadius:  20, paddingVertical: 10, marginVertical: 10, marginRight: 10, backgroundColor: theme1.bgWhite(0.15), spacing: {marginVertical: 1}}}>
                                        <Image source={weatherImages[item?.day?.condition?.text]} style={{width: 60, height: 50}} />
                                        <Text style={{color: "white"}}>{dayName}</Text>
                                        <Text style={{color: "white", fontSize: 15, fontWeight: "500"}}>{item?.day?.avgtemp_c}&#176;</Text>
                                    </View>
                                )
                            })
                        }
                        
                    </ScrollView>
                    </View>
            </SafeAreaView>
                )
            }
            
        </View>
    )
}