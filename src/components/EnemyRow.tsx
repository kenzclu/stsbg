import { useState } from "react";
import "./EnemyRow.css";
import { EnemyCard } from "./EnemyCard";

export function EnemyRow() {
    const [enemyCount, setEnemyCount] = useState(0);

    const addEnemy = () => {
        setEnemyCount(enemyCount + 1);
    };

    return (
        <div className="enemy-row">
            {Array.from({ length: enemyCount }, (_, i) => (
                <EnemyCard key={i} label={`Enemy ${i + 1}`} />
            ))}
            <button className="add-enemy" onClick={addEnemy} aria-label="Add enemy">
                +
            </button>
        </div>
    )
}
