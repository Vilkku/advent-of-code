import utils

def part_1(input):
    input_lines = utils.lines(input)
    most_common_bits = []
    least_common_bits = []

    for position in range(0, len(input_lines[0])):
        if (get_significant_bit_for_column(input_lines, position) == 0):
            most_common_bits.append(0)
            least_common_bits.append(1)
        else:
            most_common_bits.append(1)
            least_common_bits.append(0)

    gamma = int(''.join([str(int) for int in most_common_bits]), 2)
    epsilon = int(''.join([str(int) for int in least_common_bits]), 2)

    return gamma * epsilon

def part_2(input):
    input_lines = utils.lines(input)
    lines_o = input_lines
    lines_co2 = input_lines

    rating_o = 0
    rating_co2 = 0

    for position in range(0, len(input_lines[0])):
        significant_bit_o = get_significant_bit_for_column(lines_o, position)
        lines_o = lines_with_bit_in_column(lines_o, significant_bit_o, position)
    
        if len(lines_o) == 1:
            rating_o = int(lines_o[0], 2)
            break
    
    for position in range(0, len(input_lines[0])):
        significant_bit_co2 = 1 - get_significant_bit_for_column(lines_co2, position)
        lines_co2 = lines_with_bit_in_column(lines_co2, significant_bit_co2, position)

        if len(lines_co2) == 1:
            rating_co2 = int(lines_co2[0], 2)
            break

    return rating_o * rating_co2

def get_significant_bit_for_column(lines, column):
    count_0 = 0
    count_1 = 0

    for line in lines:
        if line[column] == '0':
            count_0 += 1
        elif line[column] == '1':
            count_1 += 1

    if count_1 >= count_0:
        return 1

    return 0

def lines_with_bit_in_column(lines, bit, column):
    wanted_lines = []

    for line in lines:
        if line[column] == str(bit):
            wanted_lines.append(line)

    return wanted_lines

def main():
    file = utils.read_input_file(3)
    print(part_1(file))
    print(part_2(file))

if __name__ == "__main__":
    main()
