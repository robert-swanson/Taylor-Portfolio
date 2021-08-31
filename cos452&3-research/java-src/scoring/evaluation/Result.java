package scoring.evaluation;

public abstract class Result {
    private final String resultDescription;

    public Result(String resultDescription) {
        this.resultDescription = resultDescription;
    }
}
