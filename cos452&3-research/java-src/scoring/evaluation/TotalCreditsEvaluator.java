package scoring.evaluation;

import objects.offerings.CourseOffering;
import scoring.context.Context;

public class TotalCreditsEvaluator implements ContextEvaluator {
    @Override
    public Result getValue(Context context) {
        Result val = new Result("Terms Credits");
        for (Iterable<CourseOffering> offerings : context.courseOfferings()) {
            double creditSum = 0.0;
            for (CourseOffering offering : offerings) {
                creditSum += offering.getCredits();
            }
            val.addDouble(creditSum);
        }
        return val;
    }
}
