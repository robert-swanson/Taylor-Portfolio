package scoring.evaluation;

import scoring.context.Context;

public interface ContextEvaluator {
    public Result getValue(Context context);
}
