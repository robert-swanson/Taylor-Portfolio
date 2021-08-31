def minsSinceMidnightToArmyTime(mins):
    return int((mins // 60) * 100 + (mins % 60))

def armyTimeToMinsSinceMidnight(armyTime):
    return (armyTime//100) * 60 + (armyTime%100)

