package scoring.condition;

public interface Condition {
    public boolean evaluate();

    public static class And implements Condition {
        private Condition left;
        private Condition right;

        public And(Condition left, Condition right) {
            this.left = left;
            this.right = right;
        }

        @Override
        public boolean evaluate() {
            return left.evaluate() && right.evaluate();
        }
    }

    public static class Or implements Condition {
        private Condition left;
        private Condition right;

        public Or(Condition left, Condition right) {
            this.left = left;
            this.right = right;
        }

        @Override
        public boolean evaluate() {
            return left.evaluate() || right.evaluate();
        }
    }

    public static class Not implements Condition {
        private Condition condition;

        public Not(Condition condition) {
            this.condition = condition;
        }

        @Override
        public boolean evaluate() {
            return !condition.evaluate();
        }
    }
}
