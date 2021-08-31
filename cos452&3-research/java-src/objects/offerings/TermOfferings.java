package objects.offerings;

import com.google.gson.*;
import exceptions.OfferingException;
import objects.Linkable;
import objects.misc.CourseID;
import objects.Link;
import objects.misc.SectionID;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

public class TermOfferings implements Linkable {
    private LinkedHashMap<CourseID, CourseOfferings> courses;

    public TermOfferings(LinkedHashMap<CourseID, CourseOfferings> courses) {
        this.courses = courses;
    }

    public static class Serializer implements JsonSerializer<TermOfferings> {
        @Override
        public JsonElement serialize(TermOfferings offerings, Type type, JsonSerializationContext jsonSerializationContext) {
            JsonObject object = new JsonObject();
            CourseOfferings.Serializer courseOfferingsSerializer = new CourseOfferings.Serializer();
            for (CourseID courseID : offerings.courses.keySet()) {
                object.add(courseID.toString(), courseOfferingsSerializer.serialize(offerings.courses.get(courseID), CourseOfferings.class, jsonSerializationContext));
            }
            return object;
        }
    }

    public static class Deserializer implements JsonDeserializer<TermOfferings> {
        @Override
        public TermOfferings deserialize(JsonElement jsonElement, Type type, JsonDeserializationContext jsonDeserializationContext) throws JsonParseException {
            JsonObject object = jsonElement.getAsJsonObject();
            LinkedHashMap<CourseID, CourseOfferings> courses = new LinkedHashMap<>();
            CourseOfferings.Deserializer courseOfferingsDeserializer = new CourseOfferings.Deserializer();
            for (Map.Entry<String, JsonElement> entry : object.entrySet()) {
                CourseID courseID = new CourseID(entry.getKey());
                CourseOfferings course = courseOfferingsDeserializer.deserialize(entry.getValue(), CourseOfferings.class, jsonDeserializationContext);
                courses.put(courseID, course);
            }
            return new TermOfferings(courses);
        }
    }

    public CourseOfferings getCourseOfferings(CourseID id) {
        return courses.get(id);
    }

    public LinkedHashMap<CourseID, CourseOfferings> getCourses() {
        return courses;
    }

    private transient Link link;
    private transient LinkedHashMap<SectionID, CourseOffering> sectionOfferings;
    private transient HashMap<SectionID, CourseID> sectionToCourseIDs;
    @Override
    public void link(Link l) throws OfferingException { // called by Offerings
        link = l;
        sectionOfferings = new LinkedHashMap<>();
        sectionToCourseIDs = new HashMap<>();
        for (Map.Entry<CourseID, CourseOfferings> courseEntry : courses.entrySet()) {
            CourseOfferings courseOfferings = courseEntry.getValue();
            courseOfferings.courseID = courseEntry.getKey();
            courseOfferings.link(l);
            for (CourseOffering offering : courseEntry.getValue().getOfferings()) {
                sectionOfferings.put(offering.getCrn(), offering);
                sectionToCourseIDs.put(offering.getCrn(), courseEntry.getKey());
            }
        }
    }

    public CourseOffering getSectionOffering(SectionID sectionID) throws OfferingException {
        if (sectionOfferings.containsKey(sectionID)) {
            return sectionOfferings.get(sectionID);
        } else {
            throw new OfferingException(String.format("There is no section offering with id '%s' being offered in this term", sectionID.toString()));
        }
    }

    public CourseID getCourseForSection(SectionID sectionID) {
        return sectionToCourseIDs.get(sectionID);
    }
}
