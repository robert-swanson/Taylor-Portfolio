package scoring.context.subcontext;

import objects.misc.Date;
import objects.misc.Time;
import objects.offerings.CourseOffering;
import objects.offerings.Meeting;
import objects.plan.PlanTerm;
import scoring.context.subcontext.SubContext;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Stack;
import java.util.TreeSet;

public class TermSubContext extends SubContext {
    Stack<ArrayList<WeekSubContext>> weekSubContexts;
    Stack<ArrayList<Double>> weights;

    public TermSubContext(PlanTerm planTerm) {
        ArrayList<WeekSubContext> weekSubContextArrayList = new ArrayList<>();
        ArrayList<Double> weightsList = new ArrayList<>();
        TreeSet<Date> semesterChangeDates = new TreeSet<>();
        weekSubContexts = new Stack<>();

        for (CourseOffering courseOffering : planTerm.getCourseOfferings()) {
            Date start = courseOffering.getStartDate().getFirstDayOfWeek();
            Date end = courseOffering.getEndDate().getFirstDayOfNextWeek();
            if (start != null && !semesterChangeDates.contains(start)) {
                semesterChangeDates.add(start);
            }
            if (end != null && !semesterChangeDates.contains(end)) {
                semesterChangeDates.add(end);
            }
        }

        Date startDate = null;
        for (Date endDate : semesterChangeDates) {
            LinkedList<Meeting> meetingsInSemesterSegment = new LinkedList<>();
            for (CourseOffering courseOffering : planTerm.getCourseOfferings()) {
                Date thisStart = courseOffering.getStartDate().getFirstDayOfWeek();
                Date thisEnd = courseOffering.getEndDate().getFirstDayOfNextWeek();
                if (thisStart <= )
            }
        }
    }
}
