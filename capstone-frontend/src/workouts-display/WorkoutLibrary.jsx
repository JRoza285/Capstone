//displays workouts in a library

import {useEffect, useState } from "react";
import { getWorkouts } from "../api/workouts";
import WorkoutList from "./WorkoutList";

export default function WorkoutLibrary() {
    const [workouts, setWorkouts] = useState([]);
    const [token] = useState(localStorage.getItem("token"));
    const syncWorkouts = async () => {
        const workouts = await getWorkouts(token);
        setWorkouts(workouts);
    };

    useEffect(() => {
        syncWorkouts();
    }, []);

    return (
        <>
        <h1>Workout Library</h1>
        <WorkoutList workouts={workouts} />
        </>
    );
}