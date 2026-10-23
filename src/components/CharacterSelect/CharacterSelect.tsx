type CharacterSelectProps = {
  availableCharacters: string[];
  characters: string[];
  maxCharacters: number;
  onSelect: (character: string) => void;
};

export function CharacterSelect(props: CharacterSelectProps) {
  const { availableCharacters, characters, maxCharacters, onSelect } = props;

  return (
    <select
      className="character-select"
      value=""
      disabled={characters.length >= maxCharacters}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="" disabled>
        Add character
      </option>
      {availableCharacters
        .filter((c) => !characters.includes(c))
        .map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
    </select>
  );
}
