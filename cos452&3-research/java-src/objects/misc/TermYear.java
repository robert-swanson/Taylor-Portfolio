package objects.misc;

import com.google.gson.JsonParseException;
import exceptions.JSONParseException;

import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TermYear {
    Term term;
    CatalogYear catalogYear;

    public TermYear(Term term, CatalogYear catalogYear) {
        this.term = term;
        this.catalogYear = catalogYear;
    }

    public TermYear(String termYear) throws JSONParseException {
        Matcher termYearMatcher = Pattern.compile("(\\w+) (\\d{4})").matcher(termYear);
        if (!termYearMatcher.matches()) throw new JsonParseException(String.format("TermYear '%s' does not follow format '{semester} yyyy'", termYear));
        term = Term.parseTerm(termYearMatcher.group(1));
        catalogYear = new CatalogYear(term, termYearMatcher.group(2));
    }

    public static enum Term {
        spring, fall, summer, winter, jterm;

        public static Term parseTerm(String term) throws JSONParseException {
            return switch (term) {
                case "spring" -> Term.spring;
                case "fall" -> Term.fall;
                case "summer" -> Term.summer;
                case "winter" -> Term.winter;
                case "jterm" -> Term.jterm;
                default -> throw new JSONParseException(String.format("Unknown term '%d'", term));
            };
        }
    }

    @Override
    public String toString() {
        return String.format("%s %d", term.toString(), catalogYear.termYear(term));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TermYear termYear = (TermYear) o;
        return term == termYear.term && Objects.equals(catalogYear, termYear.catalogYear);
    }

    @Override
    public int hashCode() {
        return Objects.hash(term, catalogYear);
    }
}
