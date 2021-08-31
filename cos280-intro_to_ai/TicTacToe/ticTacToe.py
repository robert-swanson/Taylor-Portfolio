turn = input('Who goes first ([X]|O): ')
turn = 'O' if (turn.lower() == 'o') else 'X'
# turn = 'X'

computations = 0

board = [[' ', ' ', ' '],[' ', 'X', ' '],[' ', ' ', ' ']]

winning_positions = [[0,4,8],[2,4,6],[0,3,6],[1,4,7],[2,5,8],[0,1,2],[3,4,5],[6,7,8]]


# Prints the board to console
def print_board():
    print(" %c | %c | %c" % (board[0][0], board[0][1], board[0][2]))
    print("---|---|---")
    print(" %c | %c | %c" % (board[1][0], board[1][1], board[1][2]))
    print("---|---|---")
    print(" %c | %c | %c" % (board[2][0], board[2][1], board[2][2]))
    print()


# Indexes the board from 0-8 and returns the element at that index
def get_item_at_index(board_state, index):
    return board_state[index // 3][index % 3]


# Indexes the board from 0-8 and sets the element at that index to the given player
def set_item_at_index(board_state, index, player):
    board_state[index // 3][index % 3] = player


def game_won(board_state, player):
    for winning_position in winning_positions:
        winning = True
        for position in winning_position:
            if not get_item_at_index(board_state, position) == player:
                winning = False
                break
        if winning:
            print("Player %c won!" % player)
            return True
    return False


def make_turn(player, move_row, move_col):
    print("Make Move", player, move_row, move_col)


while not (game_won(board, 'X') or game_won(board, 'O')):
    move = '-'
    while not (move.isnumeric() and 0 <= int(move) <= 8):
        move = input("Choose a number 0-8 to make your move [%c]: " % turn)

    turn = 'O' if turn == 'X' else 'X'

    print(move)
    print_board()






