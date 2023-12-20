import React from "react";

interface InputComponentProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const InputComponent: React.FC<InputComponentProps> = ({ id, value, onChange, label }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id}>{label}:</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        className="border rounded border-gray-300 px-2 py-1"
      />
    </div>
  );
};

export default InputComponent;