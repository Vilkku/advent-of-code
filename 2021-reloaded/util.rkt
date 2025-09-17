#lang racket

(provide read-input to-int)

(define (read-input file)
  (define lines (with-input-from-file file
                   (lambda ()
                     (for/list ([line (in-lines)])
                       line))))
  lines)
