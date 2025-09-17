#lang racket

(provide read-input)

(define (read-input file)
  (define lines (with-input-from-file file
                  (lambda ()
                    (for/list ([line (in-lines)])
                      line))))
  lines)
