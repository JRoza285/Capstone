//retreives a lift of lifts from the api

import { Link } from "react-router";

export default function LiftList({ lifts }) {
    return (
        <ul>
            {lifts.map((lift) => (
                <LiftListItem
                key={lift.id}
                lift={lift}
                />
            ))}
        </ul>
        );
}

function LiftListItem({ lift }) {
    return (
        <li className="lift-list-item">
            <div className="Lift-info">
                <h3>
                    <Link to={"/lifts/" + lift.id}>
                    {lift.name}
                    </Link>
                </h3>
                <p className="target_muscle">{lift.target_muscle}</p>
            </div>
            </li>
    );
    }