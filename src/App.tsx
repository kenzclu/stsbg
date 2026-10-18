import { useState } from "react";
import "./App.css";
import { CharacterSelect } from "./components/CharacterSelect";
import { CombatRow } from "./components/CombatRow";

const AVAILABLE_CHARACTERS = ["Ironclad", "Silent", "Defect", "Watcher"];
const MAX_CHARACTERS = 4;

function App() {
  const [characters, setCharacters] = useState<string[]>([]);

  const onClick = (character: string) => {
    if (characters.includes(character) || characters.length >= MAX_CHARACTERS) {
      return;
    }
    setCharacters([...characters, character]);
  };

  return (
    <>
      <div className="main-container">
        <CharacterSelect
          availableCharacters={AVAILABLE_CHARACTERS}
          characters={characters}
          maxCharacters={MAX_CHARACTERS}
          onSelect={onClick}
        />
        {characters.map((name) => (
          <CombatRow key={name} heroName={name} />
        ))}
      </div>
    </>
  );
}

export default App;
