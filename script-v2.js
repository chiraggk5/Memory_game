// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const gameBoard = document.getElementById('game-board');
    const score1Elem = document.getElementById('score1');
    const score2Elem = document.getElementById('score2');
    const currentTurnElem = document.getElementById('current-turn');
    const resultElem = document.getElementById('result');
 
    // Game state variables
    let currentPlayer = 1;
    let score1 = 0;
    let score2 = 0;
    let flippedCards = [];
    let lockBoard = false;
 
    // Create an array of card values (for 8 pairs = 16 cards)
    let cardValues = [1, 2, 3, 4, 5, 6, 7, 8];
    // Duplicate the array to have pairs and then shuffle the combined array
    cardValues = cardValues.concat(cardValues);
    cardValues.sort(() => 0.5 - Math.random());
 
    // Generate card elements based on the cardValues array
    cardValues.forEach((value, index) => {
       // Create the card container and set data attributes
       const card = document.createElement('div');
       card.classList.add('card');
       card.dataset.value = value;
       card.dataset.index = index;
 
       // Create an inner container for the flip effect
       const cardInner = document.createElement('div');
       cardInner.classList.add('card-inner');
       
       // Create the front of the card (visible when flipped)
       const cardFront = document.createElement('div');
       cardFront.classList.add('card-front');
 
       // Create an image element for the card face
       const cardImg = document.createElement('img');
       cardImg.src = `images/img${value}.png`;
       // Fallback: if the image doesn't load, use a fallback image
       cardImg.onerror = function() {
          this.src = 'images/fallback.png';
       };
       cardFront.appendChild(cardImg);
 
       // Create the back of the card (what the player sees initially)
       const cardBack = document.createElement('div');
       cardBack.classList.add('card-back');
 
       // Assemble the card structure
       cardInner.appendChild(cardFront);
       cardInner.appendChild(cardBack);
       card.appendChild(cardInner);
 
       // Append the card to the game board
       gameBoard.appendChild(card);
 
       // Add click event listener to handle card flips
       card.addEventListener('click', () => {
          // Prevent clicking if the board is locked or the card is already flipped
          if(lockBoard || card.classList.contains('flipped')) return;
          flipCard(card);
          flippedCards.push(card);
 
          // When two cards are flipped, check for a match
          if(flippedCards.length === 2){
             checkForMatch();
          }
       });
    });
 
    // Function to flip a card
    function flipCard(card) {
       card.classList.add('flipped');
    }
 
    // Function to unflip a card
    function unflipCard(card) {
       card.classList.remove('flipped');
    }
 
    // Check whether the two flipped cards match
    function checkForMatch(){
       lockBoard = true;
       const [cardOne, cardTwo] = flippedCards;
       const isMatch = cardOne.dataset.value === cardTwo.dataset.value;
 
       if(isMatch){
          // Increase the current player's score
          if(currentPlayer === 1){
             score1++;
             score1Elem.textContent = score1;
          } else {
             score2++;
             score2Elem.textContent = score2;
          }
          // Clear the flippedCards array and unlock the board
          flippedCards = [];
          lockBoard = false;
          checkGameOver();
       } else {
          // No match found; flip the cards back over after a short delay
          setTimeout(() => {
             unflipCard(cardOne);
             unflipCard(cardTwo);
             flippedCards = [];
             // Switch turns between players
             currentPlayer = currentPlayer === 1 ? 2 : 1;
             currentTurnElem.textContent = `Player ${currentPlayer}`;
             lockBoard = false;
          }, 1000);
       }
    }
 
    // Check if all cards have been flipped; if so, determine the winner
    function checkGameOver(){
       const allCards = document.querySelectorAll('.card');
       const allFlipped = Array.from(allCards).every(card => card.classList.contains('flipped'));
       if(allFlipped){
          let winner;
          if(score1 > score2){
             winner = 'Player 1 wins!';
          } else if(score2 > score1){
             winner = 'Player 2 wins!';
          } else {
             winner = 'It\'s a tie!';
          }
          resultElem.textContent = `Game Over! ${winner}`;
       }
    }
 });
 