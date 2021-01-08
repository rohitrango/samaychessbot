matecounter = 5
movetime = 200
skilllevel = 1

var positionDict = {
    // As white
    "": ["e2", "e4"],
    "e4 e5": ["f2", "f4"],
    "e4 e5 f4 exf4": ["g1", "f3"],
    "e4 e5 f4 Nc6": ["g1", "f3"],
    "e4 e5 f4 d6": ["g1", "f3"],
    "e4 c5": ["f2", "f4"],
    "e4 e6": ["d2", "d4"],

    // As black
    "e4": ["c7", "c5"],
    "e4 c5 Nf3": ["b8", "c6"],
    "e4 c5 Bc4": ["e7", "e6"],
    "e4 c5 Nc3": ["g8", "f6"],

    "d4": ["g8", "f6"],
    "d4 Nf6 c4": ["e7", "e6"],
    "d4 Nf6 Bf4": ["e7", "e6"],
    "d4 Nf6 Nf3": ["e7", "e6"],

    "c4": ["c7", "c5"],
    "c4 c5 e4": ["b8", "c6"],
    "c4 c5 Nc3": ["b8", "c6"],
}


var dialogues = {
    // As white
    "": "Bhai hum khelenge e4, dekhte hai aap kya karte hai",
    "e4 e5": "Kings gambit is on the board, question is will you accept it or are you a coward?",
    "e4 e5 f4 exf4": "You accepted it! Ab aayega mazaa doston",
    "e4 e5 f4 Nc6": "Kya darpok ho yaar aap. Koi baat nahi, hum abhi pieces develop karenge",
    "e4 e5 f4 d6": "Kya darpok ho yaar aap. Koi baat nahi, hum abhi pieces develop karenge",
    "e4 c5": "Sagar ne humko Sicilian sikhaya hai, jo mai ab regularly khelta hun",
    "e4 e6": "French defense, typical beginner ho aap.",

    // As black
    "e4": "Sagar ne humko Sicilian sikhaya tha, hum wahi khelenge",
    "e4 c5 Nf3": "Let's just do what I usually do, piece develop kar lete hai",

    "d4": "Vidit ko bahut pasand hai d4, aap unke saath bhi ek game khelo.",
}

// Dialogues when going to mate
var matedial = [
    "Ab toh brilliancy hone wali hai doston",
    "If your chess is like this, follow my course on Unacademy",
]

var mateddial = [
    "Yaar my cat has died, I need to take her to the vet, can we abandon this game please? Please bhai please.",
    "If I’m checkmated, discord pe server deafen mil jayega bhai, dekh lo.",
]

var blunderdial = [
    "Yeh kya kiya aapne? Koi baat nahi, apne liye toh sab changa si.",
    "Bhai bhai bhai, bach gye bhai iss baar! ",
]

var wondial = [
    "Dekh rahe ho doston, 220 IQ!",
    "Samay OP in the chat hojaye doston.",
    "Sagar Shah proud student! ",
]

var lostdial = [
    "Tumhe kya lag raha hai yahan meri miniclip banegi?",
    "Arey maa chuwwi padi hai bataye raha hun.",
    "Bhai yeh kya haggar kiya maine, F in chat.",
]

var drawdial = [
    "Bhai acha khela aapne, lekin next time pel denge bhai.",
]

var checkdial = [
    "Ab hum denge check bhai!",
    "Aapka raja khatre mein hai",
]

var checkeddial = [
    "Hmm"
]

function chooseFrom(li) {
    index = Math.floor(Math.random() * li.length);
    return li[index]
}

