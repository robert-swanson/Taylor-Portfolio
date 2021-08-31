import copy

class ContextStack:
    def __init__(self):
        self.stack = []

    def currentContext(self):
        return self.stack[-1]
    def pushContext(self, context):
        self.stack.append(context)
    def popContext(self):
        return self.stack.pop()

    def subcontext(self, conditionFunction):
        contextOut = copy.deepcopy(self.currentContext())
        emptyContext = True
        for term in self.currentContext()['terms']:
            self.pushContext(self.contextFromTerm(term))
            if not conditionFunction():
                contextOut['terms'].remove(term)
            else:
                emptyContext = False
            self.popContext()
        if emptyContext:
            return False
        else:
            self.pushContext(contextOut)
            return True

    def contextFromTerm(self, term):
        return {
            "terms": [term]
        }

