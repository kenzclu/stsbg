import "./EnemyCard.css";

type EnemyCardProps = {
    label: string,
}

export function EnemyCard(props: EnemyCardProps) {
    const { label } = props;

    return (
        <div className="enemy-card">
            <div>{label}</div>
        </div>
    )
}
