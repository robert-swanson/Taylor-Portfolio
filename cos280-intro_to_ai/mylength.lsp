(defun mylen (lst)
  (if (null lst)
   0
   (+ 1 (mylen (cdr lst)))))
