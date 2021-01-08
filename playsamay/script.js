// Script for Vidit's bot here

// Set up game
const game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var playercolor=''
var promSource, promTarget
var usestockfish_result = false
var botsrc = null
var botdst = null
var botprom = ""
var chatboxdurationleft = 3;
var cphistory = []
var matehistory = []
var cp = 0
var mate = null
var posDict = {}

$.getJSON('./dict.json', function(json) {
    posDict = json
});

//
// Extra variables for checking dialogues
matebuffer = 0
matedbuffer = 0
checkbuffer = 0
checkedbuffer = 0

// var oracle = STOCKFISH();
// oracle.postMessage('uci');
/*
oracle.onmessage = function(event) {
    if(typeof event !== 'string')
        return;

    // If UCI command was cool, start to set settings
    console.log(event)
    if(event == 'uciok') {
        console.log('uciok')
    }
    else if(event.startsWith('bestmove')) {
        // Found a move, play this move
        console.log('found a bestmove')
        move = event.split(' ')[1]
        src = move.slice(0, 2)
        targ = move.slice(2, 4)
        prom = move.slice(4, 5)
        console.log(src, targ, prom)
        $("#bestmove").html(event)
    }
}
*/


// Stockfish callbacks
var stockfish = STOCKFISH();
stockfish.postMessage('uci');
stockfish.onmessage = function(event) {
    if(typeof event !== 'string')
        return;

    // If UCI command was cool, start to set settings
    console.log(event)
    if(event == 'uciok') {
        console.log('uciok')
        console.log(skilllevel)
        console.log(movetime)
        stockfish.postMessage('setoption name Skill Level value ' + skilllevel)
    }
    else if(event.startsWith('info')) {
        // Here we will check for best cp and mate
        event = event.split(' ')
        for(var i=0; i<event.length; i++) {
            if(event[i] == 'cp')
                cp = event[i+1]
            else if(event[i] == 'mate') {
                mate = event[i+1]
                console.log(matecounter)
                if(mate > matecounter)
                    mate = null
                if(mate < -matecounter)
                    mate = null
            }
        }

    }
    else if(event.startsWith('bestmove')) {
        // Found a move, play this move
        console.log('found a bestmove')
        if(usestockfish_result) {
            move = event.split(' ')[1]
            src = move.slice(0, 2)
            targ = move.slice(2, 4)
            prom = move.slice(4, 5)
            console.log(src, targ, prom)
            game.move({
                from: src,
                to: targ,
                promotion: prom
            })
        }
        else {
            game.move({
                from: botsrc,
                to: botdst,
                promotion: botprom,
            })
        }
        // Update cp and mate histories
        cphistory.push(cp)
        matehistory.push(mate)

        updateStatus()
        onSnapEnd()
    }
}

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if (game.turn() != playercolor)
    return false

  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function sample(moves) {
    // sample from list of moves
    U = Math.random()
    arraymoves = Object.entries(moves)
    for(var i=0; i<arraymoves.length; i++) {
        tmpmove = arraymoves[i][0]
        tmpprob = arraymoves[i][1]
        if(U < tmpprob){
            return tmpmove
        }
        U -= tmpprob
    }
    return tmpmove
}

function solvePosition() {
    posfromhist = game.history().join(" ").replace("+", "")
    console.log(posfromhist)

    fen = game.fen()
    halfmove = fen.split(' ')[4]
    fenstr = fen.split(' ').slice(0, 3).join(' ')
    console.log(fenstr)

    if(posDict[fenstr] == null || halfmove >= 90) {
        console.log("Absent here. \n\n")
        stockfish.postMessage('position fen ' + game.fen())
        stockfish.postMessage('go movetime ' + movetime)
        usestockfish_result = true
    }
    else {
        console.log("Present here. \n\n")
        console.log("Present here. \n\n")
        move = sample(posDict[fenstr])
        botsrc = move.slice(0, 2)
        botdst = move.slice(2, 4)
        botprom = move.slice(4)
        stockfish.postMessage('position fen ' + game.fen())
        stockfish.postMessage('go movetime 500')
        usestockfish_result = false
    }

    // dialogue goes here, maybe improve this a bit later
    openingtalk = dialogues[posfromhist]
    if(openingtalk != null && positionDict[posfromhist][0] == botsrc && positionDict[posfromhist][1] == botdst) {
        $("#chatbox").html(openingtalk);
        chatboxdurationleft = 3;
    }
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
  })

  // illegal move
  if (move === null) {
      var checkmove = game.move({
          from: source,
          to: target,
          promotion: 'q'
      })
      if (checkmove === null)
        return 'snapback'
      // promotion is possible
      game.undo();

      // Set player turn
      promSource = source
      promTarget = target
      if(game.turn() === 'b')
          $("#promotionChoiceBlack").modal("show");
      else if(game.turn() === 'w')
          $("#promotionChoiceWhite").modal("show");
  }
  else
      updateStatus()
}

