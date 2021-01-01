var positionDict = {
    // As white
    "": ["d2", "d4"],
    "d4 Nf6": ["c2", "c4"],
    "d4 Nf6 c4 e6": ["g1", "f3"],
    "d4 Nf6 c4 g6": ["b1", "c3"],
    "d4 Nf6 c4 c5": ["d4", "d5"],

    "d4 d5": ["c2", "c4"],
    "d4 d5 c4 c6": ["g1", "f3"],
    "d4 d5 c4 e6": ["g1", "f3"],

    "d4 g6": ["e2", "e4"],
    "d4 e6": ["e2", "e4"],

    // As black
    "e4": ["e7", "e5"],
    "e4 e5 Nf3": ["b8", "c6"],

    "d4": ["g8", "f6"],
    "d4 Nf6 c4": ["e7", "e6"],
    "d4 Nf6 c4 e6 Nf3": ["d7", "d5"],

    "d4 Nf6 Nf3": ["d7", "d5"],
    "d4 Nf6 Nf3 d5 c4": ["e7", "e6"],

    "Nf3": ["d7", "d5"],
    "Nf3 d5 g3": ["g7", "g6"],
    "Nf3 d5 g3 g6 Bg2": ["f8", "g7"],
}


var dialogues = {
    // As white
    "": "I'm more of a d4 player than an e4 player.",
    "d4 Nf6": "Let's play an Indian Game.",

    "d4 d5": "The Queen's gambit, will you accept it?",
    "d4 d5 c4 c6": "So you played the Slav Defense?",
    "d4 d5 c4 e6": "So you decline the gambit? Disappointing.",

    "d4 e6": "I also play the French sometimes.",

    // As black
    "e4": "e4 huh? I like the d4 opening better.",

    "d4": "I like to play d4 as well when I'm white.",

    "d4 Nf6 Nf3": "Let's play a symmetrical.",
    "d4 Nf6 Nf3 d5 c4": "I'll just defend the pawn.",

    "Nf3 d5 g3": "Nice to see the King's Indian on the board.",
}

// Dialogues when going to mate
var matedial = [
    "You're in deep trouble, my friend.",
    "You look tense, why don't you try the BlackLotus app?",
    "Looks like game over for you."
]

var mateddial = [
    "Wait, am I going to get mated?",
    "How did I get to such a losing position?",
]

var blunderdial = [
    "Did you just blunder a winning game?"
]

var wondial = [
    "That's GG! Let's play again?",
]

var lostdial = [
    "That was a tricky game. You played well. Let's play again?",
]

var drawadial = [
    "I could have won this one, but I gave you a chance. Wanna play again?",
]

var checkdial = [
    "Your king is in danger.",
    "Let me give you a check here."
]

var checkeddial = [
    "This check means nothing to me.",
    "A check huh? Let me see."
]

function chooseFrom(li) {
    index = Math.floor(Math.random() * li.length);
    return li[index]
}

