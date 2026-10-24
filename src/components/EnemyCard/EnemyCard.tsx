import { useRef, useState } from "react";
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
    const [isEnteringDamage, setIsEnteringDamage] = useState(false);

    return (
        <div className="enemy-card">
            <div className="enemy-top">
                <div className="label-strong">{enemy.name}</div>
                <div className="hp-row">
                    <button
                        className="adjust-hp"
                        onClick={() => onAdjustHp(-1)}
                        disabled={enemy.currentHp <= 0}
                        aria-label={`Decrease ${enemy.name} HP`}
                    >
                        −
                    </button>
                    {!isEnteringDamage ? (
                        <button
                            className="hp-display"
                            onClick={() => setIsEnteringDamage(true)}
                            disabled={enemy.currentHp <= 0}
                            aria-label={`Deal custom damage to ${enemy.name}`}
                        >
                            {enemy.currentHp}/{enemy.maxHp} HP
                        </button>
                    ) : (
                        <AmountForm
                            onSubmit={(amount) => {
                                onAdjustHp(-amount);
                                setIsEnteringDamage(false);
                            }}
                            onCancel={() => setIsEnteringDamage(false)}
                            placeholder="Dmg"
                            inputLabel="Damage amount"
                            confirmLabel="Confirm damage"
                        />
                    )}
                    <button
                        className="adjust-hp"
                        onClick={() => onAdjustHp(1)}
                        disabled={enemy.currentHp >= enemy.maxHp}
                        aria-label={`Increase ${enemy.name} HP`}
                    >
                        +
                    </button>
                </div>
            </div>
            <div className="enemy-counters">
                {COUNTER_TYPES.map((counterType) => (
                    <CounterBadge
                        key={counterType}
                        enemyName={enemy.name}
                        counterType={counterType}
                        count={enemy.counters[counterType]}
                        onAdjust={(delta) => onAdjustCounter(counterType, delta)}
                    />
                ))}
            </div>
        </div>
    )
}

const HOLD_MS = 500;

type CounterBadgeProps = {
    enemyName: string,
    counterType: CounterType,
    count: number,
    onAdjust: (delta: number) => void,
}

function CounterBadge(props: CounterBadgeProps) {
    const { enemyName, counterType, count, onAdjust } = props;
    const [isEnteringAmount, setIsEnteringAmount] = useState(false);
    const holdTimer = useRef<number | undefined>(undefined);
    const didHold = useRef(false);
    const label = counterType[0].toUpperCase() + counterType.slice(1);

    const startHold = () => {
        didHold.current = false;
        holdTimer.current = window.setTimeout(() => {
            didHold.current = true;
            setIsEnteringAmount(true);
        }, HOLD_MS);
    };

    const endHold = () => {
        window.clearTimeout(holdTimer.current);
    };

    const handleClick = () => {
        if (didHold.current) {
            didHold.current = false;
            return;
        }
        onAdjust(1);
    };

    if (isEnteringAmount) {
        return (
            <AmountForm
                onSubmit={(amount) => {
                    onAdjust(amount);
                    setIsEnteringAmount(false);
                }}
                onCancel={() => setIsEnteringAmount(false)}
                placeholder="Amt"
                inputLabel={`${label} amount`}
                confirmLabel={`Confirm ${counterType}`}
            />
        )
    }

    return (
        <button
            className="counter-badge"
            onClick={handleClick}
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={endHold}
            aria-label={`Add ${label.toLowerCase()} to ${enemyName}`}
        >
            <img src={COUNTER_ICONS[counterType]} alt="" className="counter-icon" />
            <span>{count}</span>
        </button>
    )
}

type AmountFormProps = {
    onSubmit: (amount: number) => void,
    onCancel: () => void,
    placeholder: string,
    inputLabel: string,
    confirmLabel: string,
}

function AmountForm(props: AmountFormProps) {
    const { onSubmit, onCancel, placeholder, inputLabel, confirmLabel } = props;
    const [amountInput, setAmountInput] = useState("");
    const amount = parsePositiveInteger(amountInput);

    return (
        <form
            className="custom-damage-form"
            onSubmit={(e) => {
                e.preventDefault();
                if (amount !== null) {
                    onSubmit(amount);
                }
            }}
        >
            <input
                type="number"
                min="1"
                step="1"
                className="custom-damage-input"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        onCancel();
                    }
                }}
                onBlur={onCancel}
                placeholder={placeholder}
                autoFocus
                aria-label={inputLabel}
            />
            <button
                type="submit"
                className="confirm-custom-damage"
                onMouseDown={(e) => e.preventDefault()}
                disabled={amount === null}
                aria-label={confirmLabel}
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
