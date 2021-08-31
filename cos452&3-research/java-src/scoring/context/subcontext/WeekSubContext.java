package scoring.context.subcontext;

import objects.misc.Date;
import objects.misc.Weekday;
import objects.offerings.CourseOffering;
import objects.offerings.Meeting;
import scoring.context.subcontext.SubContext;

import java.util.LinkedList;
import java.util.Stack;

public class WeekSubContext extends SubContext {
    Stack<LinkedList<Meeting>> meetings;
    Date startDate, endDate;

    public WeekSubContext(LinkedList<Meeting> meetings, Date startDate, Date endDate) {
        this.meetings = new Stack<>();
        this.meetings.add(meetings);
        this.startDate = startDate;
        this.endDate = endDate;
    }
}
