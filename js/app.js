/*
 * Create a list that holds all of your cards
 */
const CARD_TYPES = ['fa-diamond', 'fa-anchor', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-paper-plane-o', 'fa-bolt'];

const DECK = document.querySelector('.deck');
const RESTART_BUTTON = document.querySelector('.restart');
const MOVES_COUNTER = document.querySelector('.moves');
const MINUTES = document.querySelector('.minutes');
const SECONDS = document.querySelector('.seconds');
const MODAL_BODY = document.querySelector('.modal-body');
const PLAY_AGAIN = document.querySelector('.play-again');
const STARS = document.querySelectorAll('.fa-star');

const TWO_STARS_MOVES = 5;
const ONE_STAR_MOVES = 10;

function extractType(card) {
    return card.querySelector('i').classList[1];
}

let GAME = {
    openCards: [],
    moves: 0,
    totalTime: 0,
    matchedCards: 0,
    clean() {
        this.openCards = [];
        this.moves = 0;
        this.totalTime = 0;
        this.matchedCards = 0;
        MINUTES.innerText = '00';
        SECONDS.innerText = '00';
        MOVES_COUNTER.innerText = 0;
        for(let star of STARS) {
            star.style.color = 'black';
        }
    },
    incMoves() {
        this.moves++;
        MOVES_COUNTER.innerText = this.moves.toString();
        if(this.moves == TWO_STARS_MOVES) {
            STARS[2].style.color = 'white';
        }
        if(this.moves == ONE_STAR_MOVES) {
            STARS[1].style.color = 'white';
        }
    },
    incMatched() {
        this.matchedCards += 2;
        //if(this.matchedCards.length == 2 * CARD_TYPES.length ) {
            $('#winModal').modal('show');
            MODAL_BODY.innerHTML = `<p><i class="fa fa-star modal-star"></i> <i class="fa fa-star modal-star"></i> <i class="fa fa-star modal-star"></i></p>
            <p>Your time is ${pad(parseInt(GAME.totalTime / 60))}:${pad(GAME.totalTime % 60)} and you made ${this.moves} moves.</p>
            <p>Try to improve your result!</p>`;
        //}
        const stars = document.querySelectorAll('.modal-star');
        if(this.moves >= TWO_STARS_MOVES) {
            stars[2].style.color = 'white';
        }
        if(this.moves >= ONE_STAR_MOVES) {
            stars[1].style.color = 'white';
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
                this.incMatched()
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
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
}


function initGame(deck, cardTypes, game) {
    game.clean();
    deck.innerHTML = '';
    let cards = [...cardTypes, ...cardTypes];
    shuffle(cards);
    for(const card of cards) {
        deck.innerHTML  += `<li class="card">
        <i class="fa ${card}"></i>
        </li>`;
    }
}


DECK.addEventListener('click', function(evt) {
    if (evt.target.nodeName === 'LI') {
        if(!evt.target.classList.contains('open') 
            && !evt.target.classList.contains('match')) {
            GAME.addOpen(evt.target);
        }
    }
});

RESTART_BUTTON.addEventListener('click', function() {
    initGame(DECK, CARD_TYPES, GAME);
});

PLAY_AGAIN.addEventListener('click', function() {
    initGame(DECK, CARD_TYPES, GAME);
});

// Timer function from https://stackoverflow.com/a/5517836/5925625
function setTime() {
    ++GAME.totalTime;
    SECONDS.innerHTML = pad(GAME.totalTime % 60);
    MINUTES.innerHTML = pad(parseInt(GAME.totalTime / 60));
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

// Init timer
setInterval(setTime, 1000);

initGame(DECK, CARD_TYPES, GAME);
