import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            faceup: false,
            initflip: false,
            flip: props.flip,
            faceChange: false,
            cardImage: null,
            cardNumber: props.cardNumber,
            cardID: props.cardID,
            dataID: null,
            disableTouch: props.disableTouch,
        }
    }

    
       
    //Onpress event handler for this card
    flipCard = () => {
        this.setState({
            faceup: !this.state.faceup,

        });
        this.props.parentCallback(this.props.cardID, this.props.cardNumber);
    }

    
    render() {
        //conditionally decide what to show on the card
        let showSide;
        let cardNumber;
        let disableTouch = this.disableTouch;
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
                disabled={disableTouch}
            >
                <Text style={{fontWeight: 'bold', fontSize: 50,}}>{cardNumber}</Text>
            </TouchableOpacity>
        );
    }
}

class Clock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: 0,
        }
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(), 1000
        );
    }

    tick() {
        this.setState({
            seconds: this.state.seconds + 1,
        })
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        this.props.parentCallback(this.state.seconds);
    }

    render() {
        return(
            <Text style={{ fontWeight: 'bold', fontSize: 20, alignContent: "flex-end" }}>{this.state.seconds}s</Text>
        );
    }

}



export default class App extends Component {
    constructor() {
        super();
        this.state = {
            showClock: false,
            lastClockValue: 0,
            firstCard: null,
            secondCard: null,
            faceup: [
                false, false, false, false,
                false, false, false, false,
                false, false, false, false,
                false, false, false, false,
            ],
            
        }
    }

    showClock = () => {
        this.setState({
            showClock: !this.state.showClock
        });
    }

    getClockValue = (clockValue) => {
        this.setState({
            lastClockValue: clockValue,
        })
    }

    clickCard = (cID, cNum, cflip) => {
        if (!this.state.firstCard){
            this.setState({
                firstCard: {gridCard: cID, cardValue: cNum}
            })
        } else {
            this.setState({
                secondCard: {gridCard: cID, cardValue: cNum}
            })
        }
    }

    noMatch = (cardOne) => {
        if (cardOne) {
            let faces = this.state.faceup;
            let pos1 = this.state.firstCard.gridCard
            let pos2 = this.state.secondCard.gridCard
            faces[this.state.firstCard.gridCard] = !faces[this.state.firstCard.gridCard]
            
            this.setState({faceup: faces, firstCard: {gridCard: null, cardValue: null}, secondCard: {gridCard: null, cardValue: null}})
            alert(this.state.faceup[0])
        }
    }

    componentDidUpdate(){
        if (this.state.secondCard){
            if (this.state.firstCard.cardValue === this.state.secondCard.cardValue){
                alert("Match")
                
            } else {
                {this.noMatch(this.state.firstCard)}
                
                
                
            }
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
                        onPress={() => { navigation.navigate('Card Match',) }}
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
        let gameArray = ["1","2","3","4","5","6","7","8","1","2","3","4","5","6","7","8",];
        let gameArrayLength =  gameArray.length;

        let randomize = (arr, n) =>{
            for (let i = n-1; i>0; i--){
                let j = Math.floor(Math.random() * (i+1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        randomize (gameArray, gameArrayLength);
        
        let clockDisplay;
        if (true){
            clockDisplay = <Clock parentCallback={this.getClockValue} />
        }

        let iflip = this.state.faceup

        return (
            <View style={ styles.containerTwo }>
                <View style={ styles.infoContainer }>
                    <View style={styles.matchInfo}>
                        <Text style={{fontWeight: 'bold', fontSize: 25, alignContent: "flex-end"}}>Pairs: **/8</Text>
                    </View>
                    <View style={styles.timeInfo}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, alignContent: "flex-end" }}>Current: {clockDisplay}</Text>
                        <Text style={{ fontSize: 16, alignContent: "flex-end" }}>Best Time: xxxx</Text>
                    </View>
                </View>
                <View style={styles.cardContainer}>
                    <View style={styles.cardRow}>
                        
                        <Card cardNumber={gameArray[0]}  cardID="0" flip={iflip} parentCallback={this.clickCard}/>
                        <Card cardNumber={gameArray[1]}  cardID="1" flip={iflip} parentCallback={this.clickCard}/>  
                        <Card cardNumber={gameArray[2]}  cardID="2" flip={iflip} parentCallback={this.clickCard}/>
                        <Card cardNumber={gameArray[3]}  cardID="3" flip={iflip} parentCallback={this.clickCard}/>
                    </View>
                    <View style={styles.cardRow}>
                        <Card cardNumber={gameArray[4]}  cardID="4" flip={iflip[4]} parentCallback={this.clickCard}/>
                        <Card cardNumber={gameArray[5]}  cardID="5" flip={iflip[5]} parentCallback={this.clickCard}/>
                        <Card cardNumber={gameArray[6]}  cardID="6" flip={iflip[6]} parentCallback={this.clickCard}/>
                        <Card cardNumber={gameArray[7]}  cardID="7" flip={iflip[7]} parentCallback={this.clickCard}/>
                    </View>
                    <View style={styles.cardRow}>
                        <Card cardNumber={gameArray[8]}   cardID="8" flip={iflip[8]} parentCallback={this.clickCard}/>
                        <Card cardNumber={gameArray[9]}   cardID="9" flip={iflip[9]} parentCallback={this.clickCard}/>
                        <Card cardNumber={gameArray[10]} cardID="10" flip={iflip[10]} parentCallback={this.clickCard}/>
                        <Card cardNumber={gameArray[11]} cardID="11" flip={iflip[11]} parentCallback={this.clickCard}/>
                    </View>
                    <View style={styles.cardRow}>
                        <Card cardNumber={gameArray[12]} cardID="12" flip={iflip[12]} parentCallback={this.clickCard}/>
                        <Card cardNumber={gameArray[13]} cardID="13" flip={iflip[13]} parentCallback={this.clickCard}/>
                        <Card cardNumber={gameArray[14]} cardID="14" flip={iflip[14]} parentCallback={this.clickCard}/>
                        <Card cardNumber={gameArray[15]} cardID="15" flip={iflip[15]} parentCallback={this.clickCard}/>
                    </View>
                </View>
                
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
  containerTwo: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    },
  cardBack: {
    backgroundColor: "aqua",
    width: 75,
    height: 125,
    margin: 10,
    padding: 20,
    borderRadius: 10,
  },
  cardFace: {
    backgroundColor: "red",
    width: 75,
    height: 125,
    margin: 10,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
      marginTop: 10,
      marginBottom: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    },
    infoContainer: {
        marginTop: 10,
        flex: 1,
        flexDirection: "row",
    },
    matchInfo: {
        width: "50%",
        
        padding: 5,
    },
    timeInfo: {
        width: "50%",
        
        padding: 5,
    },
});