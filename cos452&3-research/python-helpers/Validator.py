class Validator:
    def __init__(self):
        self.isValid = True

    def assertTrue(self, value, message):
        if not value:
            self.isValid = False
            print("Requirement Violation: {}".format(message))

    def assertFalse(self, value, message):
        self.assertTrue(not value, message)

    def assertEquals(self, value, expected, message):
        self.assertTrue(value == expected, "{} (expected '{}' but found '{}')".format(message, expected, value))
