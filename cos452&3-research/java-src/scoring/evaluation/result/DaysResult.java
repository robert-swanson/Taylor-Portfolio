package scoring.evaluation.result;

import scoring.evaluation.Result;
import scoring.evaluation.Value;

import java.util.ArrayList;

public class DaysResult extends Result {
    private ArrayList<ArrayList<ArrayList<Value>>> values;
    private ArrayList<ArrayList<Value>> weekWeights;

    public DaysResult(String valueDescription) {
        super(valueDescription);
        values = new ArrayList<>();
    }

    public void addTermValue(ArrayList<ArrayList<Value>> termValue, ArrayList<Value> weekWeights) {
        this.values.add(termValue);
        this.weekWeights.add(weekWeights);
    }
}
