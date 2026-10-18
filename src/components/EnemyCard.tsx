import { useState } from "react";
import "./EnemyCard.css";

export type Enemy = {
    name: string,
    currentHp: number,
    maxHp: number,
}

type EnemyCardProps = {
    enemy: Enemy,
    onAdjustHp: (delta: number) => void,
}

export function EnemyCard(props: EnemyCardProps) {
    const { enemy, onAdjustHp } = props;
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
            <div>{enemy.name}</div>
            <div className="enemy-hp">
                <button
                    className="adjust-hp"
                    onClick={() => onAdjustHp(-1)}
                    disabled={enemy.currentHp <= 0}
                    aria-label={`Decrease ${enemy.name} HP`}
                >
                    −
                </button>
                <span>{enemy.currentHp}/{enemy.maxHp} HP</span>
                <button
                    className="adjust-hp"
                    onClick={() => onAdjustHp(1)}
                    disabled={enemy.currentHp >= enemy.maxHp}
                    aria-label={`Increase ${enemy.name} HP`}
                >
                    +
                </button>
            </div>
            {damageInput !== null ? (
                <CustomDamageForm
                    damageInput={damageInput}
                    onDamageInputChange={setDamageInput}
                    onConfirm={confirmCustomDamage}
                    onCancel={cancelCustomDamage}
                />
            ) : (
                <button
                    className="custom-damage"
                    onClick={() => setDamageInput("")}
                    disabled={enemy.currentHp <= 0}
                    aria-label={`Deal custom damage to ${enemy.name}`}
                >
                    Custom
                </button>
            )}
        </div>
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
