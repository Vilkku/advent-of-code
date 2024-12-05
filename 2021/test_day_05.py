import unittest
import day_05

TEST_INPUT = """0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2"""

class TestDay05(unittest.TestCase):
    def test_day_05_part_1(self):
        self.assertEqual(day_05.part_1(TEST_INPUT), 5)

    def test_day_05_part_2(self):
        self.assertEqual(day_05.part_2(TEST_INPUT), 12)

if __name__ == "__main__":
    unittest.main()
