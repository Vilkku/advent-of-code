import unittest
import day_01

TEST_INPUT = """199
200
208
210
200
207
240
269
260
263"""

class TestDay01(unittest.TestCase):
    def test_day_01_part_1_ex_01(self):
        self.assertEqual(day_01.part_1(TEST_INPUT), 7)

    def test_day_01_part_2_ex_01(self):
        self.assertEqual(day_01.part_2(TEST_INPUT), 5)

if __name__ == "__main__":
    unittest.main()
