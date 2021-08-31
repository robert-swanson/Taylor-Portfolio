package objects.misc;

import com.google.gson.*;

import java.lang.reflect.Type;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Time implements Comparable<Time> {
    int armyTime;

    public Time(String twelveHourTime) {
        Pattern twelveHourPattern = Pattern.compile("(\\d{1,2}):(\\d{2}) (AM|PM)");
        Matcher matcher = twelveHourPattern.matcher(twelveHourTime);
        if (!matcher.matches()) {
            throw new JsonParseException(String.format("Time '%s' does not match 12 hour format: 'HH:MM AM/PM'", twelveHourTime));
        } else {
            int hour = Integer.parseInt(matcher.group(1));
            hour = (hour == 12) ? 0 : hour;
            int minute = Integer.parseInt(matcher.group(2));
            if (matcher.group(2).equalsIgnoreCase("AM")) {
                armyTime = hour * 100 + minute;
            } else if (matcher.group(3).equalsIgnoreCase("PM")) {
                armyTime = (hour+12) * 100 + minute;
            }
        }
    }

    @Override
    public String toString() {
        int hour = armyTime / 100 % 12, minute = armyTime % 100;
        hour = (hour == 0) ? 12 : hour;
        return String.format("%d:%02d %s", hour, minute, (armyTime >= 1200) ? "PM" : "AM");
    }

    @Override
    public int compareTo(Time o) {
        return armyTime - o.armyTime;
    }

    public static class Serializer implements JsonSerializer<Time> {
        @Override
        public JsonElement serialize(Time time, Type type, JsonSerializationContext jsonSerializationContext) {
            return new JsonPrimitive(time.toString());
        }
    }

    public static class Deserializer implements JsonDeserializer<Time> {
        @Override
        public Time deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
            return new Time(jsonElement.getAsString());
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Time time = (Time) o;
        return armyTime == time.armyTime;
    }

    @Override
    public int hashCode() {
        return Objects.hash(armyTime);
    }
}
