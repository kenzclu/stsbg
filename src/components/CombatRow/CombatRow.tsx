import { useState } from "react";
import { HeroCard } from "../HeroCard/HeroCard";
import { EnemyRow } from "../EnemyRow/EnemyRow";
import type { Enemy } from "../EnemyCard/EnemyCard";

type CombatRowProps = {
    heroName: string,
}

export function CombatRow(props: CombatRowProps) {
    const { heroName } = props;
    const [enemies, setEnemies] = useState<Enemy[]>([]);

    const updateEnemies = (update: (enemies: Enemy[]) => Enemy[]) => {
        setEnemies(update(enemies));
    };

    const addEnemy = (maxHp: number) => {
        updateEnemies((enemies) => [...enemies, { name: `Enemy ${enemies.length + 1}`, currentHp: maxHp, maxHp }]);
    };

    const adjustHp = (index: number, delta: number) => {
        updateEnemies((enemies) =>
            enemies.map((enemy, i) =>
                i === index ? { ...enemy, currentHp: clamp(enemy.currentHp + delta, 0, enemy.maxHp) } : enemy,
            ),
        );
    };

    const damageAll = (amount: number) => {
        updateEnemies((enemies) =>
            enemies.map((enemy) => ({ ...enemy, currentHp: clamp(enemy.currentHp - amount, 0, enemy.maxHp) })),
        );
    };

    return (
        <div className="rows">
            <HeroCard name={heroName} onDamageEnemies={damageAll} />
            <EnemyRow enemies={enemies} onAddEnemy={addEnemy} onAdjustHp={adjustHp} />
        </div>
    )
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}
