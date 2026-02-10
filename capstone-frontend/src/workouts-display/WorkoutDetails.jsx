// displays indivual details of each workout

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { getWorkoutById, updateWorkout, deleteWorkout } from "../api/workouts-api";

export default function WorkoutDetails() {
  const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [workout, setWorkout] = useState(null);
    const [setSuccess] = useState(false);

    useEffect(() => {
        const syncWorkouts = async () => {
            const workout = await getWorkoutById(id, token);
            setWorkout(workout);
        }
        syncWorkouts();
    }, [id, token]);

    const handleUpdateWorkout = async (workoutData) => {
        try {
            const updatedWorkout = await updateWorkout(id, workoutData, token);
            setWorkout(updatedWorkout);
            setSuccess(true);
        } catch (err) {
            console.error("Failed to update workout", err);
        }
    };

    const handleDeleteWorkout = async () => {
        try {
            await deleteWorkout(id, token); 
            navigate("/workouts"); // Redirect to workout library after deletion
        } catch (err) {
            console.error("Failed to delete workout", err);
        }
    };

    if (!workout) return <p>Workout not found.</p>;

    return (
        <>
        <h1>{workout.name}</h1>
        <p>{workout.description}</p>
        <button onClick={() => handleUpdateWorkout(workout)}>Update This Workout</button>
        <button onClick={handleDeleteWorkout}>Delete This Workout</button>
        </>
    );
}