import { StatusBar } from 'expo-status-bar';
import { Component } from 'react';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
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
                    <Text style={{fontWeight: 'bold', fontSize: 25, padding: 10}}>Welcome to MadLibs</Text>
                    <Text style={{paddingBottom: 40}}>Please enter a Name, Noun, and an Event. Once done, press 'Make my hall pass' to generate your hall pass.</Text>
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

    ProfileScreen = ({ navigation, route }) => {

        return (
            <View style={styles.hallPassContainer}>
                <View style={styles.hallPassVertical}>
                    <Text style={styles.hallPassVerticalText}> Hall Pass</Text>
                </View>
                <View style={styles.hallPassHorizontal}>
                    <View style={styles.libTitle}>
                        <Text style={styles.libTitleText}>Mad Libs</Text>
                    </View>
                    <View style={styles.libBody}>
                        <Text style={styles.libDate}> Date: <Text style={[{textDecorationLine: 'underline',}]}>{this.state.currentDate}</Text></Text>
                        <Text style={styles.libText}><View style={styles.underline}><Text style={styles.fillBlanks}>{route.params.theName}</Text></View> is too cool</Text>
                        <Text style={[{fontSize: 10, marginLeft: 60,}]}>NAME</Text>
                        <Text style={styles.libText}>for <View style={styles.underline}><Text style={styles.fillBlanks}>{route.params.theNoun}</Text></View> class.</Text>
                        <Text style={[{fontSize: 10, marginLeft: 90,}]}>NOUN</Text>
                        <Text style={styles.libText}>Instead, he/she will be</Text>
                        <Text style={styles.libText}>attending the <View style={styles.underline}><Text style={styles.fillBlanks}>{route.params.theEvent}</Text></View></Text>
                        <Text style={[{fontSize: 10, marginLeft: 180,}]}>EVENT</Text>
                    </View>
                    <View style={styles.libSig}>
                        <View style={styles.libSigBox}>
                            <Text style={styles.libSigTitle}>Signature</Text>
                        </View>
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
                        name="Hallpass"
                        component={this.ProfileScreen}
                        options={{ title: 'Hallpass' }}
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
  textInput: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  hallPassVertical: {
    flex: 0,
    width: '30%',
    height: '100%',
    //borderWidth: 1,
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    },
  hallPassHorizontal: {
    flex: 1,
    flexDirection: 'column',
    //borderWidth: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    },
  libTitle: {
    width: '100%',
    height: '10%',
  },
  libTitleText: {
    fontSize: 40,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    //borderWidth: 1,
  },
  libText: {
    fontSize: 40,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    //borderWidth: 1,
  },
  libBody: {
    width: '100%',
    height: '70%',
    //borderWidth: 1,
  },
  libSig: {
    width: '100%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    //borderWidth: 1,
  },
  libSigBox: {
    width: '85%',
    height: '65%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderWidth: 4,
  },
  libSigTitle: {
    fontSize: 10,
    padding: 2.5,
    textAlign: 'center',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  libDate: {
    fontSize: 20,
    paddingTop: 20,
  },
  libText: {
    fontSize: 20,
    paddingTop: 35,
    paddingLeft: 20,
  },
  hallPassVerticalText: {
      transform: [{rotate: '-90deg'}],
      fontSize: 85,
      fontWeight: 'bold',
  },
  hallPassContainer: {
      flex: 1,
      borderWidth: 1,
      flexDirection: 'row',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start',
  },
  underline: {
      borderBottomWidth: 1,
      borderBottomColor: 'black',
      width: 100,
  },
  fillBlanks: {
    textAlign: 'center',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});