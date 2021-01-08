movetime = 500
skilllevel = 10
matecounter = 7

var positionDict = {
    // As white
    "": ["d2", "d4"],
    "d4 e6": ["c2", "c4"],
    "d4 d5": ["c2", "c4"],

    // As black
    "e4": ["e7", "e5"],
    "c4": ["c7", "c5"],
    "d4": ["g8", "f6"],
}


var dialogues = {
    // As white
    "d4 e6": "Basic principles of chess: Claim some central squares.",
    "d4 d5": "I like to play Queen's gambit occasionally.",

    // As black
    "e4": "This is a pretty standard reply to e4.",
    "c4": "Let me block your c4 pawn right away.",
    "d4": "Time to bring my knight out.",
}

// Dialogues when going to mate
var matedial = [
    "Your king is now trapped.",
    "Get ready to get checkmated!"
]

var mateddial = [
    "You're a good player, are you a GM by any chance?",
    "I was very careless this time."
]

var blunderdial = [
    ""
]

var wondial = [
    "Bhaijan toh Azerbaijan waise Poland ... Nice win for me though.",
    "You need to improve more! Do watch my streams on Improving Chess",
]

var lostdial = [
    "If you put this match on YouTube, be ready for a copyright strike! ;)",
    "And this is why I did not become a GM.",
]

var drawdial = [
    "This was an excellent match! Look forward to playing with you again.",
]

var checkdial = [
    "Always look out for checks, captures, and threats! Here is a check.",
    "Another check!",
]

var checkeddial = [
    "Hmm"
]

function chooseFrom(li) {
    index = Math.floor(Math.random() * li.length);
    return li[index]
}

