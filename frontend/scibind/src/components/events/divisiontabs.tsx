export const DivisionTabs: React.FC<{
  divisions: string[];
  activeDivision: string;
  setActiveDivision: (division: string) => void;
}> = ({ divisions, activeDivision, setActiveDivision }) => (
  <div className="tabs tabs-boxed mb-4">
    {divisions.map((division) => (
      <a
        key={division}
        className={`tab ${activeDivision === division ? 'tab-active' : ''}`}
        onClick={() => setActiveDivision(division)}
      >
        Division {division}
      </a>
    ))}
  </div>
);
