import unittest
import day_03

TEST_INPUT = """00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010"""

class TestDay03(unittest.TestCase):
    def test_day_03_part_1_ex_01(self):
        self.assertEqual(day_03.part_1(TEST_INPUT), 198)

    def test_day_03_part_2_ex_01(self):
        self.assertEqual(day_03.part_2(TEST_INPUT), 230)

if __name__ == "__main__":
    unittest.main()
