import { memo, type FC, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import type { AttributeGroup } from '../../../utils/types';
import { useClickOutside } from '../../../hooks/useClickOutside';

interface ExcludeDropdownProps {
    isOpen: boolean;
    onToggleOpen: () => void;
    activeAttributeGroups: AttributeGroup[];
    excludedAttributes: Set<string>;
    onToggleAttribute: (attributeId: string) => void;
    onClearExclusions: () => void;
}

const ExcludeDropdown: FC<ExcludeDropdownProps> = memo(({
    isOpen,
    onToggleOpen,
    activeAttributeGroups,
    excludedAttributes,
    onToggleAttribute,
    onClearExclusions,
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    useClickOutside(dropdownRef, () => onToggleOpen(), isOpen);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={onToggleOpen}
                className="cursor-pointer flex items-center gap-2 rounded-lg border border-orange-600 bg-orange-600/10 px-4 py-2 text-sm font-semibold text-orange-400 hover:bg-orange-600/20 transition-colors"
            >
                Exclude
                <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-slate-600 bg-slate-800 p-4 shadow-lg z-10">
                    <div className="max-h-96 overflow-y-auto">
                        {activeAttributeGroups.length === 0 ? (
                            <p className="text-sm text-slate-400">No attributes available</p>
                        ) : (
                            <div className="space-y-4">
                                {activeAttributeGroups.map(group => (
                                    <div key={group["group-name"]}>
                                        <p className="text-xs font-bold text-slate-300 mb-2">{group["group-name"]}</p>
                                        <div className="space-y-2">
                                            {group.items?.map(item => (
                                                <label key={item.id} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={excludedAttributes.has(item.id)}
                                                        onChange={() => onToggleAttribute(item.id)}
                                                        className="rounded border-slate-600 bg-slate-700 accent-orange-600"
                                                    />
                                                    <span className="text-sm text-slate-300">{item.id}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {excludedAttributes.size > 0 && (
                        <button
                            type="button"
                            onClick={onClearExclusions}
                            className="cursor-pointer mt-3 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-600 transition-colors"
                        >
                            Clear exclusions ({excludedAttributes.size})
                        </button>
                    )}
                </div>
            )}
        </div>
    );
});

ExcludeDropdown.displayName = 'ExcludeDropdown';

export default ExcludeDropdown;
