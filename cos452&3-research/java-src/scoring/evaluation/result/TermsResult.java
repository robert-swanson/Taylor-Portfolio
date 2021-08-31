package scoring.evaluation.result;

import scoring.evaluation.Result;
import scoring.evaluation.Value;

import java.util.ArrayList;

public class TermsResult extends Result {
    private ArrayList<Value> values;

    public TermsResult(String valueDescription) {
        super(valueDescription);
    }

    public ArrayList<Value> getValues() {
        return values;
    }

    public void addValue(Value v) {
        values.add(v);
    }

}
