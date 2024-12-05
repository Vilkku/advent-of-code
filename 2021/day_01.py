import utils

def part_1(input):
    input_ints = utils.ints(input)
    increases = 0
    for index, line in enumerate(input_ints):
        if index == 0:
            continue
        if line > input_ints[index-1]:
            increases += 1

    return increases

def part_2(input):
    input_ints = utils.ints(input)
    increases = 0
    prev_window_sum = None
    for index, line in enumerate(input_ints):
        if index < 2:
            continue

        window_sum = line + input_ints[index-1] + input_ints[index-2]

        if prev_window_sum is None:
            prev_window_sum = window_sum
            continue

        if window_sum > prev_window_sum:
            increases += 1

        prev_window_sum = window_sum

    return increases


def main():
    file = utils.read_input_file(1)
    print(part_1(file))
    print(part_2(file))

if __name__ == "__main__":
    main()
