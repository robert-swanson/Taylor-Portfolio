
;deg-req
;((MAJOR-HOURS 64) (REQUIRED COS102 COS120 COS121 COS143 COS243 COS265 COS284 COS492 COS493 MAT151 MAT215 (OR COS311 COS321) (OR COS320 COS382 COS435) (OR COS393 COS394 COS450) (OR MAT210 MAT352)) (ELECTIVES COS104 COS109 COS130 COS170 COS232 COS270 COS280 COS310 COS323 COS331 COS333 COS340 COS343 COS350 COS351 COS355 COS360 COS370 COS380 COS381 COS411 COS421 COS424 COS425 COS432 COS433 COS436 MAT230 MAT240 MAT245 MAT251 SYS214 SYS352 SYS401 SYS402 SYS403 SYS411))
(setq deg-req '((MAJOR-HOURS 64) (REQUIRED COS102 COS120 COS121 COS143 COS243 COS265 COS284 COS492 COS493 MAT151 MAT215 (OR COS311 COS321) (OR COS320 COS382 COS435) (OR COS393 COS394 COS450) (OR MAT210 MAT352)) (ELECTIVES COS104 COS109 COS130 COS170 COS232 COS270 COS280 COS310 COS323 COS331 COS333 COS340 COS343 COS350 COS351 COS355 COS360 COS370 COS380 COS381 COS411 COS421 COS424 COS425 COS432 COS433 COS436 MAT230 MAT240 MAT245 MAT251 SYS214 SYS352 SYS401 SYS402 SYS403 SYS411)))

;person
;((TRANSCRIPT (COS102 A-) (COS109 A) (COS120 B) (COS121 B+) (COS143 A-) (COS243 B+) (COS265 B) (COS284 B-) (MAT151 A-) (MAT210 B)) (PLAN COS492 COS493 COS280 COS331 COS340 COS350 SYS214 SYS411 MAT215))
(setq person '((TRANSCRIPT (COS102 A-) (COS109 A) (COS120 B) (COS121 B+) (COS143 A-) (COS243 B+) (COS265 B) (COS284 B-) (MAT151 A-) (MAT210 B)) (PLAN COS492 COS493 COS280 COS331 COS340 COS350 SYS214 SYS411 MAT215)))

;Main function
;===============================================================================================================;
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
;===============================================================================================================;

;Helper function for mak-class-req
(defun make-req-list (deg-req)
  (if (NULL deg-req)
    NIL 
    (let ((x (car deg-req)))
      (if (listp x)
        (make-req-list (car deg-req))
        (setq x (cons x (make-req-list (cdr deg-req))))
        )
      )
    )
  )


;Helper function for make-class-list
(defun make-class-req (classes deg-req)
  (let ((courses (make-req-list deg-req)) (apClasses '()))
    (loop for i in classes do
          (if (find i courses)
            (setq apClasses (cons i apClasses))
            )
          )
    apClasses)
  )
