import { memo, type FC } from 'react';

interface ActiveFiltersProps {
    selectedAttributes: Set<string>;
    excludedAttributes: Set<string>;
    onToggleAttribute: (attributeId: string) => void;
    onToggleExcludedAttribute: (attributeId: string) => void;
}

const ActiveFilters: FC<ActiveFiltersProps> = memo(({
    selectedAttributes,
    excludedAttributes,
    onToggleAttribute,
    onToggleExcludedAttribute,
}) => {
    if (selectedAttributes.size === 0 && excludedAttributes.size === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {Array.from(selectedAttributes).map(attrId => (
                <button
                    key={attrId}
                    onClick={() => onToggleAttribute(attrId)}
                    className="cursor-pointer flex items-center gap-2 rounded-md bg-cyan-600/20 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-600/40 hover:bg-cyan-600/30 transition-colors"
                >
                    {attrId}
                    <span className="text-cyan-300">×</span>
                </button>
            ))}
            {Array.from(excludedAttributes).map(attrId => (
                <button
                    key={attrId}
                    onClick={() => onToggleExcludedAttribute(attrId)}
                    className="cursor-pointer flex items-center gap-2 rounded-md bg-orange-600/20 px-3 py-1 text-xs font-semibold text-orange-400 border border-orange-600/40 hover:bg-orange-600/30 transition-colors"
                >
                    not {attrId}
                    <span className="text-orange-300">×</span>
                </button>
            ))}
        </div>
    );
});

ActiveFilters.displayName = 'ActiveFilters';

export default ActiveFilters;
