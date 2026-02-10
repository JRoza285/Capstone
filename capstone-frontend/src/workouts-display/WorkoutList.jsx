//retreives all workouts from the API

import { Link } from "react-router";

export default function WorkoutList({ workouts }) {
    return (
        <ul>
            {workouts.map((workout) => (
                <WorkoutListItem
                key={workout.id}
                workout={workout}
                />
            ))}
        </ul>
        );
}

function WorkoutListItem({ workout }) {
    return (
        <li className="workout-list-item">
            <div className="workout-info">
                <h3>
                    <Link to={"/workouts/" + workout.id}>
                    {workout.name}
                    </Link>
                </h3>
                <p className="description">{workout.description}</p>
            </div>
            </li>
    );
    }