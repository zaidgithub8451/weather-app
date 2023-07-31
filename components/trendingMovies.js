import React from "react";
import {View, Text, Dimensions, TouchableWithoutFeedback, Image} from "react-native"
import Carousel from "react-native-snap-carousel";


var width = Dimensions.get("window").width
var height = Dimensions.get("window").height
export default function TrendingMovies({data}) {
    const itemWidth = width * 0.6;
    return(
        <View style={{marginBottom: 8}}>
            <Text style={{color: "white", fontSize: 15, marginVertical: 4, marginBottom: 5}}>Trending</Text>
            <Carousel
                data={data}
                renderItem={({item}) => <MovieCard item={item}/>}
                firstItem={1}
                inactiveSlideOpacity={0.60}
                sliderWidth={360}
                itemWidth={360*0.60}
                itemHeight={360 * 0.68}
                slideStyle={{display: "flex", alignItems: "center"}}
            />
        </View>
    )
}

const MovieCard = ({item}) => {
    return(
        <TouchableWithoutFeedback>
            <Image source={require("../assets/images/captainmarvel.jpg")}
            style={{
                
                borderRadius: "24"
            }}
            />

        </TouchableWithoutFeedback>
    )
}