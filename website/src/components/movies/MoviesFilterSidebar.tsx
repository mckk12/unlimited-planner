import { useState, memo } from "react";
import type { AttributeGroup } from "../../utils/types";

interface MoviesFilterSidebarProps {
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    activeAttributeGroups: AttributeGroup[];
    selectedAttributes: Set<string>;
    onToggleAttribute: (attr: string) => void;
}

const MoviesFilterSidebar = memo(function MoviesFilterSidebar({
    searchQuery,
    onSearchChange,
    activeAttributeGroups,
    selectedAttributes,
    onToggleAttribute
}: MoviesFilterSidebarProps) {
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

    return (
        <aside className="w-full md:w-64 shrink-0">
            <div className="md:fixed bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 md:w-64">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={onSearchChange}
                        className="w-full px-3 py-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                </div>

                <div className="flex justify-between items-center mb-4 md:mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Filters</h2>
                    <button 
                        className="md:hidden text-sm font-medium px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    >
                        {isFiltersOpen ? "Hide" : "Show"}
                    </button>
                </div>
                
                <div className={`${isFiltersOpen ? 'block' : 'hidden'} md:block transition-all`}>
                    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    {activeAttributeGroups.map(group => (
                        <div key={group["group-name"]}>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 truncate" title={group["group-name"]}>
                                {group["group-name"]}
                            </h3>
                            <div className="space-y-1.5 ml-1">
                                {group.items.map(item => (
                                    <label key={item.id} className="flex items-center space-x-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedAttributes.has(item.id)}
                                            onChange={() => onToggleAttribute(item.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {item.id}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    {activeAttributeGroups.length === 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            No filters available for current movies.
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </aside>
    );
});

export default MoviesFilterSidebar;
