import { useState } from "react";
import swordIcon from "../../assets/sword-icon.png";
import poisonIcon from "../../assets/poison-icon.png";
import blockIcon from "../../assets/block-icon.png";
import "./EnemyCard.css";

export type CounterType = "poison" | "block";

const COUNTER_ICONS: Record<CounterType, string> = {
    poison: poisonIcon,
    block: blockIcon,
};

const COUNTER_TYPES = Object.keys(COUNTER_ICONS) as CounterType[];

export type Enemy = {
    name: string,
    currentHp: number,
    maxHp: number,
    counters: Record<CounterType, number>,
}

type EnemyCardProps = {
    enemy: Enemy,
    onAdjustHp: (delta: number) => void,
    onAdjustCounter: (counterType: CounterType, delta: number) => void,
}

export function EnemyCard(props: EnemyCardProps) {
    const { enemy, onAdjustHp, onAdjustCounter } = props;
    const [damageInput, setDamageInput] = useState<string | null>(null);

    const cancelCustomDamage = () => {
        setDamageInput(null);
    };

    const confirmCustomDamage = () => {
        const amount = damageInput === null ? null : parsePositiveInteger(damageInput);
        if (amount === null) {
            return;
        }
        onAdjustHp(-amount);
        setDamageInput(null);
    };

    return (
        <div className="enemy-card">
            <div className="enemy-top">
                <div className="label-strong">{enemy.name}</div>
                <span className="label-strong">{enemy.currentHp}/{enemy.maxHp} HP</span>
            </div>
            <div className="enemy-controls">
                <button
                    className="adjust-hp"
                    onClick={() => onAdjustHp(-1)}
                    disabled={enemy.currentHp <= 0}
                    aria-label={`Decrease ${enemy.name} HP`}
                >
                    −
                </button>
                <button
                    className="custom-damage"
                    onClick={() => setDamageInput("")}
                    disabled={enemy.currentHp <= 0}
                    aria-label={`Deal custom damage to ${enemy.name}`}
                >
                    <img src={swordIcon} alt="" className="damage-icon" />
                </button>
                <button
                    className="adjust-hp"
                    onClick={() => onAdjustHp(1)}
                    disabled={enemy.currentHp >= enemy.maxHp}
                    aria-label={`Increase ${enemy.name} HP`}
                >
                    +
                </button>
                {COUNTER_TYPES.map((counterType) => (
                    <CounterBadge
                        key={counterType}
                        enemyName={enemy.name}
                        counterType={counterType}
                        count={enemy.counters[counterType]}
                        onClick={() => onAdjustCounter(counterType, 1)}
                    />
                ))}
            </div>
            {damageInput !== null && (
                <CustomDamageForm
                    damageInput={damageInput}
                    onDamageInputChange={setDamageInput}
                    onConfirm={confirmCustomDamage}
                    onCancel={cancelCustomDamage}
                />
            )}
        </div>
    )
}

type CounterBadgeProps = {
    enemyName: string,
    counterType: CounterType,
    count: number,
    onClick: () => void,
}

function CounterBadge(props: CounterBadgeProps) {
    const { enemyName, counterType, count, onClick } = props;
    const label = counterType[0].toUpperCase() + counterType.slice(1);

    return (
        <button className="counter-badge" onClick={onClick} aria-label={`Add ${label.toLowerCase()} to ${enemyName}`}>
            <img src={COUNTER_ICONS[counterType]} alt="" className="counter-icon" />
            <span>{count}</span>
        </button>
    )
}

type CustomDamageFormProps = {
    damageInput: string,
    onDamageInputChange: (value: string) => void,
    onConfirm: () => void,
    onCancel: () => void,
}

function CustomDamageForm(props: CustomDamageFormProps) {
    const { damageInput, onDamageInputChange, onConfirm, onCancel } = props;

    return (
        <form
            className="custom-damage-form"
            onSubmit={(e) => {
                e.preventDefault();
                onConfirm();
            }}
        >
            <input
                type="number"
                min="1"
                step="1"
                className="custom-damage-input"
                value={damageInput}
                onChange={(e) => onDamageInputChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        onCancel();
                    }
                }}
                onBlur={onCancel}
                placeholder="Dmg"
                autoFocus
                aria-label="Damage amount"
            />
            <button
                type="submit"
                className="confirm-custom-damage"
                onMouseDown={(e) => e.preventDefault()}
                disabled={parsePositiveInteger(damageInput) === null}
                aria-label="Confirm damage"
            >
                ✓
            </button>
        </form>
    )
}

function parsePositiveInteger(value: string) {
    const n = Number(value);
    return Number.isInteger(n) && n > 0 ? n : null;
}
