import React, { useState, useRef, useEffect, ReactNode } from 'react';
import ArrowDown from '../arrow-down/arrow-down';
import './select.css';

export type OptionType<T> = {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: ReactNode;
  avatarUrl?: string;
  extra?: ReactNode;
};

type SelectProps<T> = {
  options: OptionType<T>[];
  placeholder?: string;
  onChange?: (value: OptionType<T> | OptionType<T>[] | null) => void;
  onCreateOption?: (inputValue: string) => Promise<OptionType<T>>;
  multiple?: boolean;
  allowClear?: boolean;
  loading?: boolean;
  disabled?: boolean;
  customDropdown?: (props: CustomDropdownProps<T>) => ReactNode;
  customLabel?: (option: OptionType<T>) => ReactNode;
};

export type CustomDropdownProps<T> = {
  options: OptionType<T>[];
  searchTerm: string;
  selectedOption: OptionType<T> | OptionType<T>[] | null;
  onOptionSelect: (option: OptionType<T>) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateOption?: () => void;
  multiple: boolean;
};

const Select = <T extends string | number | object>({
  options,
  placeholder = 'Select an option',
  onChange,
  onCreateOption,
  multiple = false,
  allowClear = false,
  loading = false,
  disabled = false,
  customDropdown,
  customLabel,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType<T> | OptionType<T>[] | null>(
    multiple ? [] : null
  );
  const [filteredOptions, setFilteredOptions] = useState<OptionType<T>[]>(options);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = (option: OptionType<T>) => {
    if (multiple) {
      const newValue = Array.isArray(selectedOption) ? [...selectedOption] : [];
      const isSelected = newValue.find((item) => item.value === option.value);
      if (isSelected) {
        setSelectedOption(newValue.filter(({ value }) => value !== option.value));
      } else {
        newValue.push(option);
        setSelectedOption(newValue);
      }
      if (onChange) onChange(newValue);
    } else {
      setSelectedOption(option);
      setIsOpen(false);
      if (onChange) onChange(option);
    }
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredOptions(
      options.filter((option) => option.label.toLowerCase().includes(term.toLowerCase()))
    );
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedOption(multiple ? [] : null);
    if (onChange) onChange(multiple ? [] : null);
  };

  const handleCreateOption = async () => {
    if (onCreateOption) {
      const newOption = await onCreateOption(searchTerm);
      setFilteredOptions((prev) => [...prev, newOption]);
      handleOptionSelect(newOption);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const renderSelectedOptions = () => {
    if (multiple && Array.isArray(selectedOption)) {
      return selectedOption.map((option) => {
        const opt = options.find((opt) => opt.value === option.value);
        if (opt) {
          return (
            <span key={option.value as any} className='select-tag'>
              {customLabel ? (
                customLabel(opt)
              ) : (
                <>
                  {opt.icon && <span className='option-icon'>{opt.icon}</span>}
                  {opt.avatarUrl && (
                    <img src={opt.avatarUrl} alt='avatar' className='option-avatar' />
                  )}
                  <span className='option-label'>{opt.label}</span>
                </>
              )}
              <span className='select-tag-remove' onClick={() => handleOptionSelect(opt)}>
                ×
              </span>
            </span>
          );
        }
        return null;
      });
    } else if (!multiple && selectedOption !== null) {
      const option = options.find((opt) => opt.value === (selectedOption as OptionType<T>).value);
      return option ? (
        customLabel ? (
          customLabel(option)
        ) : (
          <>
            {option.icon && <span className='option-icon'>{option.icon}</span>}
            {option.avatarUrl && (
              <img src={option.avatarUrl} alt='avatar' className='option-avatar' />
            )}
            <span className='option-label'>{option.label}</span>
          </>
        )
      ) : (
        placeholder
      );
    } else {
      return placeholder;
    }
  };

  const renderDefaultDropdown = () => (
    <>
      <input
        type='text'
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder='Search...'
        className='select-search'
      />
      <ul className='select-options'>
        {filteredOptions.map((option) => (
          <li
            key={option.value as any}
            className={`select-option ${option.disabled ? 'disabled' : ''}`}
            onClick={() => !option.disabled && handleOptionSelect(option)}
          >
            <div className='option-elms'>
              {option.icon && <span className='option-icon'>{option.icon}</span>}
              {option.avatarUrl && (
                <img src={option.avatarUrl} alt='avatar' className='option-avatar' />
              )}
              <span className='option-label'>
                {customLabel ? customLabel(option) : option.label}
              </span>
            </div>

            {option.extra && <span className='option-extra'>{option.extra}</span>}
            {multiple &&
              Array.isArray(selectedOption) &&
              (selectedOption as OptionType<T>[]).find((opt) => opt.value === option.value) && (
                <span className='option-check'>✔</span>
              )}
          </li>
        ))}
        {onCreateOption && searchTerm && (
          <li className='select-option create-option' onClick={handleCreateOption}>
            Create "{searchTerm}"
          </li>
        )}
      </ul>
    </>
  );

  return (
    <div className={`select-container ${disabled ? 'disabled' : ''}`} ref={selectRef}>
      <div className='select-header' onClick={handleToggleDropdown}>
        <div className='select-values'>{renderSelectedOptions()}</div>
        <span className='select-controls'>
          {allowClear && selectedOption && !loading && (
            <span className='clear-button' onClick={handleClearSelection}>
              ×
            </span>
          )}
          <span className='arrow'>
            <ArrowDown />
          </span>
        </span>
      </div>
      {isOpen && (
        <div className='select-dropdown'>
          {loading ? (
            <div className='loading'>Loading...</div>
          ) : customDropdown ? (
            customDropdown({
              options: filteredOptions,
              searchTerm,
              selectedOption,
              onOptionSelect: handleOptionSelect,
              onSearchChange: handleSearchChange,
              onCreateOption: handleCreateOption,
              multiple,
            })
          ) : (
            renderDefaultDropdown()
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
