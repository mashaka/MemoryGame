// Base icons for cards
const CARD_TYPES = ['fa-diamond', 'fa-anchor', 'fa-cube', 'fa-leaf',
    'fa-bicycle', 'fa-bomb', 'fa-paper-plane-o', 'fa-bolt'];

// Stars thresholds
const TWO_STARS_MOVES = 30;
const ONE_STAR_MOVES = 45;

const ELEMENTS = {
    deck: document.querySelector('.deck'),
    restartButton: document.querySelector('.restart'),
    movesCounter: document.querySelector('.moves'),
    minutes: document.querySelector('.minutes'),
    seconds: document.querySelector('.seconds'),
    modalBody: document.querySelector('.modal-body'),
    playAgainButton: document.querySelector('.play-again'),
    stars: document.querySelectorAll('.fa-star')
};

const GAME = {
    openCards: [],
    moves: 0,
    totalTime: 0,
    matchedCards: 0,
    timer: setInterval(setTime, 1000),
    start() {
        this.clean();
        ELEMENTS.deck.innerHTML = '';
        let cards = [...CARD_TYPES, ...CARD_TYPES];
        shuffle(cards);
        for(const card of cards) {
            ELEMENTS.deck.innerHTML  += `<li class="card">
            <i class="fa ${card}"></i>
            </li>`;
        }
        clearInterval(this.timer);
        this.timer = setInterval(setTime, 1000);
    },
    clean() {
        this.openCards = [];
        this.moves = 0;
        this.totalTime = 0;
        this.matchedCards = 0;
        ELEMENTS.minutes.innerText = '00';
        ELEMENTS.seconds.innerText = '00';
        ELEMENTS.movesCounter.innerText = 0;
        for(let star of ELEMENTS.stars) {
            star.style.color = 'black';
        }
    },
    incMoves() {
        this.moves++;
        ELEMENTS.movesCounter.innerText = this.moves.toString();
        if(this.moves == TWO_STARS_MOVES) {
            ELEMENTS.stars[2].style.color = 'white';
        }
        if(this.moves == ONE_STAR_MOVES) {
            ELEMENTS.stars[1].style.color = 'white';
        }
    },
    incMatched() {
        this.matchedCards += 2;
        if(this.matchedCards === 2 * CARD_TYPES.length) {
            clearInterval(this.timer);
            $('#winModal').modal('show');
            ELEMENTS.modalBody.innerHTML = `
            <p>
                <i class="fa fa-star modal-star"></i> 
                <i class="fa fa-star modal-star"></i> 
                <i class="fa fa-star modal-star"></i>
            </p>
            <p>Your time is ${pad(parseInt(this.totalTime / 60))}:${pad(this.totalTime % 60)} 
            and you made ${this.moves} moves.</p>
            <p>Try to improve your result!</p>`;
            const stars = document.querySelectorAll('.modal-star');
            if(this.moves >= TWO_STARS_MOVES) {
                stars[2].style.color = 'white';
            }
            if(this.moves >= ONE_STAR_MOVES) {
                stars[1].style.color = 'white';
            }
        }
    },
    addOpen(card) {
        this.incMoves();
        card.classList.add('open', 'show');
        this.openCards.push(card);
        if(this.openCards.length === 2) {
            if(extractType(this.openCards[0]) === extractType(this.openCards[1])) {
                for(let openCard of this.openCards) {
                    openCard.classList.remove('open');
                    openCard.classList.add('match');
                }
                this.incMatched();
                this.openCards = [];
            } else {
                setTimeout(() => {
                    for(let openCard of this.openCards) {
                        openCard.classList.remove('open', 'show');
                    }
                    this.openCards = [];
                }, 600);
            }
        }
    }
};

// Init the game
ELEMENTS.deck.addEventListener('click', function(evt) {
    if (evt.target.nodeName === 'LI') {
        if(!evt.target.classList.contains('open')
            && !evt.target.classList.contains('match')) {
            GAME.addOpen(evt.target);
        }
    }
});

ELEMENTS.restartButton.addEventListener('click', () => {GAME.start();});
ELEMENTS.playAgainButton.addEventListener('click', () => {GAME.start();});

GAME.start();

//////////////////////////////////////////////////////////////////
// Utils

// Timer function from https://stackoverflow.com/a/5517836/5925625
function setTime() {
    ++GAME.totalTime;
    ELEMENTS.seconds.innerHTML = pad(GAME.totalTime % 60);
    ELEMENTS.minutes.innerHTML = pad(parseInt(GAME.totalTime / 60));
}

function pad(val) {
    const valString = val.toString();
    if (valString.length < 2) {
        return '0' + valString;
    } else {
        return valString;
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
}

function extractType(card) {
    return card.querySelector('i').classList[1];
}

