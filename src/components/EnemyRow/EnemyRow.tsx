import { useState } from "react";
import "./EnemyRow.css";
import { EnemyCard, type Enemy } from "../EnemyCard/EnemyCard";

type EnemyRowProps = {
    enemies: Enemy[],
    onAddEnemy: (maxHp: number) => void,
    onAdjustHp: (index: number, delta: number) => void,
}

export function EnemyRow(props: EnemyRowProps) {
    const { enemies, onAddEnemy, onAdjustHp } = props;
    const [hpInput, setHpInput] = useState<string | null>(null);

    const cancelAdding = () => {
        setHpInput(null);
    };

    const confirmAdding = () => {
        const hp = hpInput === null ? null : parsePositiveInteger(hpInput);
        if (hp === null) {
            return;
        }
        onAddEnemy(hp);
        setHpInput(null);
    };

    return (
        <div className="enemy-row">
            {enemies.map((enemy, i) => (
                <EnemyCard key={i} enemy={enemy} onAdjustHp={(delta) => onAdjustHp(i, delta)} />
            ))}
            {hpInput !== null ? (
                <AddEnemyForm
                    hpInput={hpInput}
                    onHpInputChange={setHpInput}
                    onConfirm={confirmAdding}
                    onCancel={cancelAdding}
                />
            ) : (
                <button className="add-enemy" onClick={() => setHpInput("")} aria-label="Add enemy">
                    +
                </button>
            )}
        </div>
    )
}

type AddEnemyFormProps = {
    hpInput: string,
    onHpInputChange: (value: string) => void,
    onConfirm: () => void,
    onCancel: () => void,
}

function AddEnemyForm(props: AddEnemyFormProps) {
    const { hpInput, onHpInputChange, onConfirm, onCancel } = props;

    return (
        <form
            className="add-enemy-form"
            onSubmit={(e) => {
                e.preventDefault();
                onConfirm();
            }}
        >
            <input
                type="number"
                min="1"
                step="1"
                className="add-enemy-input"
                value={hpInput}
                onChange={(e) => onHpInputChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        onCancel();
                    }
                }}
                onBlur={onCancel}
                placeholder="HP"
                autoFocus
                aria-label="Enemy HP"
            />
            <button
                type="submit"
                className="confirm-add-enemy"
                onMouseDown={(e) => e.preventDefault()}
                disabled={parsePositiveInteger(hpInput) === null}
                aria-label="Confirm add enemy"
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
