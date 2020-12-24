// Script for Vidit's bot here

// Set up game
const game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var playercolor=''
var promSource, promTarget

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
        stockfish.postMessage('setoption name Skill Level value 15')
    }
    else if(event.startsWith('bestmove')) {
        // Found a move, play this move
        console.log('found a bestmove')
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

function solvePosition() {
    stockfish.postMessage('position fen ' + game.fen())
    stockfish.postMessage('go movetime 1000')
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
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }
  status = moveColor + ' to move'

  // Check for next move
  if (game.turn() != playercolor && playercolor != '')
    solvePosition()

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
    $('#gameOverMessage').html(status);
    $("#gameOverScreen").modal("show");
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
    $('#gameOverMessage').html("It's a draw!");
    $("#gameOverScreen").modal("show");
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
