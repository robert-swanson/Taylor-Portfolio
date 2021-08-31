package scoring.context;

import objects.misc.TermYear;
import objects.plan.Plan;
import objects.plan.PlanTerm;
import scoring.condition.Condition;
import scoring.context.subcontext.SubContext;
import scoring.context.subcontext.TermSubContext;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Stack;

public class Context {
    enum ContextLevel { fullPlan, terms, days }

    private ContextLevel contextLevel = ContextLevel.fullPlan;
    private Stack<LinkedHashMap<TermYear, TermSubContext>> termSubContexts;

    public Context(Plan plan) {
        termSubContexts = new Stack<>();
        LinkedHashMap<TermYear, TermSubContext> termSubContextLinkedHashMap = new LinkedHashMap<>();
        for (Map.Entry<TermYear, PlanTerm> entry : plan.getTermsMap().entrySet()) {
            termSubContextLinkedHashMap.put(entry.getKey(), new TermSubContext(entry.getValue()));
        }
        termSubContexts.push(termSubContextLinkedHashMap);
    }

    public ContextLevel getContextLevel() {
        return contextLevel;
    }

    public LinkedHashMap<TermYear, TermSubContext> getTermSubContexts() {
        return termSubContexts.peek();
    }

    public void applyContextFilter(Condition condition, ContextLevel contextLevel) {
        // TODO Context Filters
    }

    public void unapplyContextFilter() {
        termSubContexts.pop();
    }
}

