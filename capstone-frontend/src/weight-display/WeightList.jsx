//retreives a list of all previous weights

import { Link } from "react-router";

export default function WeightList({ weights }) {
    return (
        <ul>
            {weights.map((weight) => (
                <WeightListItem
                key={weight.id}
                weight={weight}
                />
            ))}
        </ul>
        );
}

function WeightListItem({ weight }) {
    return (
        <li className="weight-list-item">
            <div className="weight-info">
                <h3>
                    <Link to={"/weights/" + weight.id}>
                    {weight.date}
                    </Link>
                </h3>
                <p className="weight">{weight.weight}</p>
            </div>
            </li>
    );
    }