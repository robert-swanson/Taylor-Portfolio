package scoring.context;

import objects.offerings.CourseOffering;
import objects.plan.Plan;
import scoring.context.subcontext.SubContext;

public class FullPlanSubContext implements SubContext {
    Plan plan;

    public FullPlanSubContext(Plan plan) {
        this.plan = plan;
    }

    @Override
    public Iterable<CourseOffering> courseOfferings() {
        return plan.getCourseOfferingIterable();
    }
}
