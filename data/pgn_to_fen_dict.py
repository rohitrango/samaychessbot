'''
Read PGN file and save fen dictionary
'''
import chess
import os
from chess import pgn
import argparse
from copy import deepcopy
import requests
import json
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('--file', type=str, required=True, help='PGN file to read')
parser.add_argument('--player', type=str, required=True, help='Player name')
parser.add_argument('--output', type=str, required=True, help='Output json')
args = parser.parse_args()


def main():
    '''
    Read into API and save PGNs
    '''

    ## Now, load the games in PGN format
    games = []
    with open(args.file, 'r') as fi:
        while True:
            game = pgn.read_game(fi)
            if game is None:
                break
            games.append(game)

    # Get list of moves and boards
    allstates = dict()

    # Iterate through all games
    player = args.player
    for game in games:
        states = []
        actions = []
        playercolor = 'w' if player.lower() == game.headers['White'].lower() else 'b'
        # Get mainline moves
        moves = list(game.mainline_moves())
        board = game.board()
        for move in moves:
            # Append state
            states.append(board.fen())
            board.push(move)
            actions.append(move.uci())

        # From all states, check which ones are players; moves
        for b, a in zip(states, actions):
            tcolor = b.split(' ')[1]
            if tcolor == playercolor:
                bsplit = " ".join(b.split(' ')[:3])
                if allstates.get(bsplit) is None:
                    allstates[bsplit] = dict()
                allstates[bsplit][a] = allstates[bsplit].get(a, 0) + 1

    # Normalize
    for board in allstates.keys():
        actionsdict = allstates[board]
        sumval = np.sum(list(actionsdict.values()))*1.0
        for k, v in actionsdict.items():
            actionsdict[k] = v/sumval
        allstates[board] = actionsdict

    # Save json
    with open(args.output, 'w') as fi:
        fi.write(json.dumps(allstates))
        print("Written dict to json file.")



if __name__ == "__main__":
    main()
