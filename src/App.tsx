import { useState } from "react";
import "./App.css";
import { CharacterSelect } from "./components/CharacterSelect";
import { CombatRow } from "./components/CombatRow";

const AVAILABLE_CHARACTERS = ["Ironclad", "Silent", "Defect", "Watcher"];
const MAX_CHARACTERS = 4;

function App() {
  const [characters, setCharacters] = useState<string[]>([]);
  const [resetNonce, setResetNonce] = useState(0);

  const onClick = (character: string) => {
    if (characters.includes(character) || characters.length >= MAX_CHARACTERS) {
      return;
    }
    setCharacters([...characters, character]);
  };

  return (
    <>
      <div className="main-container">
        <div className="controls">
          <CharacterSelect
            availableCharacters={AVAILABLE_CHARACTERS}
            characters={characters}
            maxCharacters={MAX_CHARACTERS}
            onSelect={onClick}
          />
          <button className="reset-enemies" onClick={() => setResetNonce(resetNonce + 1)}>
            Reset
          </button>
        </div>
        {characters.map((name) => (
          <CombatRow key={`${name}-${resetNonce}`} heroName={name} />
        ))}
      </div>
    </>
  );
}

export default App;
