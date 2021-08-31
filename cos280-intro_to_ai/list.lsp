(defun lil (lst)
  (if (null lst)
    NIL 
    (if (listp (car lst))
      T
      (lil (cdr lst)) )))

(format t "~A~%" (lil ()))
(format t "~A~%" (lil '(1 2 3)))
(format t "~A~%" (lil '(1 '(1 2 ) 3)))
