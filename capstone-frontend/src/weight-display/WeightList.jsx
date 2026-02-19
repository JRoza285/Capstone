import { Link } from "react-router";

export default function WeightList({ weights }) {
  if (!weights.length) return <p>No weight entries found.</p>;

  // Sort weights by date descending (most recent first)
  const sortedWeights = [...weights].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="weight-grid">
      {sortedWeights.map((weight, index) => (
        <WeightCard
          key={weight.id}
          weight={weight}
          index={index}
          weights={sortedWeights}
        />
      ))}
    </div>
  );
}

function WeightCard({ weight, index, weights }) {
  // Get previous weight for change calculation
  const prevWeight = index < weights.length - 1 ? weights[index + 1].weight : null;
  const change =
    prevWeight !== null ? (weight.weight - prevWeight).toFixed(1) : null;

  return (
    <Link
      to={`/weights/${weight.id}`}
      className="weight-card-link"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="weight-card">
        <h3>
          {new Date(weight.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <p>
          <strong>Weight:</strong> {weight.weight} lbs
        </p>
        {change !== null && (
          <p
            className={`weight-change ${change > 0 ? "weight-up" : "weight-down"}`}
          >
            {change > 0 ? "▲" : "▼"} {Math.abs(change)} lbs since last
          </p>
        )}
        {weight.notes && <p className="weight-notes">{weight.notes}</p>}
      </div>
    </Link>
  );
}
