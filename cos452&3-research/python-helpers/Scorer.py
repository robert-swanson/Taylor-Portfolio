class Scorer:
    def __init__(self):
        self.score = 0
        self.maxPossibleScore = 0
        self.diagnostics = False

    def getScore(self):
        return self.score/self.maxPossibleScore * 100

    def scoreBoolean(self, value, weight, preferenceName, invert=False):
        self.maxPossibleScore += weight
        score = 1 if value ^ invert else 0

        if self.diagnostics:
            print("Score: {:.2f}%\tWeight: {}\tPreference Name: {}, Given: {}, Inverted: {}".format(score*100, weight, preferenceName, value, invert))

        self.score += score * weight
        return score

    def scoreOptimum(self, value, weight, preferenceName, optimum, invert=False, worstDeviance=None, lowerQuartileDeviance=None, leftWorstDeviance=None, leftLowerQuartileDeviance=None, rightWorstDeviance=None, rightLowerQuartileDeviance=None):
        if worstDeviance:
            assert not (lowerQuartileDeviance or leftLowerQuartileDeviance or leftWorstDeviance or rightLowerQuartileDeviance or rightWorstDeviance)
            leftWorstDeviance = worstDeviance
            rightWorstDeviance = worstDeviance
        elif lowerQuartileDeviance:
            assert not (worstDeviance or leftLowerQuartileDeviance or leftWorstDeviance or rightLowerQuartileDeviance or rightWorstDeviance)
            leftLowerQuartileDeviance = lowerQuartileDeviance
            rightLowerQuartileDeviance = lowerQuartileDeviance
        elif leftWorstDeviance:
            assert not leftLowerQuartileDeviance and (rightLowerQuartileDeviance or rightWorstDeviance)
        elif leftLowerQuartileDeviance:
            assert not leftWorstDeviance and (rightLowerQuartileDeviance or rightWorstDeviance)
        elif rightWorstDeviance:
            assert not rightLowerQuartileDeviance and (leftLowerQuartileDeviance or leftWorstDeviance)
        elif rightLowerQuartileDeviance:
            assert not rightWorstDeviance and (leftLowerQuartileDeviance or leftWorstDeviance)
        else:
            raise Exception("Expected deviance parameters")

        def symNormalize(optimum, deviance, value):
            return (value - optimum) / deviance

        def quadratic(x):
            if abs(x) > 1:
                return 0
            else:
                return -1 * (x ** 2) + 1

        def squarePower(value):
            a = .25  # the y value a deviance = 1
            return a ** (value ** 2)

        score = -1
        if value < optimum: # Left
            if leftWorstDeviance:
                score = quadratic(symNormalize(optimum, leftWorstDeviance, value))
            elif leftLowerQuartileDeviance:
                score = squarePower(symNormalize(optimum,leftLowerQuartileDeviance, value))
            else:
                raise
        else: # Right
            if rightWorstDeviance:
                score = quadratic(symNormalize(optimum, rightWorstDeviance, value))
            elif rightLowerQuartileDeviance:
                score = squarePower(symNormalize(optimum,rightLowerQuartileDeviance, value))
            else:
                raise

        if invert:
            score = 1-score

        if self.diagnostics:
            print("Score: {:.2f}%\tWeight: {}\tPreference Name: {}, Given: {}, Optimum: {} Inverted: {}".format(score*100, weight, preferenceName, value, optimum, invert))

        self.maxPossibleScore += weight
        self.score += score * weight
        return score*weight

    def scoreSigmoid(self, value, weight, preferenceName, invert=False, worstBound=None, bestBound=None, lowerQuartile=None, upperQuartile=None):
        # worstBound describes the value required to return a score of 0.25 * weight
        # bestBound describes the value required to return a score of 0.75 * weight
        # if bestBound < worstBound then the sigmoid function is reversed, giving higher scores for lower values
        assert bool(worstBound) != bool(lowerQuartile)
        assert bool(bestBound) != bool(upperQuartile)
        lower = worstBound if worstBound else lowerQuartile
        upper = bestBound if bestBound else upperQuartile
        assert lower != upper

        normalizedValue = (value - lower) / (upper - lower) - .5
        if normalizedValue > 0 : # Score greater than 50%
            if bestBound:
                score = 1 if (normalizedValue >= 0.5) else (normalizedValue + 0.5)
            else:
                score = 1 / (1 + pow(9, normalizedValue * -1))
        else: # Score less than 50%
            if worstBound:
                score = 0 if (normalizedValue <= -0.5) else (normalizedValue + 0.5)
            else:
                score = 1 / (1 + pow(9, normalizedValue * -1))

        if invert:
            score = 1-score

        if self.diagnostics:
            print("Score: {:.2f}%\tWeight: {}\tPreference Name: {}, Given: {}, Upper: {}, Lower: {}".format(score*100, weight, preferenceName, value, upper, lower))
            # print("Score: {:.2f}\tCurrent: {:.0f} (given: val={}, weight={}, worst={}, best={})".format(score, self.getScore(), value, weight, worstBound, bestBound))

        self.maxPossibleScore += weight
        self.score += score * weight
        return score*weight


    def enableDiagnostics(self):
        self.diagnostics = True

    def disableDiagnostics(self):
        self.diagnostics = False