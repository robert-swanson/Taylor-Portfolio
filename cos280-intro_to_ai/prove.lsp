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
		(progn (setf endGoal T))
		(dolist (i rules)
		  (progn 
			(if (equal (car (last i)) toProveSafe)
			  (if (prove? (car i) facts rules)
				(progn (setf endGoal T) ))
			  )))))
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
  endGoal)


