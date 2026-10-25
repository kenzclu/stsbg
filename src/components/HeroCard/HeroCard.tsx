import { useRef, useState } from "react";
import swordIcon from "../../assets/sword-icon.png";
import "./HeroCard.css";

const HOLD_MS = 500;

type HeroCardProps = {
    name: string,
    onDamageEnemies: (amount: number) => void,
}

export function HeroCard(props: HeroCardProps) {
    const { name, onDamageEnemies } = props;
    const [amountInput, setAmountInput] = useState<string | null>(null);

    const holdTimer = useRef<number | undefined>(undefined);
    const holdFired = useRef(false);

    const startHold = () => {
        holdFired.current = false;
        holdTimer.current = window.setTimeout(() => {
            holdFired.current = true;
            setAmountInput("");
        }, HOLD_MS);
    };

    const cancelHold = () => {
        window.clearTimeout(holdTimer.current);
    };

    const handleClick = () => {
        if (holdFired.current) {
            holdFired.current = false;
            return;
        }
        onDamageEnemies(1);
    };

    const cancelCustomAmount = () => {
        setAmountInput(null);
    };

    const confirmCustomAmount = () => {
        const amount = amountInput === null ? null : parseNonZeroInteger(amountInput);
        if (amount === null) {
            return;
        }
        onDamageEnemies(amount);
        setAmountInput(null);
    };

    return (
        <div className="hero-card" draggable>
            <div className="label-strong">{name}</div>
            <div className="damage-enemies">
                {amountInput !== null ? (
                    <DamageAmountForm
                        amountInput={amountInput}
                        onAmountInputChange={setAmountInput}
                        onConfirm={confirmCustomAmount}
                        onCancel={cancelCustomAmount}
                    />
                ) : (
                    <button
                        className="damage-enemies-button"
                        onClick={handleClick}
                        onPointerDown={startHold}
                        onPointerUp={cancelHold}
                        onPointerLeave={cancelHold}
                        onPointerCancel={cancelHold}
                        onContextMenu={(e) => e.preventDefault()}
                        aria-label="Deal damage to all enemies in row, hold for custom amount"
                    >
                        <img src={swordIcon} alt="" className="damage-icon" />
                    </button>
                )}
            </div>
        </div>
    )
}

type DamageAmountFormProps = {
    amountInput: string,
    onAmountInputChange: (value: string) => void,
    onConfirm: () => void,
    onCancel: () => void,
}

function DamageAmountForm(props: DamageAmountFormProps) {
    const { amountInput, onAmountInputChange, onConfirm, onCancel } = props;

    return (
        <form
            className="damage-amount-form"
            onSubmit={(e) => {
                e.preventDefault();
                onConfirm();
            }}
        >
            <input
                type="number"
                step="1"
                className="damage-amount-input"
                value={amountInput}
                onChange={(e) => onAmountInputChange(e.target.value)}
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
                className="confirm-damage-amount"
                onMouseDown={(e) => e.preventDefault()}
                disabled={parseNonZeroInteger(amountInput) === null}
                aria-label="Confirm damage"
            >
                ✓
            </button>
        </form>
    )
}

function parseNonZeroInteger(value: string) {
    const n = Number(value);
    return Number.isInteger(n) && n !== 0 ? n : null;
}
