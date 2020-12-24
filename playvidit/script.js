// Script for Vidit's bot here

// Set up game
const game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var playercolor=-1

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'
  updateStatus()
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

  // checkmate?
/*
  if (game.in_checkmate()) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Game over, drawn position'
  }

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
    playercolor=1
    $('#modalChoosePlayer').modal('hide');
    board.flip()
})
$("#chooseWhite").click(function(){
    playercolor=0
    $('#modalChoosePlayer').modal('hide');
})
$("#chooseRandom").click(function(){
    playercolor=Math.floor(Math.random()*2)
    if(playercolor==1)
        board.flip()
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

