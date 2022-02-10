import { StatusBar } from 'expo-status-bar';
import { Component } from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const MyStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    Component={HomeScreen}
                    options={{ title: 'Home' }}
                />

                <Stack.Screen
                    name="Card Match"
                    Component={CardMatch}
                    options={{ title: 'Card Match' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
        )
}

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            faceup: false,
            cardImage: null,
            cardNumber: props.cardNumber,
        }
    }

    //Onpress event handler for this card
    flipCard = () => {
        this.setState({
            faceup: !this.state.faceup,
        });
    }

    render() {
        //conditionally decide what to show on the card
        let showSide;
        let cardNumber;
        if (this.state.faceup) {
            showSide=styles.cardFace;
            cardNumber = this.state.cardNumber;
        } else {
            showSide=styles.cardBack;
            cardNumber="";
        }

        return(
            <TouchableOpacity
                style={showSide}
                onPress={this.flipCard}
            >
                <Text>Card {cardNumber}</Text>
            </TouchableOpacity>
        );
    }
}

export default class App extends Component {
    constructor() {
        var today = new Date(),
        date = today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear();
        super();
        this.state = {
            nameText: "",
            nounText: "",
            eventText: "",
            currentDate: date,

        }
    }

    HomeScreen = ({ navigation, route }) => {
        
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'center',}}>
                    <Text style={{fontWeight: 'bold', fontSize: 25, padding: 10}}>Welcome to Card Match</Text>
                    <Text style={{paddingBottom: 40, paddingLeft: 15, paddingRight: 15,}}>This game is played by selecting 1 of 16 cards and trying to find it's matching pair. Try to do this in the shortest time.</Text>
                </View>
                
                <View style={styles.buttonContainer}>
                    <Button
                        title="Play Card Match"
                        onPress={() => { navigation.navigate('Card Match') }}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Best Times"
                        onPress={() => {}}
                    />
                </View>

                <StatusBar style="auto" />
            </View>
        )
    }

    GameScreen = ({ navigation, route }) => {

        return (
            <View>
                
                
                <StatusBar style="auto" />
            </View>
        )
    }

    render() {
        
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Home"
                        component={this.HomeScreen}
                        options={{ title: 'Home' }}
                    />

                    <Stack.Screen
                        name="Card Match"
                        component={this.GameScreen}
                        options={{ title: 'Card Match' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    },
  buttonContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    },
  cardBack: {
    backgroundColor: "aqua",
    width: 100,
    height: 100,
    margin: 10,
    padding: 20,
    borderRadius: 10,
  },
  cardFace: {
    backgroundColor: "red",
    width: 100,
    height: 100,
    margin: 10,
    padding: 20,
    borderRadius: 10,
  },
  cardContainer: {
    marginTop: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});