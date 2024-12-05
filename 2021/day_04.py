import utils

def part_1(input):
    input_lines = utils.lines(input)
    numbers = get_bingo_numbers(input_lines)
    boards = get_bingo_boards(input_lines)

    for number_index in range(0, len(numbers)):
        last_called_number = numbers[number_index]
        called_numbers = numbers[0:number_index+1]
        for board in boards:
            if check_bingo_board(board, called_numbers):
                unchecked_numbers = get_unchecked_numbers(board, called_numbers)
                return sum(unchecked_numbers) * last_called_number
    
    return None

def part_2(input):
    input_lines = utils.lines(input)
    numbers = get_bingo_numbers(input_lines)
    boards = get_bingo_boards(input_lines)

    for number_index in range(0, len(numbers)):
        last_called_number = numbers[number_index]
        called_numbers = numbers[0:number_index+1]
        for board in boards:
            if check_bingo_board(board, called_numbers):
                if len(boards) == 1:
                    unchecked_numbers = get_unchecked_numbers(board, called_numbers)
                    return sum(unchecked_numbers) * last_called_number

                boards.remove(board)
    
    return None

def get_bingo_numbers(input_lines):
    return list(map(int, input_lines[0].split(",")))

def get_bingo_boards(input_lines):
    boards = []
    for first_row_index in range(2, len(input_lines), 6):
        board = []
        for current_row_num in range(0, 5):
            current_row_index = first_row_index + current_row_num
            row_ints = list(map(int, input_lines[current_row_index].split()))
            board = board + row_ints

        boards.append(board)

    return boards

def check_bingo_board(board, numbers):
    for row_index in range(0, len(board), 5):
        if all(elem in numbers for elem in board[row_index:row_index+5]):
            return True

    for col_index in range(0, 5):
        if all(elem in numbers for elem in board[col_index::5]):
            return True

    return False

def get_unchecked_numbers(board, numbers):
    return [elem for elem in board if elem not in numbers]

def main():
    file = utils.read_input_file(4)
    print(part_1(file))
    print(part_2(file))

if __name__ == "__main__":
    main()
