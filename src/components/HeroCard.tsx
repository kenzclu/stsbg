import { useState } from "react";
import "./HeroCard.css";

type HeroCardProps = {
    name: string,
    onDamageEnemies: (amount: number) => void,
}

export function HeroCard(props: HeroCardProps) {
    const { name, onDamageEnemies } = props;
    const [amountInput, setAmountInput] = useState<string | null>(null);

    const cancelCustomAmount = () => {
        setAmountInput(null);
    };

    const confirmCustomAmount = () => {
        const amount = amountInput === null ? null : parsePositiveInteger(amountInput);
        if (amount === null) {
            return;
        }
        onDamageEnemies(amount);
        setAmountInput(null);
    };

    return (
        <div className="hero-card">
            <div>{name}</div>
            <div className="damage-enemies">
                <button
                    className="damage-enemies-one"
                    onClick={() => onDamageEnemies(1)}
                    aria-label="Deal 1 damage to all enemies in row"
                >
                    −1 Row
                </button>
                {amountInput !== null ? (
                    <DamageAmountForm
                        amountInput={amountInput}
                        onAmountInputChange={setAmountInput}
                        onConfirm={confirmCustomAmount}
                        onCancel={cancelCustomAmount}
                    />
                ) : (
                    <button
                        className="damage-enemies-custom"
                        onClick={() => setAmountInput("")}
                        aria-label="Deal custom damage to all enemies in row"
                    >
                        Custom
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
                min="1"
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
                disabled={parsePositiveInteger(amountInput) === null}
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
