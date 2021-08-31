# from ContextStack import ContextStack
import Helpers.Utilities as ut
from Helpers.ContextStack import ContextStack

import json
import sys

class PlanEvaluator:

    def __init__(self):
        if len(sys.argv) < 2:
            print("USAGE: python3 evaluator.py plan.json")
            exit()
        file = open(sys.argv[1])
        self.contextStack = ContextStack()
        self.contextStack.pushContext(json.load(file))

    def applyPreference(self, totalScore, maxScore, scalar, weight, score):
        return (totalScore+weight*scalar(score), maxScore+weight)

    # Public Evaluators
    def courseName(self, name):
        return PlanEvaluator.courseNameInContext(self.contextStack.currentContext(), name)

    def nCourseNamesIn(self, n, courseNamesList):
        count = 0
        for courseName in courseNamesList:
            if self.courseNameInContext(self.contextStack.currentContext(), courseName):
                count += 1
                if count >= n:
                    return True
        return False


    def violatesLeftBeforeRight(self, leftCourseName, rightCourseName):
        leftTerm = self.termSectionForCourseName(self.contextStack.currentContext(), leftCourseName)
        rightTerm = self.termSectionForCourseName(self.contextStack.currentContext(), rightCourseName)
        if leftTerm is not None and rightTerm is not None:
            return leftTerm[0]['term-number'] < rightTerm[0]['term-number']
        else:
            return False

    def violatesMultiLeftBeforeRight(self, leftCourseNamesList, rightCourseName):
        for leftCourse in leftCourseNamesList:
            if self.violatesLeftBeforeRight(leftCourse, rightCourseName):
                return True
        return False


    def totalCredits(self):
        creditSum = 0
        for term in self.contextStack.currentContext()['terms']:
            for section in term['sections']:
                creditSum += section['credits']
        return creditSum

    def totalCourses(self):
        coursesSum = 0
        for term in self.contextStack.currentContext()['terms']:
            for section in term['sections']:
                coursesSum += 1
        return coursesSum

    def totalCreditsGreaterThanEqualToCourseNumber(self, minCourseNumber):
        creditSum = 0
        for term in self.contextStack.currentContext()['terms']:
            for section in term['sections']:
                if section['course-number'] >= minCourseNumber:
                    creditSum += section['credits']
        return creditSum

    def totalCoursesGreaterThanEqualToCourseNumber(self, minCourseNumber):
        courseSum = 0
        for term in self.contextStack.currentContext()['terms']:
            for section in term['sections']:
                if section['course-number'] >= minCourseNumber:
                    courseSum += 1
        return courseSum


    def averageStartTime(self):
        timeSum = 0
        counter = 0
        for term in self.contextStack.currentContext()['terms']:
            for section in term['sections']:
                for meeting in section['meetings']:
                    armyTime = meeting['start-time']
                    timeSum += ut.armyTimeToMinsSinceMidnight(armyTime)
                    counter += 1
        return timeSum / counter

    # Private Evaluators

    @staticmethod
    def courseNameInContext(context, courseName):
        return PlanEvaluator.termSectionForCourseName(context, courseName) is not None

    @staticmethod
    def termSectionForCourseName(context, courseName):
        for term in context['terms']:
            for section in term['sections']:
                if section['course-name'] == courseName:
                    return term, section
        return None


