export const EventSelectionControls: React.FC<{
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearAll: () => void;
}> = ({ selectedCount, totalCount, onSelectAll, onClearAll }) => (
  <div className="card bg-base-100 shadow-xl mb-8">
    <div className="card-body">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-secondary font-semibold">
          Selected Events: {selectedCount} / {totalCount}
        </p>
        <div className="flex gap-2">
          <button className="btn btn-primary btn-sm" onClick={onSelectAll}>
            Select All
          </button>
          <button className="btn btn-ghost btn-sm" onClick={onClearAll}>
            Clear All
          </button>
        </div>
      </div>
    </div>
  </div>
);
