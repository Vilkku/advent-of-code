import utils

def part_1(input):
    input_lines = utils.lines(input)
    horizontal = 0
    depth = 0

    for instruction in input_lines:
        direction, distance = instruction.split(' ', 1)
        distance = int(distance)

        if direction == 'up':
            depth -= distance
        elif direction == 'down':
            depth += distance
        elif direction == 'forward':
            horizontal += distance

    return horizontal * depth

def part_2(input):
    input_lines = utils.lines(input)
    horizontal = 0
    depth = 0
    aim = 0

    for instruction in input_lines:
        direction, x = instruction.split(' ', 1)
        x = int(x)

        if direction == 'up':
            aim -= x
        elif direction == 'down':
            aim += x
        elif direction == 'forward':
            horizontal += x
            depth += (aim * x)

    return horizontal * depth

def main():
    file = utils.read_input_file(2)
    print(part_1(file))
    print(part_2(file))

if __name__ == "__main__":
    main()
