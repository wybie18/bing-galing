import { useState, useEffect, useRef } from 'react';

const SearchableSelect = ({ options, value, onChange, placeholder = "Select an option", valueKey = "value", labelKey = "label", className = "" }) => {
const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const selectRef = useRef(null);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current.focus(), 100);
        }
    }, [isOpen]);

    const handleSelect = (option) => {
        onChange(option[valueKey]);
        setIsOpen(false);
        setSearchTerm("");
    };

    const selectedOption = options.find(option => option[valueKey] === value);

    const filteredOptions = options.filter(option =>
        option[labelKey]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={`relative w-full max-w-md font-sans ${className}`} ref={selectRef}>
            {/* --- Select Button --- */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
                <span className={`truncate ${selectedOption ? 'text-gray-800' : 'text-gray-400'}`}>
                    {selectedOption ? selectedOption[labelKey] : placeholder}
                </span>
                <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isOpen ? '-rotate-180' : 'rotate-0'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {/* --- Dropdown Panel --- */}
            {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl animate-fade-in-down">
                    {/* --- Search Input --- */}
                    <div className="p-2">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* --- Options List --- */}
                    <ul className="py-1 overflow-y-auto max-h-60">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option[valueKey]}
                                    onClick={() => handleSelect(option)}
                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 ${value === option[valueKey] ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-700'}`}
                                >
                                    {option[labelKey]}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-sm text-gray-500">
                                No options found
                            </li>
                        )}
                    </ul>
                </div>
            )}
            <style>{`
              @keyframes fade-in-down {
                0% {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                100% {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-fade-in-down {
                animation: fade-in-down 0.2s ease-out;
              }
            `}</style>
        </div>
    );
};

export default SearchableSelect;