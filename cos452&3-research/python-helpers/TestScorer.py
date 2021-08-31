from Scorer import Scorer
import matplotlib.pyplot as plt
import numpy as np


scorer = Scorer()
scorer.enableDiagnostics()

def graph(title, low, high, worstBound=None, bestBound=None, lowerQuartile=None, higherQuartile=None):
    x = np.arange(low, high, 0.01)
    y = []
    for xval in x:
        y.append(scorer.scoreSigmoid(xval, 1, title, worstBound=worstBound, bestBound=bestBound, lowerQuartile=lowerQuartile, upperQuartile=higherQuartile))
    plt.plot(x, y)
    plt.title(title)
    plt.show()

def graphOptimum(title, low, high, optimum, worstDeviance=None, lowerQuartileDeviance=None, leftWorstDeviance=None, leftLowerQuartileDeviance=None, rightWorstDeviance=None, rightLowerQuartileDeviance=None):
    x = np.arange(low, high, 0.01)
    y = []
    for xval in x:
        y.append(scorer.scoreOptimum(xval, 1, title, optimum, worstDeviance=worstDeviance, lowerQuartileDeviance=lowerQuartileDeviance, leftLowerQuartileDeviance=leftLowerQuartileDeviance, leftWorstDeviance=leftWorstDeviance, rightLowerQuartileDeviance=rightLowerQuartileDeviance, rightWorstDeviance=rightWorstDeviance))
    plt.plot(x, y)
    plt.title(title)
    plt.show()

def graphBoolean(title, low, high):
    x = np.arange(low, high, .1)
    y = []
    for xval in x:
        y.append(scorer.scoreBoolean(xval>0, 1, title))
    plt.plot(x, y)
    plt.title(title)
    plt.show()


# Sigmoid
flip = 1
graph("Full Sigmoid",-5,5, lowerQuartile=-1*flip, higherQuartile=1*flip)
graph("Left Sigmoid Right Linear",-5,5, lowerQuartile=-1*flip, bestBound=1*flip)
graph("Left Linear Right Sigmoid",-5,5, worstBound=-1*flip, higherQuartile=1*flip)
graph("Full Linear",-5,5, worstBound=-1*flip, bestBound=1*flip)

# # Score Optimum
graphOptimum("Full Square Optimum", -2, 2, 0, worstDeviance=1*flip)
graphOptimum("Left Square Right Power", -2, 2, 0, leftWorstDeviance=1*flip, rightLowerQuartileDeviance=1*flip)
graphOptimum("Left Power Right Square", -2, 2, 0, leftLowerQuartileDeviance=1*flip, rightWorstDeviance=1*flip)
graphOptimum("Full Power", -2, 2, 0, lowerQuartileDeviance=1*flip)

graphOptimum("Left Square Right Power, Optimum .5, Skewed", -2, 2, .5, leftWorstDeviance=2, rightLowerQuartileDeviance=.5*flip)

# Boolean
graphBoolean("Boolean", -2, 2)

