(defun itrdot (n)
  (do
    ((i 0 (+ 1 i)))
    ((>= i n) (format t "~%"))
    (format t ".") ))

(defun rcrsdot (n)
  (if (<= n 0)
     (format t ".")
     (progn 
       (format t ".")
       (rcrsdot (- n 1)) )))

(defun summit (lst)
  (if (null lst)
    0
    (if (null (car lst))
      (summit (cdr lst))
      (+ (car lst) (summit (cdr lst))) )))

(defun summit (lst)
  (if (null lst)
    0
	   (let ((x (car lst)))
		  (if (null x)
			  (summit (cdr lst))
			  (+ x (summit (cdr lst)))))))
(defun summit (lst)
   (apply #'+ (remove NIL lst)) )


;(itrdot 0)
;(itrdot 5)

;;(rcrsdot 0)
;;(rcrsdot 5)

(summit ())
(summit '(1 4 5 NIL 4 5 6 NIL 3))
