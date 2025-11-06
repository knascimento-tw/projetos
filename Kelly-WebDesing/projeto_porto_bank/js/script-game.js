document.addEventListener('DOMContentLoaded', () => {
  const memoryGame = document.getElementById('memory-game');
  const movesCountElement = document.getElementById('moves-count');
  const restartButton = document.getElementById('restart-button');

  let cardsArray = [];
  const numPairs = 6; 
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let matchesFound = 0;
  let moves = 0;

  const cardImages = [
    '../img/img01.png', '../img/img001.png',
    '../img/img02.png', '../img/img002.png',
    '../img/img03.png', '../img/img003.png',
    '../img/img04.png', '../img/img004.png',
    '../img/img05.png', '../img/img005.png',
    '../img/img06.png', '../img/img006.png',
  ];

  function initializeGame() {
    
    const oldMsg = document.querySelector('#end-message');
    if (oldMsg) oldMsg.remove();

    cardsArray = [];
    matchesFound = 0;
    moves = 0;
    movesCountElement.textContent = moves;
    memoryGame.innerHTML = '';

    
    for (let i = 0; i < numPairs; i++) {
      cardsArray.push({ id: i, image: cardImages[i * 2] });
      cardsArray.push({ id: i, image: cardImages[i * 2 + 1] });
    }

    shuffleCards(cardsArray);

    cardsArray.forEach(card => {
      const memoryCard = document.createElement('div');
      memoryCard.classList.add('memory-card');
      memoryCard.dataset.id = String(card.id);

      const frontFace = document.createElement('img');
      frontFace.classList.add('front-face');
      frontFace.src = card.image;
      frontFace.alt = `Carta ${card.id}`;

      const backFace = document.createElement('img');
      backFace.classList.add('back-face');
      backFace.src = '../img/flip_carta.png';
      backFace.alt = 'Verso da carta';

      memoryCard.appendChild(frontFace);
      memoryCard.appendChild(backFace);

      memoryCard.addEventListener('click', flipCard);
      memoryGame.appendChild(memoryCard);
    });
  }

  function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    moves++;
    movesCountElement.textContent = moves;

    checkForMatch();
  }

  function checkForMatch() {
    const isMatch = firstCard.dataset.id === secondCard.dataset.id;
    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    firstCard.classList.add('match');
    secondCard.classList.add('match');

    matchesFound++;
    if (matchesFound === numPairs) {
      setTimeout(() => {
       
        const oldMsg = document.querySelector('#end-message');
        if (oldMsg) oldMsg.remove();

        
        const msg = document.createElement('p');
        msg.id = 'end-message';
        msg.textContent = `🎉 Parabéns! Você encontrou todos os pares em ${moves} movimentos!`;
        msg.style.color = '#00796b';
        msg.style.fontWeight = 'bold';
        msg.style.textAlign = 'center';
        msg.style.marginTop = '10px';
        memoryGame.after(msg);
      }, 500);
    }

    resetBoard();
  }

  function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  restartButton.addEventListener('click', initializeGame);
  initializeGame();
});
