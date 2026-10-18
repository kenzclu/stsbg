import "./HeroCard.css";

type HeroCardProps = {
    name: string,
}

export function HeroCard(props: HeroCardProps) { 
    const { name } = props;

    return (
        <div className="hero-card">
            <div>{name}</div>
        </div>
    )
}