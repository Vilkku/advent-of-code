def read_input_file(day: int):
    with open(f'inputs/day_{day}.txt', encoding='utf-8') as file:
        return file.read()

def lines(input):
    return list(input.splitlines())

def ints(input):
    return list(map(int, lines(input)))