$('#chooseBishop').click(promote('b'));
$('#chooseRook').click(promote('r'));
$('#chooseKnight').click(promote('n'));
$('#chooseQueen').click(promote('q'));
$('#chooseBishopW').click(promote('b'));
$('#chooseRookW').click(promote('r'));
$('#chooseKnightW').click(promote('n'));
$('#chooseQueenW').click(promote('q'));

function promote(piece) {
    function _promote() {
        $('#promotionChoiceBlack').modal('hide');
        $('#promotionChoiceWhite').modal('hide');
        game.move({
            from: promSource,
            to:  promTarget,
            promotion: piece
        });
        promSource = promTarget = null
        updateStatus()
        onSnapEnd()
    }
    return _promote
}


// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  chatboxdurationleft -= 1;
  if(chatboxdurationleft == 0)
    $("#chatbox").html("");

  // Oracle
  // oracle.postMessage('position fen ' + game.fen())
  // oracle.postMessage('go movetime 1000')

  var status = ''
  var notdone = true

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }
  status = moveColor + ' to move'


  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
    $('#gameOverMessage').html(status);
    $("#gameOverScreen").modal("show");
    notdone = false
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
    $('#gameOverMessage').html("It's a draw!");
    $("#gameOverScreen").modal("show");
    notdone = false
  }
  /*

  // game still on
  else {

    // check?
    if (game.in_check()) {
      status += ', ' + moveColor + ' is in check'
    }
  }
  */
  // once vidit has played, check for any new chat messages
  updateBotChat();

  // Check for next move
  if (notdone && game.turn() != playercolor && playercolor != '')
    solvePosition()

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn({ max_width: 10, newline_char: '<br />'  }))

}

updateStatus()

// Setup the board
var board = Chessboard('mainBoard', {
    draggable: true,
    position: 'start',
    dropOffBoard: 'trash',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
});

// Set up player
// White = 0, Black = 1
$("#chooseBlack").click(function(){
    playercolor='b'
    $('#modalChoosePlayer').modal('hide');
    board.flip()
    solvePosition()
})
$("#chooseWhite").click(function(){
    playercolor='w'
    $('#modalChoosePlayer').modal('hide');
})
$("#chooseRandom").click(function(){
    choices = ['w', 'b']
    playercolor=Math.floor(Math.random()*2)
    playercolor=choices[playercolor]
    if(playercolor=='b') {
        board.flip()
        solvePosition()
    }
    $('#modalChoosePlayer').modal('hide');
})

// Set up modal
$(document).ready(
    function(){
        $('#main').css('visibility','visible');
        $('#loading').css('visibility','hidden');
        $('#modalChoosePlayer').modal({
            backdrop: 'static',
            keyboard: false
        })
        $('#modalChoosePlayer').modal('show');
    }
)

$('#restartBtn').click(function(){
    location.reload();
})

function updateBotChat() {
    // update bot chat based on history of mate and cp
    // Check if bot is going to checkmate
    Nmate = matehistory.length
    Ncp = cphistory.length

    // See checks and update dialogue
    if (game.in_check()) {
        if(game.turn() == playercolor)
            if(checkbuffer <= 0 && matebuffer <= 0) {
                checkbuffer = 10
                chatboxdurationleft = 3
                updateDial(checkdial)
            }
    }

    // Bot is going to checkmate
    if(mate > 0) {
        if(matehistory[Nmate-2] == null && matebuffer <= 0) {
            matebuffer = 10
            chatboxdurationleft = 3
            updateDial(matedial)
        }
    }
    else if(mate < 0) {
        if(matehistory[Nmate-2] == null && matedbuffer <= 0) {
            matedbuffer = 10
            chatboxdurationleft = 3
            updateDial(mateddial)
        }
    }
    else if(mate == null) {
        if(matehistory[Nmate-2] < 0) {
            chatboxdurationleft = 3
            updateDial(blunderdial)
        }
    }

    // Checkmated or draw
    if(game.in_checkmate()) {
        if(game.turn() == playercolor)
            updateDial(wondial)
        else
            updateDial(lostdial)
    }
    else if (game.in_draw()) {
        updateDial(drawdial)
    }

    matebuffer -= 1
    checkbuffer -= 1
    checkedbuffer -= 1
    matedbuffer -= 1
}

function updateDial(li) {
    str = chooseFrom(li)
    $("#chatbox").html(str);
}
