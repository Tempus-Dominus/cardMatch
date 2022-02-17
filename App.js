/* Some sample code towards Assignment 2 
\author		Stephen Graham
\date		2022-02-15
\modified	2022-02-15 by Keelan Hyde
\mod-reason	To fulfill assignment two by adding the card comparison and clock logic
\file 		App.js
\brief		This is sample code only and may not be fit for all purposes!!!
\notes
Some of the problems in class were from copying props into state instead of using them directly
(see: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

\Additional Notes
	Completed adding the logic to allow card comparison and timing of the round.
	Best Time will only update upon hitting the reset button. <==(TODO: FIX)
*/
import React, { Component, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

class Card extends Component {
	constructor(props) {
		super(props);
		// removed this.state from this implementation of Card
	}
	
	// this is the onPress event handler for this card
	// it just calls the provided callbackFunction and returns the current cardId prop
	flipCard = () => {
		this.props.callbackFunction(this.props.cardId);
		this.props.parentCallback(this.props.cardId, this.props.cardNumber);
	}
	
	render() {
		// conditionally decide what to show for the card
		let showSide;
		let cardNumber;
		if (this.props.facing) {
			showSide=styles.cardFace;
			cardNumber = this.props.cardNumber;
		} else {
			showSide=styles.cardBack;
			cardNumber="";
		}

		return(
			<TouchableOpacity 
				style={showSide}
				onPress={this.flipCard}
				disabled={this.props.disabled}
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
	// the state starts with an unshuffled deck with all cards not faceUp
	constructor(props) {
		super(props);
		this.state = {
			showClock: false,			//Shows clock
			lastClockValue: 0,			//Last clock value
			bestTime: 0,				//Best game time
			firstCard: null,			//First selected card
            secondCard: null,			//Second selected card
			cardPairs: 0,				//Matched cards (pairs)
			startClick: true,			//Starts timer on card click after app is first loaded
			deck: [1,1,2,2,3,3,4,4,		//Card deck numbers array
				   5,5,6,6,7,7,8,8],

			faceUp: [false, false, false, false,	//Face position array
					 false, false, false, false,
					 false, false, false, false,
				 	 false, false, false, false],

			disable: [false, false, false, false,	//Touchable enabled/disabled array
					  false, false, false, false,
					  false, false, false, false,
					  false, false, false, false],
		};
	}
	
	
	// assuming this App mounts, do the shuffling.
	componentDidMount() {
		this.setState({ deck: this.shuffle(this.state.deck) });
	}

	/****************************************************************************
	\function 	shuffle
	\param		rawDeck is an array of items to shuffle
	\return		a permutation of the original rawDeck
	\brief		This is an implementation of the Fisher-Yates shuffle algorithm
	****************************************************************************/
	shuffle = (rawDeck) => {
		let shuffledDeck = rawDeck;
		let currentIndex = shuffledDeck.length;
		let randomize = (arr, n) =>{
            for (let i = n-1; i>0; i--){
                let j = Math.floor(Math.random() * (i+1));	//Randomizer
                [arr[i], arr[j]] = [arr[j], arr[i]];		//Deck position swapping
            }
        }

        randomize (rawDeck, currentIndex);	//Calls randomization and shuffles deck
		return shuffledDeck;
	}
	
	
	/***************************************************************************
	\function 	onCardClick
	\param		cardId is the id of the clicked card passed during callback
	\return		none
	\post   	the state of the face for the selected card is inverted
	\brief		this function is intended as a callback when a card is clicked
		prevents a card from being flipped face down.
	****************************************************************************/
	onCardClick = (cardId) => {
		if (!this.state.faceUp[cardId]){
			let faces = this.state.faceUp;
			faces[cardId] = !faces[cardId];
			this.setState({ faceUp: faces });
		}

		//Allows the clock to start automatically if the user clicks on a card upon the app's initial startup
		if (this.state.startClick){
			if(!this.state.showClock){
				this.setState({showClock: !this.state.showClock, startClick: false}) //shows clock and disables if statement
			}
		}
	}

	/***************************************************************************
	\function 	onMismatch
	\param		none
	\return		none
	\post   	the state of the face for the selected card is inverted
	\brief		flips card facedown on mismatched selection
	****************************************************************************/
	onMismatch = () => {
			let faces = this.state.faceUp;
			faces[this.state.firstCard.cardId] = !faces[this.state.firstCard.cardId];		//Flips first selected card
			faces[this.state.secondCard.cardId] = !faces[this.state.secondCard.cardId];		//Flips second selected card
			this.setState({ faceUp: faces, firstCard: null, secondCard: null });			//Updates face position & empties first and second card variables
	}
	
	/****************************************************************************
	\function 	renderCard
	\param		id is the proposed id for a new Card component
	\return		<Card> component with the correct props set
	\brief		this is a helper function to encapsulate the generation of Cards
	*****************************************************************************/
	renderCard = (id) => {
		return(
			<Card 
				cardNumber={this.state.deck[id]}			//Card face number
				callbackFunction={this.onCardClick}			//Card click callBack
				facing={this.state.faceUp[id]}				//Face position
				cardId={id}									//Id of card instance
				parentCallback={this.selCard}				//Passes card ID and cardNumber to selCard function
				disabled={this.state.disable[id]}			//Disables/enables touchableOpacity function
			/>
		);
	}
	
	/****************************************************************************
	\function 	resetGame
	\param		none
	\return		none
	\post		cards state reset to faceUp = false for all cards
	\post		the deck of cars is re-shuffled
	\brief		flips all cards face down and shuffles the deck
	*****************************************************************************/
	resetGame = () => {
		let deckState = [
				false, false, false, false,
				false, false, false, false,
				false, false, false, false,
				false, false, false, false];
		let disable = [
			false, false, false, false,
			false, false, false, false,
			false, false, false, false,
			false, false, false, false];
		let mixedDeck = this.shuffle(this.state.deck);
		this.setState({
			deck: mixedDeck,			//Upates deck with new shuffle
			faceUp: deckState,			//Places cards back facedown
			disable: disable,			//Re-enables card clickability
		});
		
	}
	
	
	/****************************************************************************
	\function 	onMatch
	\param		none
	\return		none
	\post		disables card touch button on match
	\post		secondCard and firstCard are set to null
	\post		clock is stopped and best time is taken when all 8-pairs are matched
	\brief		prevents flipping of matched cards, updates best time on last pair
	*****************************************************************************/
	onMatch = () => {
		let noFlip = this.state.disable;		//Disable click array
		noFlip[this.state.firstCard.cardId] = !noFlip[this.state.firstCard.cardId];			//Disables first selected card click
		noFlip[this.state.secondCard.cardId] = !noFlip[this.state.secondCard.cardId];		//Disables second selected card click

		//Updates button array, clears card selection one & two, increments cardPairs counter
		this.setState({ disable: noFlip, firstCard: null, secondCard: null, cardPairs: this.state.cardPairs+=1 });
		
		//Evaluates current time against best time.
		if(this.state.cardPairs == 8){
			//Updates best time on first play, otherwise only updates best time when current time is lesser than the best time.
			if(this.state.bestTime == 0){
				this.setState({bestTime: this.state.bestTime=this.state.lastClockValue})
			} else if(this.state.lastClockValue < this.state.bestTime){
				this.setState({bestTime: this.state.bestTime=this.state.lastClockValue})
			}

			//Stops the clock
			this.setState({
				showClock: !this.state.showClock
			});
			
		}
	}

	
	/****************************************************************************
	\function 	checkMatch
	\param		none
	\return		none
	\post		if match is made calls onMatch
	\post		if no match is made calls onMismatch, on delay
	\post		clock is stopped and best time is taken when all 8-pairs are matched
	\brief		Checks for matching cards
	*****************************************************************************/
	checkMatch = () => {

		//Compares match and calls appropriate function based on comparison
		if (this.state.firstCard.cardValue === this.state.secondCard.cardValue){
			{this.onMatch()}		//Cards did match
		} else {
			setTimeout(() => {this.onMismatch()}, 1000)		//Cards did not match
		}
	}


	/****************************************************************************
	\function 	selCard
	\param		cID is the ID of the card that was clicked
	\param		cNum is the deck number of the card
	\return		none
	\post		sets the selected cards
	\post		calls checkMatch on selection of second card
	\brief		Holds selected cards
	*****************************************************************************/
	selCard = (cID, cNum) => {
        if (!this.state.firstCard){

			//Sets the state of firstCard to that of the first clicked card
            this.setState({
                firstCard: {cardId: cID, cardValue: cNum}
			})
			
        } else if (!this.state.secondCard) {
			
			//Sets the state of secondCard to that of the second clicked card
            this.setState({
                secondCard: {cardId: cID, cardValue: cNum}}, () => { this.checkMatch()
            })
			
        }
    }

	/****************************************************************************
	\function 	showClock
	\param		none
	\return		none
	\post		inverts showClock
	\brief		Turns on the clock/timer
	*****************************************************************************/
	showClock = () => {
        this.setState({
            showClock: !this.state.showClock
        });
    }

	/****************************************************************************
	\function 	getClockValue
	\param		clockValue
	\return		none
	\post		sets lastClockValue with current clock value
	\brief		stores the latest clock value
	*****************************************************************************/
	getClockValue = (clockValue) => {
        this.setState({
            lastClockValue: clockValue,
        })
    }

	/****************************************************************************
	\function 	resetButtonClick
	\param		none
	\return		none
	\post		Calls resetGame and showClock functions
	\post		sets best time variable
	\brief		allows the replay button to perform multiple actions
	*****************************************************************************/
	resetButtonClick = () => {
		{this.resetGame()}
		{this.showClock()}
		this.setState({cardPairs: 0})

		//Updates the best time upon clicking replay
		if(this.state.bestTime == 0){
			this.setState({bestTime: this.state.lastClockValue})
		} else if(this.state.lastClockValue < this.state.bestTime){
			this.setState({bestTime: this.state.lastClockValue})
		}
	}

	render() {
		let clockDisplay;
		if (this.state.showClock) {
            clockDisplay = <Clock parentCallback={this.getClockValue} />
        }
		

		return (
			<View style={styles.container}>
				<View style={ styles.infoContainer }>
                    <View style={styles.matchInfo}>
                        <Text style={{fontWeight: 'bold', fontSize: 25, alignContent: "flex-end"}}>Pairs: {this.state.cardPairs}/8</Text>
                    </View>
                    <View style={styles.timeInfo}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, alignContent: "flex-end" }}>Current: {clockDisplay}</Text>
                        <Text style={{ fontSize: 16, alignContent: "flex-end" }}>Best Time: {this.state.bestTime}</Text>
                    </View>
                </View>
				<View style={styles.cardContainer}>
					<View style={styles.cardRow}>
						{this.renderCard(0)}
						{this.renderCard(1)}
						{this.renderCard(2)}
						{this.renderCard(3)}
					</View>
					<View style={styles.cardRow}>
						{this.renderCard(4)}
						{this.renderCard(5)}
						{this.renderCard(6)}
						{this.renderCard(7)}
					</View>
					<View style={styles.cardRow}>
						{this.renderCard(8)}
						{this.renderCard(9)}
						{this.renderCard(10)}
						{this.renderCard(11)}
					</View>
					<View style={styles.cardRow}>
						{this.renderCard(12)}
						{this.renderCard(13)}
						{this.renderCard(14)}
						{this.renderCard(15)}
					</View>
					<Button onPress={this.resetButtonClick} title="replay" />
				</View>
			</View>
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
	cardBack: {
        backgroundColor: "aqua",
        width: 75,
        height: 125,
        margin: 5,
        padding: 2,
        borderRadius: 5,
    },
	cardFace: {
        backgroundColor: "red",
        width: 75,
        height: 125,
        margin: 5,
        padding: 2,
        borderRadius: 5,
		alignItems: "center",
		justifyContent: "center",		
    },
    cardContainer: {
        marginTop: 5,
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
});
