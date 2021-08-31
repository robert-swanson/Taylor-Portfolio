package objects.offerings;

import objects.misc.Time;
import objects.misc.Weekday;
import java.util.ArrayList;


public class Meeting {
    private ArrayList<Weekday> days;
    private Time startTime;
    private Time endTime;

    public ArrayList<Weekday> getDays() {
        return days;
    }

    public Time getStartTime() {
        return startTime;
    }

    public Time getEndTime() {
        return endTime;
    }
}
