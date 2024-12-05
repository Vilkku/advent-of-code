import unittest
import day_02

TEST_INPUT = """forward 5
down 5
forward 8
up 3
down 8
forward 2"""

class TestDay02(unittest.TestCase):
    def test_day_02_part_1_ex_01(self):
        self.assertEqual(day_02.part_1(TEST_INPUT), 150)

    def test_day_02_part_2_ex_01(self):
        self.assertEqual(day_02.part_2(TEST_INPUT), 900)

if __name__ == "__main__":
    unittest.main()
