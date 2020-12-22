'''
Read all PGNs from chess.com and save them
'''
import chess
import os
from chess import pgn
import argparse
import requests
import json

parser = argparse.ArgumentParser()
parser.add_argument('--member', type=str, required=True, help='User ID for downloading games.')
parser.add_argument('--savedir', type=str, required=True, help='Directory name for saving')
args = parser.parse_args()


def main():
    '''
    Read into API and save PGNs
    '''
    player = args.member.lower()
    savedir = args.savedir

    archivelink = "https://api.chess.com/pub/player/{}/games/archives".format(player)
    r = requests.get(archivelink)
    links = json.loads(r.text)['archives']

    # To save the games here
    games = []

    # We got the links, now run through them to get PGN
    for link in links:
        r = requests.get(link)
        data = json.loads(r.text)['games']
        data = list(filter(lambda x: x['rules'] == 'chess', data))
        arch_games = [x['pgn'] for x in data]
        games.extend(arch_games)
        print("Loaded games from {}".format(link))

    # Write into tmp file
    with open("tmp.txt", "w") as fi:
        for game in games:
            fi.write(game)
            fi.write("\n\n\n")

    ## Now, load the games in PGN format
    games = []
    with open("tmp.txt", "r") as fi:
        while True:
            game = pgn.read_game(fi)
            if game is None:
                break
            games.append(game)

    wongames = []
    drawgames = []

    for game in games:
        result = game.headers['Termination'].lower()
        if 'draw' in result:
            drawgames.append(game)
        elif 'won' in result and player in result:
            wongames.append(game)

    print("Added {} won games and {} drawn games".format(len(wongames), len(drawgames)))

    os.makedirs(savedir, exist_ok=True)
    with open(os.path.join(savedir, '{}_won.pgn'.format(player)), 'w') as fi:
        for game in wongames:
            print(game, file=fi, end="\n\n")

    with open(os.path.join(savedir, '{}_draw.pgn'.format(player)), 'w') as fi:
        for game in drawgames:
            print(game, file=fi, end="\n\n")






if __name__ == "__main__":
    main()
