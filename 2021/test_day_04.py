import unittest
import utils
import day_04

TEST_INPUT = """7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7"""

class TestDay04(unittest.TestCase):
    def test_get_bingo_numbers(self):
        self.assertListEqual(day_04.get_bingo_numbers(utils.lines(TEST_INPUT)), [7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1])

    def test_get_bingo_boards(self):
        boards = day_04.get_bingo_boards(utils.lines(TEST_INPUT))
        self.assertEqual(len(boards), 3)
        self.assertListEqual(boards[0], [22, 13, 17, 11, 0, 8, 2, 23, 4, 24, 21, 9, 14, 16, 7, 6, 10, 3, 18, 5, 1, 12, 20, 15, 19])

    def test_check_bingo_board_row(self):
        numbers = [7, 9, 14, 16, 21]
        boards = day_04.get_bingo_boards(utils.lines(TEST_INPUT))
        self.assertTrue(day_04.check_bingo_board(boards[0], numbers))
        self.assertFalse(day_04.check_bingo_board(boards[1], numbers))

    def test_check_bingo_board_column(self):
        numbers = [3, 14, 17, 20, 23]
        boards = day_04.get_bingo_boards(utils.lines(TEST_INPUT))
        self.assertTrue(day_04.check_bingo_board(boards[0], numbers))
        self.assertFalse(day_04.check_bingo_board(boards[1], numbers))

    def test_get_unchecked_numbers(self):
        input_lines = utils.lines(TEST_INPUT)
        numbers = day_04.get_bingo_numbers(input_lines)
        # Last called number is 24 (index 11) when bingo is found on board 3
        called_numbers = numbers[0:12]
        boards = day_04.get_bingo_boards(input_lines)
        self.assertListEqual(day_04.get_unchecked_numbers(boards[0], called_numbers), [22, 13, 8, 16, 6, 10, 3, 18, 1, 12, 20, 15, 19])
        self.assertListEqual(day_04.get_unchecked_numbers(boards[1], called_numbers), [3, 15, 22, 18, 13, 19, 8, 25, 20, 10, 16, 12, 6])
        self.assertListEqual(day_04.get_unchecked_numbers(boards[2], called_numbers), [10, 16, 15, 19, 18, 8, 26, 20, 22, 13, 6, 12, 3])

    def test_day_04_part_1(self):
        self.assertEqual(day_04.part_1(TEST_INPUT), 4512)

    def test_day_04_part_2(self):
        self.assertEqual(day_04.part_2(TEST_INPUT), 1924)

if __name__ == "__main__":
    unittest.main()
