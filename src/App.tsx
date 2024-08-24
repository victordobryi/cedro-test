import Select, { CustomDropdownProps, OptionType } from './components/select';

const options = [
  { value: 'apple', label: 'Apple', icon: '🍎' },
  { value: 'banana', label: 'Banana', icon: '🍌' },
  { value: 'cherry', label: 'Cherry', icon: '🍒' },
  { value: 'date', label: 'Date', avatarUrl: 'https://via.placeholder.com/20', disabled: true },
  { value: 'fig', label: 'Fig', extra: <input type='radio' name='fruit' /> },
  { value: 'grape', label: 'Grape', icon: '🍇' },
];

function App() {
  const handleSelectChange = (value: any) => {
    console.log('Selected:', value);
  };

  const handleCreateOption = async (inputValue: string) => {
    return { value: inputValue, label: inputValue, icon: '✨' };
  };

  const CustomDropdown = ({
    options,
    onOptionSelect,
    selectedOption,
    searchTerm,
    onSearchChange,
  }: CustomDropdownProps<string>) => (
    <>
      <input
        type='text'
        value={searchTerm}
        onChange={onSearchChange}
        placeholder='Search...'
        className='select-search'
      />
      <ul className='custom-select-options'>
        {options.map((option) => (
          <li
            key={option.value}
            className={`custom-select-option ${option.disabled ? 'disabled' : ''}`}
            onClick={() => !option.disabled && onOptionSelect(option)}
          >
            {option.avatarUrl && (
              <img src={option.avatarUrl} alt='avatar' className='custom-option-avatar' />
            )}
            {option.icon && <span className='custom-option-icon'>{option.icon}</span>}
            <span className='custom-option-label'>{option.label}</span>
            {Array.isArray(selectedOption) &&
              selectedOption.some((opt) => opt.value === option.value) && (
                <span className='custom-option-check'>✔</span>
              )}
          </li>
        ))}
      </ul>
    </>
  );

  const CustomLabel = (option: OptionType<string>) => (
    <>
      {option.avatarUrl && (
        <img src={option.avatarUrl} alt='avatar' className='custom-selected-avatar' />
      )}
      {option.icon && <span className='custom-selected-icon'>{option.icon}</span>}
      <span className='custom-selected-label'>{option.label}</span>
    </>
  );

  return (
    <Select
      options={options}
      onChange={handleSelectChange}
      onCreateOption={handleCreateOption}
      multiple={true}
      // allowClear={true}
      // loading={false}
      // disabled={false}
      // customLabel={CustomLabel}
      // customDropdown={CustomDropdown}
    />
  );
}

export default App;
