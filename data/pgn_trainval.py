'''
Read all PGNs from chess.com and save them
'''
import chess
import os
from chess import pgn
import argparse
import requests
import json
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('--dir', type=str, required=True, help='Directory for loading and saving')
args = parser.parse_args()


def main():
    '''
    Read into API and save PGNs
    '''
    for r, dirs, files in os.walk(args.dir):
        files = list(filter(lambda x: x.endswith('pgn'), files))
        files = list(map(lambda x: os.path.join(r, x), files))
        break

    ## Now, load the games in PGN format
    games = []
    for _file in files:
        with open(_file, 'r') as fi:
            while True:
                game = pgn.read_game(fi)
                if game is None:
                    break
                games.append(game)

    np.random.shuffle(games)
    N = len(games)
    traingames = games[:int(0.9*N)]
    valgames = games[int(0.9*N):]

    with open(os.path.join(args.dir, 'train.pgn'), 'w') as fi:
        for game in traingames:
            print(game, file=fi, end="\n\n")


    with open(os.path.join(args.dir, 'val.pgn'), 'w') as fi:
        for game in valgames:
            print(game, file=fi, end="\n\n")


if __name__ == "__main__":
    main()
