package scoring;

import scoring.context.Context;
import scoring.evaluation.Result;
import scoring.evaluation.ContextEvaluator;

import java.util.HashMap;

public class ValueStore {
    private static class KnownValuesKey {
        Context context;
        ContextEvaluator contextEvaluator;

        public KnownValuesKey(Context context, ContextEvaluator contextEvaluator) {
            this.context = context;
            this.contextEvaluator = contextEvaluator;
        }
    }

    private HashMap<KnownValuesKey, Result> knownValues;

    public Result getValue(ContextEvaluator contextEvaluator, Context context) {
        KnownValuesKey key = new KnownValuesKey(context, contextEvaluator);
        if (knownValues.containsKey(key)) {
            return knownValues.get(key);
        } else {
            Result result = contextEvaluator.getValue(context);
            knownValues.put(key, result);
            return result;
        }
    }

    public void putValue(KnownValuesKey key, Result result) {
        knownValues.put(key, result);
    }
}
