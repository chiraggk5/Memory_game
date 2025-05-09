// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const gameBoard = document.getElementById('game-board');
    const score1Elem = document.getElementById('score1');
    const score2Elem = document.getElementById('score2');
    const currentTurnElem = document.getElementById('current-turn');
    const resultElem = document.getElementById('result');
 
    // Map each card value (pair) to a specific sound effect.
    const pairSounds = {
        1: new Audio('sounds/bear.wav'),
        2: new Audio('sounds/cat.wav'),
        3: new Audio('sounds/dog.wav'),
        4: new Audio('sounds/elephant.wav'),
        5: new Audio('sounds/fox.wav'),
        6: new Audio('sounds/panda.wav'),
        7: new Audio('sounds/rabbit.wav'),
        8: new Audio('sounds/redpanda.wav')
     };
 
    // Create the end-of-game “you won” sound.
    // Update 'sounds/you-won.wav' to match your actual filename.
    const winSound = new Audio('sounds/you-won.wav');
 
    // Game state variables
    let currentPlayer = 1;
    let score1 = 0;
    let score2 = 0;
    let flippedCards = [];
    let lockBoard = false;
 
    // Create and shuffle card values (8 pairs = 16 cards)
    let cardValues = [1,2,3,4,5,6,7,8].concat([1,2,3,4,5,6,7,8]);
    cardValues.sort(() => 0.5 - Math.random());
 
    // Generate cards
    cardValues.forEach((value, index) => {
       const card = document.createElement('div');
       card.classList.add('card');
       card.dataset.value = value;
       card.dataset.index = index;
 
       const cardInner = document.createElement('div');
       cardInner.classList.add('card-inner');
 
       const cardFront = document.createElement('div');
       cardFront.classList.add('card-front');
       const cardImg = document.createElement('img');
       cardImg.src = `images/img${value}.png`;
       cardImg.onerror = () => cardImg.src = 'images/fallback.png';
       cardFront.appendChild(cardImg);
 
       const cardBack = document.createElement('div');
       cardBack.classList.add('card-back');
 
       cardInner.append(cardFront, cardBack);
       card.appendChild(cardInner);
       gameBoard.appendChild(card);
 
       card.addEventListener('click', () => {
          if (lockBoard || card.classList.contains('flipped')) return;
          flipCard(card);
          flippedCards.push(card);
          if (flippedCards.length === 2) checkForMatch();
       });
    });
 
    function flipCard(card) {
       card.classList.add('flipped');
    }
 
    function unflipCard(card) {
       card.classList.remove('flipped');
    }
 
    function checkForMatch() {
       lockBoard = true;
       const [c1, c2] = flippedCards;
       const isMatch = c1.dataset.value === c2.dataset.value;
 
       if (isMatch) {
          // Play the pair-specific sound
          const val = c1.dataset.value;
          pairSounds[val]?.play();
 
          // Update score
          if (currentPlayer === 1) {
             score1Elem.textContent = ++score1;
          } else {
             score2Elem.textContent = ++score2;
          }
 
          flippedCards = [];
          lockBoard = false;
          checkGameOver();
       } else {
          setTimeout(() => {
             unflipCard(c1);
             unflipCard(c2);
             flippedCards = [];
             currentPlayer = currentPlayer === 1 ? 2 : 1;
             currentTurnElem.textContent = `Player ${currentPlayer}`;
             lockBoard = false;
          }, 1000);
       }
    }
 
    function checkGameOver() {
       const allFlipped = [...document.querySelectorAll('.card')]
          .every(card => card.classList.contains('flipped'));
       if (allFlipped) {
          let message;
          if (score1 > score2) message = 'Player 1 wins!';
          else if (score2 > score1) message = 'Player 2 wins!';
          else message = "It's a tie!";
          resultElem.textContent = `Game Over! ${message}`;
          // Play the "you won" sound once at end
          winSound.play();
       }
    }
 });
 