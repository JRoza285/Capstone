//displays all weights in a list

import { useEffect, useState } from "react";
import { getWeight } from "../api/weight";
import WeightList from "./WeightList";
import { useAuth } from "../auth/AuthContext";


export default function WeightLibrary() {
    const [weights, setWeights] = useState([]);
    const { token } = useAuth();


    const syncWeights = async () => {
        const weights = await getWeight(token);
        setWeights(weights);
    };

    useEffect(() => {
        syncWeights();
    }, []);

    return (
        <>
            <h1>Weight Library</h1>
            <WeightList weights={weights} />
        </>
    );
}

