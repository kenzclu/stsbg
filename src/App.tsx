import { useState } from "react";
import "./App.css";
import { CharacterSelect } from "./components/CharacterSelect/CharacterSelect";
import { CombatRow } from "./components/CombatRow/CombatRow";
import { DraggableRow } from "./components/DraggableRow/DraggableRow";

const AVAILABLE_CHARACTERS = ["Ironclad", "Silent", "Defect", "Watcher"];
const MAX_CHARACTERS = 4;

function App() {
  const [characters, setCharacters] = useState<string[]>([]);
  const [resetNonce, setResetNonce] = useState(0);
  const [endTurnSignal, setEndTurnSignal] = useState(0);
  const isEmpty = characters.length === 0;

  const onClick = (character: string) => {
    if (characters.includes(character) || characters.length >= MAX_CHARACTERS) {
      return;
    }
    setCharacters([...characters, character]);
  };

  const moveCharacter = (from: number, to: number) => {
    if (from === to) {
      return;
    }
    const reordered = [...characters];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    setCharacters(reordered);
  };

  return (
    <>
      <div className="main-container">
        <div className={isEmpty ? "controls empty" : "controls"}>
          <CharacterSelect
            availableCharacters={AVAILABLE_CHARACTERS}
            characters={characters}
            maxCharacters={MAX_CHARACTERS}
            onSelect={onClick}
          />
          {!isEmpty && (
            <>
              <button className="reset-enemies" onClick={() => setResetNonce(resetNonce + 1)}>
                Reset
              </button>
              <button className="end-turn" onClick={() => setEndTurnSignal(endTurnSignal + 1)}>
                End Turn
              </button>
            </>
          )}
        </div>
        {characters.map((name, index) => (
          <DraggableRow key={`${name}-${resetNonce}`} index={index} onMove={moveCharacter}>
            <CombatRow heroName={name} endTurnSignal={endTurnSignal} />
          </DraggableRow>
        ))}
      </div>
    </>
  );
}

export default App;
