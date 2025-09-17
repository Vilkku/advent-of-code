#lang racket

(require "../util.rkt" rackunit)

(define (part1 input-rows)
  (let ((depth 0) (horizontal 0))
    (for ([i (in-range (length input-rows))])
      (let ((parts (string-split (list-ref input-rows i))))
        (match (first parts)
          ["forward" (set! horizontal (+ horizontal (string->number (second parts))))]
          ["down" (set! depth (+ depth (string->number (second parts))))]
          ["up" (set! depth (- depth (string->number (second parts))))]
          )
        ))
    (* depth horizontal)))

(define input-rows (read-input "02/input.txt"))

(define part1-answer (part1 input-rows))
(printf "Part 1: ~a\n" part1-answer)
(check-equal? part1-answer 1694130)
