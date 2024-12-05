import utils
import re

class Line:
    def __init__(self, x1, y1, x2, y2):
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
        self.is_horizontal_or_vertical = self.is_horizontal() or self.is_vertical()

    def is_horizontal(self):
        return self.x1 == self.x2

    def is_vertical(self):
        return self.y1 == self.y2

    def __repr__(self):
        return "({}, {}) -> ({}, {})".format(self.x1, self.y1, self.x2, self.y2)

class Chart:
    def __init__(self):
        self.points = dict()
        self.width = 0
        self.height = 0

    def add_line_to_point(self, x, y):
        point_name = self.get_point_name(x, y)
        if point_name in self.points:
            old_val = self.points[point_name]
            self.points[point_name] += 1
        else:
            self.points[point_name] = 1

    def get_point_name(self, x, y):
        return "{}, {}".format(x, y)

    def add_line_to_chart(self, line):
        step_y = 1 if line.y2 > line.y1 else -1
        step_x = 1 if line.x2 > line.x1 else -1

        if max(line.y1, line.y2) > self.height:
            self.height = max(line.y1, line.y2)

        if max(line.x1, line.x2) > self.width:
            self.width = max(line.x1, line.x2)

        if line.x1 == line.x2:
            # Horizontal
            for y in range(line.y1, line.y2 + step_y, step_y):
                self.add_line_to_point(line.x1, y)
        elif line.y1 == line.y2:
            # Vertical
            for x in range(line.x1, line.x2 + step_x, step_x):
                self.add_line_to_point(x, line.y1)
        else:
            # Diagonal
            x = line.x1

            for y in range(line.y1, line.y2 + step_y, step_y):
                self.add_line_to_point(x, y)
                x += step_x


    def print_chart(self):
        print('\n---BEGIN CHART---')
        for y in range(0, self.height + 1):
            line = ''
            for x in range(0, self.width + 1):
                point_name = self.get_point_name(x, y)
                if self.get_point_name(x, y) in self.points:
                    line += str(self.points[point_name])
                else:
                    line += '.'

            print(line)
        print('--- END CHART ---\n')

def part_1(input):
    lines = [ line for line in input_to_lines(input) if line.is_horizontal_or_vertical ]
    chart = Chart()
    for line in lines:
        chart.add_line_to_chart(line)

    overlapping_lines_count = len([ point for point in chart.points if chart.points[point] >= 2])

    return overlapping_lines_count

def part_2(input):
    lines = input_to_lines(input)
    chart = Chart()

    for line in lines:
        chart.add_line_to_chart(line)

    overlapping_lines_count = len([ point for point in chart.points if chart.points[point] >= 2])

    return overlapping_lines_count

def input_to_lines(input):
    input_lines = utils.lines(input)
    lines = []
    regex = r"([0-9]+),([0-9]+) -> ([0-9]+),([0-9]+)"

    for input_line in input_lines:
        _, x1, y1, x2, y2, _ = re.split(regex, input_line)
        lines.append(Line(int(x1), int(y1), int(x2), int(y2)))
        
    return lines


def main():
    file = utils.read_input_file(5)
    print(part_1(file))
    print(part_2(file))

if __name__ == "__main__":
    main()