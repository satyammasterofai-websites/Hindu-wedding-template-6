const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Add isExiting to props
content = content.replace(
  `interface AdminPanelProps {
  settings: ECardSettings;
  setSettings: (settings: ECardSettings | ((prev: ECardSettings) => ECardSettings)) => void;
  onExit: () => void;
}`,
  `interface AdminPanelProps {
  settings: ECardSettings;
  setSettings: (settings: ECardSettings | ((prev: ECardSettings) => ECardSettings)) => void;
  onExit: () => void;
  isExiting?: boolean;
}`
);

content = content.replace(
  `export function AdminPanel({ settings, setSettings, onExit }: AdminPanelProps) {`,
  `export function AdminPanel({ settings, setSettings, onExit, isExiting }: AdminPanelProps) {`
);

content = content.replace(
  `          <button
            onClick={onExit}
            className="text-sm px-4 py-1.5 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors shadow-sm font-medium"
          >
            Save & Exit
          </button>`,
  `          <button
            onClick={onExit}
            disabled={isExiting}
            className="text-sm px-4 py-1.5 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-colors shadow-sm font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isExiting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save & Exit'
            )}
          </button>`
);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
