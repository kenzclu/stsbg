import "./EnemyCard.css";

export type Enemy = {
    name: string,
    hp: number,
}

type EnemyCardProps = {
    enemy: Enemy,
}

export function EnemyCard(props: EnemyCardProps) {
    const { enemy } = props;

    return (
        <div className="enemy-card">
            <div>{enemy.name}</div>
            <div>{enemy.hp} HP</div>
        </div>
    )
}
