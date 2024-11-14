import React, { useState, useRef, useEffect } from "react";

interface Option {
  id: number | string;
  label: string;
}

interface AccessibleDropdownProps<T extends Option> {
  label?: string;
  options: T[];
  onSelect?: (option: T) => void;
  defaultValue?: T;
  className?: string;
}

function AccessibleDropdown<T extends Option>({
  label = "Select an option",
  options = [],
  onSelect,
  defaultValue,
  className = "",
}: AccessibleDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<T | null>(
    defaultValue || null
  );
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>
  ): void => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(0);
        } else {
          setActiveIndex((prev) => (prev + 1) % options.length);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(options.length - 1);
        } else {
          setActiveIndex(
            (prev) => (prev - 1 + options.length) % options.length
          );
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (isOpen && activeIndex >= 0) {
          const selectedOption = options[activeIndex];
          handleSelect(selectedOption);
        } else {
          setIsOpen(true);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSelect = (option: T): void => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect?.(option);
  };

  useEffect(() => {
    if (activeIndex >= 0 && optionsRef.current[activeIndex]) {
      optionsRef.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  return (
    <div className={`relative w-64 ${className}`} ref={dropdownRef}>
      <button
        className="w-full px-4 py-2 text-left bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="dropdown-label"
        type="button"
      >
        {selectedOption ? selectedOption.label : label}
      </button>

      <div id="dropdown-label" className="sr-only">
        {label}
      </div>

      {isOpen && (
        <ul
          className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none"
          role="listbox"
          aria-labelledby="dropdown-label"
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <li
              key={option.id}
              ref={(el: HTMLLIElement | null) => {
                if (el) optionsRef.current[index] = el;
              }}
              className={`px-4 py-2 cursor-pointer ${
                activeIndex === index ? "bg-blue-100" : ""
              } ${
                selectedOption?.id === option.id ? "bg-blue-50" : ""
              } hover:bg-blue-50`}
              role="option"
              aria-selected={selectedOption?.id === option.id}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AccessibleDropdown;
