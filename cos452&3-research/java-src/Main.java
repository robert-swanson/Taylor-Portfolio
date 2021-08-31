import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import exceptions.JSONParseException;
import gnu.getopt.Getopt;
import gnu.getopt.LongOpt;
import objects.Link;
import objects.misc.*;
import objects.catalog.Catalog;
import objects.offerings.Offerings;
import objects.plan.Plan;
import objects.plan.PlanTerm;
import objects.plan.PlansList;
import scoring.context.Context;
import scoring.context.fullPlan.FullPlanContext;
import scoring.context.terms.TermContext;
import scoring.evaluation.ContextEvaluator;
import scoring.evaluation.TotalCreditsEvaluator;
import scoring.evaluation.Result;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {

    static Catalog catalog;
    static Offerings offerings;
    static PlansList plansList;

    public static void main(String[] args) throws IOException {
        String catalogPath = "", offeringsPath = "", planPath = "";
        LongOpt catalogOpt = new LongOpt("catalog", LongOpt.REQUIRED_ARGUMENT, null, 'c');
        LongOpt offeringsOpt = new LongOpt("offerings", LongOpt.REQUIRED_ARGUMENT, null, 'o');
        LongOpt planOpt = new LongOpt("plan", LongOpt.REQUIRED_ARGUMENT, null, 'p');
        LongOpt[] longOpts = new LongOpt[]{catalogOpt, offeringsOpt, planOpt};

        Getopt g = new Getopt("main", args, "", longOpts);
        while (g.getopt() != -1) {
            switch (g.getLongind()) {
                case 0 -> catalogPath = g.getOptarg();
                case 1 -> offeringsPath = g.getOptarg();
                case 2 -> planPath = g.getOptarg();
                default -> System.out.printf("Unrecognized option: '%s'\n", g.getOptopt());
            }
        }

        try {
            parseFiles(catalogPath, offeringsPath, planPath); // Read JSON files and create objects
            Link.linkObjects(catalog, offerings, plansList); // Link objects and populate maps

            Context planContext = new FullPlanContext(plansList.getPlan(0));
            Context termsContext = new TermContext(plansList.getPlan(0).getTermsMap());

            ContextEvaluator evaluator = new TotalCreditsEvaluator();

            Result fullPlanVal = evaluator.getValue(planContext);
            Result termsVal = evaluator.getValue(termsContext);

            System.out.println(fullPlanVal);
            System.out.println(termsVal);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private static void parseFiles(String catalogPath, String offeringsPath, String planPath) throws JSONParseException {
        GsonBuilder gb = new GsonBuilder();
        registerTypeAdapters(gb);
        Gson gson = gb.setPrettyPrinting().create();

        try {
            String catalogString = Files.readString(Path.of(catalogPath));
            catalog = gson.fromJson(catalogString, Catalog.class);
        } catch (Exception e) {
            throw new JSONParseException(String.format("Parsing catalog file '%s': %s", catalogPath, e.getMessage()));
        }

        try {
            String offeringsString = Files.readString(Path.of(offeringsPath)) ;
            offerings = gson.fromJson(offeringsString, Offerings.class);
        } catch (Exception e) {
            throw new JSONParseException(String.format("Parsing offerings file '%s': %s", offeringsPath, e.getMessage()));
        }

        try {
            String plansString = Files.readString(Path.of(planPath));
            plansList = gson.fromJson(plansString, PlansList.class);
        } catch (Exception e) {
            throw new JSONParseException(String.format("Parsing plans list file '%s': %s", planPath, e.getMessage()));
        }
    }

    private static void registerTypeAdapters(GsonBuilder gb) {
        // Misc
        gb.registerTypeAdapter(CourseID.class, new CourseID.Serializer());
        gb.registerTypeAdapter(CourseID.class, new CourseID.Deserializer());

        // Catalog
        gb.registerTypeAdapter(CatalogYear.class, new CatalogYear.Serializer());
        gb.registerTypeAdapter(CatalogYear.class, new CatalogYear.Deserializer());

        // Offerings
        gb.registerTypeAdapter(Offerings.class, new Offerings.Serializer());
        gb.registerTypeAdapter(Offerings.class, new Offerings.Deserializer());

        gb.registerTypeAdapter(SectionID.class, new SectionID.Serializer());
        gb.registerTypeAdapter(SectionID.class, new SectionID.Deserializer());

        gb.registerTypeAdapter(Time.class, new Time.Serializer());
        gb.registerTypeAdapter(Time.class, new Time.Deserializer());

        gb.registerTypeAdapter(Date.class, new Date.Serializer());
        gb.registerTypeAdapter(Date.class, new Date.Deserializer());

        // Plans
        gb.registerTypeAdapter(Plan.class, new Plan.Serializer());
        gb.registerTypeAdapter(Plan.class, new Plan.Deserializer());

        gb.registerTypeAdapter(PlanTerm.class, new PlanTerm.Serializer());
        gb.registerTypeAdapter(PlanTerm.class, new PlanTerm.Deserializer());
    }

}
