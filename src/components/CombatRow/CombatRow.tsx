import { useEffect, useRef, useState } from "react";
import { HeroCard } from "../HeroCard/HeroCard";
import { EnemyRow } from "../EnemyRow/EnemyRow";
import type { CounterType, Enemy } from "../EnemyCard/EnemyCard";

type CombatRowProps = {
    heroName: string,
    endTurnSignal?: number,
}

export function CombatRow(props: CombatRowProps) {
    const { heroName, endTurnSignal = 0 } = props;
    const [enemies, setEnemies] = useState<Enemy[]>([]);

    const updateEnemies = (update: (enemies: Enemy[]) => Enemy[]) => {
        setEnemies(update(enemies));
    };

    const addEnemy = (maxHp: number) => {
        updateEnemies((enemies) => [
            ...enemies,
            { name: `Enemy ${enemies.length + 1}`, currentHp: maxHp, maxHp, counters: { poison: 0, block: 0 } },
        ]);
    };

    const adjustHp = (index: number, delta: number) => {
        updateEnemies((enemies) =>
            enemies.map((enemy, i) =>
                i === index ? { ...enemy, currentHp: clamp(enemy.currentHp + delta, 0, enemy.maxHp) } : enemy,
            ),
        );
    };

    const damageAll = (amount: number) => {
        updateEnemies((enemies) => enemies.map((enemy) => ({ ...enemy, currentHp: applyDamage(enemy, amount) })));
    };

    const adjustCounter = (index: number, counterType: CounterType, delta: number) => {
        updateEnemies((enemies) =>
            enemies.map((enemy, i) =>
                i === index
                    ? {
                          ...enemy,
                          counters: {
                              ...enemy.counters,
                              [counterType]: clamp(enemy.counters[counterType] + delta, 0, Infinity),
                          },
                      }
                    : enemy,
            ),
        );
    };

    const prevEndTurnSignal = useRef(endTurnSignal);

    useEffect(() => {
        if (endTurnSignal === prevEndTurnSignal.current) {
            return;
        }
        prevEndTurnSignal.current = endTurnSignal;
        setEnemies((enemies) =>
            enemies.map((enemy) => ({
                ...enemy,
                currentHp: applyDamage(enemy, enemy.counters.poison),
                counters: { ...enemy.counters, block: 0 },
            })),
        );
    }, [endTurnSignal]);

    return (
        <div className="rows">
            <HeroCard name={heroName} onDamageEnemies={damageAll} />
            <EnemyRow enemies={enemies} onAddEnemy={addEnemy} onAdjustHp={adjustHp} onAdjustCounter={adjustCounter} />
        </div>
    )
}

function applyDamage(enemy: Enemy, amount: number) {
    return clamp(enemy.currentHp - amount, 0, enemy.maxHp);
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}
