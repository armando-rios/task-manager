interface Props {
  view: "list" | "kanban";
  onViewChange: (view: "list" | "kanban") => void;
}

export function ViewToggle({ view, onViewChange }: Props) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-theme-surface-2 bg-theme-surface-1/50">
      <button
        onClick={() => onViewChange("kanban")}
        className={`px-4 py-2.5 transition-all duration-200 flex items-center gap-2 ${
          view === "kanban"
            ? "bg-theme-primary/20 text-theme-primary glow-border"
            : "text-theme-subtext hover:text-theme-text hover:bg-theme-surface-2/50"
        }`}
        aria-label="Kanban view"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <rect x="3" y="3" width="7" height="18" rx="1" />
          <rect x="14" y="3" width="7" height="12" rx="1" />
        </svg>
        <span className="hidden sm:inline text-sm font-medium">Kanban</span>
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`px-4 py-2.5 transition-all duration-200 flex items-center gap-2 ${
          view === "list"
            ? "bg-theme-primary/20 text-theme-primary glow-border"
            : "text-theme-subtext hover:text-theme-text hover:bg-theme-surface-2/50"
        }`}
        aria-label="List view"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="hidden sm:inline text-sm font-medium">List</span>
      </button>
    </div>
  );
}
