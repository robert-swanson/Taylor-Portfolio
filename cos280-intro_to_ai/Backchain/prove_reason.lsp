(defun listToString (lst)
  (if (null lst) "" 
    (concatenate 'string (write-to-string (car lst)) " " (listToString (cdr lst)))))
(defun prove? (toProve facts rules)
  ;  (format t "A: ~A ~A ~A~%" toProve facts rules) 
  (setf endGoal NIL)
  (if (and (listp toProve) (equal (length toProve) 1))
    (setf toProveSafe (car toProve))
    (setf toProveSafe toProve))
  ;  (format t "toProve: ~A~%" toProveSafe)
  (if (atom toProveSafe) ;If proving stand alone fact
    (progn 
      ;	  (format t "Proving standalone~%")
      (if (find toProveSafe facts)
        (setf endGoal T)
        (dolist (i rules)
            (if (equal (car (last i)) toProveSafe)
              (if (prove? (car i) facts rules)
                (progn (setf endGoal T) ))
              ))))
    (progn
      ;	  (format t "Proving operator: ~A~%" toProve)
      (cond ;If proving operator
        ((equal (car toProve) 'NOT) 
         (setf endgoal (not (prove? (car (last toProve)) facts rules))))
        ((equal (car toProve) 'OR)
         (setf endgoal (or (prove? (car (cdr toProve)) facts rules) (prove? (car (last toProve)) facts rules))))
        ((equal (car toProve) 'AND)
         (setf endgoal (and (prove? (car (cdr toProve)) facts rules) (prove? (car (last toProve)) facts rules)))))))


  ;  (format t "Returning: ~A~%" endgoal)
  (if endGoal (format t "~A~A~%" (if (find (if (listp toProve) (car toProve) toProve) facts) "We are given " "Therefore ") (if (listp toProve) (listToString toProve) toProve))
    (if (or (atom toProve) (equal (length toProve) 1)) (format t "~A is false~%" (if (listp toProve) (listToString toProve) toProve))))
  endGoal)


