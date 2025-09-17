#lang racket

(require "../util.rkt" rackunit)

(define (part1 input-rows)
  (define increases 0)
  (for ([i (in-range 1 (length input-rows))])
    (when (> (to-int (list-ref input-rows i))
             (to-int (list-ref input-rows (- i 1))))
      (set! increases (+ increases 1))))
  increases)

(define (part2 input-rows)
  (define increases 0)
  (define prev 0)
  (for ([i (in-range 3 (length input-rows))])
    (define curr (+ (to-int (list-ref input-rows i))
                    (to-int (list-ref input-rows (- i 1)))
                    (to-int (list-ref input-rows (- i 2)))))
    (when (> curr prev)
      (set! increases (+ increases 1)))
    (set! prev curr))
  increases)

(define input-rows (read-input "01/input.txt"))

(define part1-answer (part1 input-rows))
(printf "Part 1: ~a\n" part1-answer)
(check-equal? part2-answer 1400)

(define part2-answer (part2 input-rows))
(printf "Part 2: ~a\n" part2-answer)
(check-equal? part2-answer 1429)
