package scoring.evaluation;

import objects.misc.Time;

public abstract class Value {
    public static class Numeric extends Value {
        private double value;
    }
    public static class Text extends Value {
        private String value;
    }
    public static class Time extends Value {
        private Time value;
    }
}
