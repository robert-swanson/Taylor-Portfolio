; Makes a list of classes taken or taking that count for major credit
(defun make-class-list (person deg-req)
  (let ((x (cdr (car (last (last person))))))
    (loop for i in (cdr (car person))
          do
          (if (or (or (or (equal 'D+ (last i)) (equal 'D (last i))) (equal 'D- (last i))) (equal 'F (last i)))
            NIL
            (setq x (cons (car i) x)))
          )
    (make-class-req x deg-req))
  )

; Makes a list of all the courses that can count for credit
(defun make-req-list (deg-req)
  (let ((rv ())) 
    (dolist (req (append (cdr (car (cdr deg-req))) (cdr (car (last deg-req)))))
       (setf rv (append rv 
                  (if (atom req)
                    (cons req ())
                    (cdr req) ))))
    rv))



; Filters out classes in list that arn't required or elective
(defun make-class-req (classes deg-req)
  (let ((courses (make-req-list deg-req)) (apClasses '()))
    (loop for i in classes do
          (if (find i courses)
            (setq apClasses (cons i apClasses))
            )
          )
    apClasses)
  )

; Returns number of credit hours for course or NIL if course isn't in catalog
(defun get-course-hours (catalog course)
  (dolist (combo catalog)
	(if (equal (car combo) course)
	  (return (car (cdr combo))) ))
  )

; Returns the excess credit hours in the plan
(defun check-hour-reqs (catalog hours reqs-list)
  (let ((hour-count 0))
	(dolist (course reqs-list)
	  (setf hour-count (+ hour-count (get-course-hours catalog course))) )
	(- hour-count hours) ))

; Returns whether or not a requirement is fulfulled
(defun req-fulfilled (req reqs-list)
  (if (or (null req) (equal req '(OR))) NIL
	(if (atom req)
	  (find req reqs-list)
	  (or (req-fulfilled (car (cdr req)) reqs-list) (req-fulfilled (cons 'OR (cdr (cdr req))) reqs-list)) ))) 

; Returns all the course requirements that are not being fulfulled
(defun check-class-reqs (reqs-list required)
  (let ((missing ()))
	(dolist (req required)
	  (if (not (req-fulfilled req reqs-list))
		(setf missing (append missing (cons req ()))) ))
	missing ))

; Performs the evaluation on the person
(defun grad-check (person degree-requirements catalog)
  (let ( 
		 (hours (car (cdr (car degree-requirements))))
		 (required (cdr (car (cdr degree-requirements))))
		 (electives (car (last degree-requirements))) )
	(let ( (reqs-list (make-class-list person degree-requirements)) )
	  (let (
			(extra-credits (check-hour-reqs catalog hours reqs-list)) 
			(unfulfilled-classes (check-class-reqs reqs-list required)) )
		(if (and (>= extra-credits 0) (equal (length unfulfilled-classes) 0))
			(values 'PASS (cons 'EXTRA-HOURS (cons extra-credits ())))
			(values 'FAIL (cons unfulfilled-classes (cons 'EXTRA-HOURS (cons extra-credits ())))) )))))

; Test data

(setf test-person '(
					 (transcript (COS102 A-) (COS109 A) (COS120 B) (COS121 B+) (COS143 A-) (COS243 B+) (COS265 B) (COS284 B-) (MAT151 A-) (MAT210 B))
					 (plan COS492 COS493 COS280 COS331 COS340 COS350 SYS214 SYS411 COS435  MAT215 COS311 COS393) ))

(setf test-degree '(
					(major-hours 68)
					(required COS102 COS120 COS121 COS143 COS243 COS265 COS284 COS492 COS493 MAT151 MAT215
							  (OR COS311 COS321)
							  (OR COS320 COS382 COS435)
							  (OR COS393 COS394 COS450)
							  (OR MAT210 MAT352) )
					(electives COS104 COS109 COS130 COS170 
							   COS232 COS270 COS280 
							   COS310 COS323 COS331 COS333 COS340 COS343 COS350 
							   COS351 COS355 COS360 COS370 COS380 COS381
							   COS411 COS421 COS424 COS425 COS432 COS433 COS436
							   MAT230 MAT240 MAT245 MAT251
							   SYS214 SYS352 SYS401 SYS402 SYS403 SYS411) ))

(setf test-catalog '((COS102 3) (COS104 2) (COS109 3) (COS120 4) (COS121 4) (COS130 3) (COS143 3) (COS170 3) (COS232 3) (COS243 3) (COS265 3) (COS270 3) (COS280 3) (COS284 3) (COS310 1) (COS311 3) (COS321 3) (COS320 3) (COS323 3) (COS331 3) (COS333 3) (COS340 3) (COS343 3) (COS350 3) (COS351 3) (COS355 3) (COS360 3) (COS370 3) (COS380 3) (COS381 3) (COS382 3) (COS393 3) (COS394 3) (COS411 3) (COS421 3) (COS424 3) (COS425 3) (COS432 3) (COS433 3) (COS435 3) (COS436 3) (COS450 3) (COS492 3) (COS493 1) (MAT151 4) (MAT215 3) (MAT210 4) (MAT230 4) (MAT240 4) (MAT245 4) (MAT251 4) (MAT352 4) (SYS214 3) (SYS352 3) (SYS401 3) (SYS402 3) (SYS403 3) (SYS411 3) ))

