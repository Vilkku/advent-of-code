#lang racket

(provide read-input to-int)

(define (read-input file)
  (define lines (with-input-from-file file
                   (lambda ()
                     (for/list ([line (in-lines)])
                       line))))
  lines)

(define (to-int s)
  (let ((n (string->number (string-trim s))))
    (if n n 0)))
