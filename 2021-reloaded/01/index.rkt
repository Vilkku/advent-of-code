#lang racket

(define (read-input)
  (define lines (with-input-from-file "input.txt"
                   (lambda ()
                     (for/list ([line (in-lines)])
                       line))))
  lines)

(define (to-int s)
  (let ((n (string->number (string-trim s))))
    (if n n 0)))

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

(define input-rows (read-input))

(define part1-answer (part1 input-rows))
(printf "Part 1: ~a\n" part1-answer)
(unless (= part1-answer 1400)
  (error "Part 1 answer mismatch" part1-answer))

(define part2-answer (part2 input-rows))
(printf "Part 2: ~a\n" part2-answer)
(unless (= part2-answer 1429)
  (error "Part 2 answer mismatch" part2-answer))
