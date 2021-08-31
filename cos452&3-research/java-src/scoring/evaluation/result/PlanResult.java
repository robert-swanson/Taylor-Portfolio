package scoring.evaluation.result;

import scoring.evaluation.Result;
import scoring.evaluation.Value;

public class PlanResult extends Result {
    private Value value;

    public PlanResult(String valueDescription, Value value) {
        super(valueDescription);
    }

    public Value getValue() {
        return value;
    }
}
