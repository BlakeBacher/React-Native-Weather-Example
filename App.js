import React from 'react';
import { StyleSheet, Text, View, Platform, KeyboardAvoidingView, ImageBackground} from 'react-native';
import Search from './components/SearchInput'
import axios from 'axios'
import Image from './components/slack-imgs.jpg'
import Clouds from './components/images/Clouds.jpg'
import Mist from './components/images/Mist.jpg'
import Rain from './components/images/Rain.png'
import Clear from './components/images/Clear.jpg'
import Thunderstorm from './components/images/Thunderstorm.jpg'
import {REACT_NATIVE_APP_KEY} from 'react-native-dotenv'

export default class App extends React.Component {
  constructor(props){
    super(props)

    this.state={
      location: '',
      weather:0,
      description:'',
      image: Image,
    }
  }

  handleUpdate = (city) => {
    this.setState({location: city})
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${REACT_NATIVE_APP_KEY}`)
      .then(res => {
        let img = ''

        let currentWF = res.data.main.temp;
        currentWF = (currentWF - 273.15) * 1.8 + 32;

        switch(res.data.weather[0].main){
          case 'Clear': 
            img = Clear
            break;
          case 'Clouds':
            img = Clouds
            break;
          case 'Rain':
            img = Rain
            break;
          case 'Mist':
            img = Mist
            break;
          case 'Thunderstorm':
            img = Thunderstorm
            break;
          default: img = Image
        }
        
        this.setState({
          weather: currentWF.toFixed(0) + "˚",
          location: res.data.name,
          description: res.data.weather[0].description,
          image: img
        });
      });
  }
  componentDidMount(){
    this.handleUpdate('Provo')
  }


  render() {
    const {location} = this.state
    return (
      <KeyboardAvoidingView style={styles.container} behavior = 'padding'>
      <ImageBackground
        source={this.state.image}
        style={styles.imageContainer}
        imageStyle={styles.image}>
        <View style = {styles.detailsContainer}>
          <Text style={[styles.largeText, styles.textStyle]}>{location}</Text>
          <Text style={[styles.smallText, styles.textStyle]}>{this.state.description}</Text>
          <Text style={[styles.largeText, styles.textStyle]}>{this.state.weather}</Text>
          <Search placeholder = 'Search any city' onSubmit = {this.handleUpdate}/>
        </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
    },
  largeText: {
    fontSize: 44,
    },
  smallText: {
    fontSize: 18,
    },
  imageContainer: {
    flex: 1,
    },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
    },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
    },
});
