import React from "react";
import { calculateTapService } from "./helpers/calculateTapService";
import { useAppState } from "./providers/AppStateContext";
import InputComponent from "./components/InputComponent";
import ResultComponent from "./components/ResultComponent";

const App = () => {
  const {
    input1,
    input2,
    error,
    result,
    setInput1,
    setInput2,
    setError,
    setResult,
  } = useAppState();

  // Function to validate if a string contains only numbers and commas
  const isValidNumberString = (value: string): boolean =>
    /^[0-9,]*$/.test(value);
  // Function to validate that there are no consecutive commas in a string
  const hasConsecutiveCommas = (value: string): boolean =>
    /(,){2,}/.test(value);
  // Function to validate that there are no commas at the beginning or end of the string
  const hasLeadingOrTrailingComma = (value: string): boolean =>
    /^[^,].*[^,]$/.test(value);
  // Function to validate that two vectors have the same length
  const areVectorsSameLength = (arr1: any[], arr2: any[]): boolean =>
    arr1.length === arr2.length;

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    inputNumber: number
  ) => {
    const value = event.target.value;
    setError(null);
    setResult(null);
    if (!isValidNumberString(value)) {
      setError("Enter only positive numbers separated by commas.");
    }
    if (hasConsecutiveCommas(value)) {
      setError("Consecutive commas are not allowed.");
    }
    if (inputNumber === 1) {
      setInput1(value);
    } else if (inputNumber === 2) {
      setInput2(value);
    }
  };

  const handleSubmit = () => {
    setError(null);
    setResult(null);
    // Validate vectors not empty
    if (input1.length === 0) {
      setError("Taps vector is empty.");
    } else if (input2.length === 0) {
      setError("Costs vector is empty.");
    }
    // Validate no commas at the beginning and end of the vectors, only numbers
    if (!hasLeadingOrTrailingComma(input1)) {
      setError(
        "Leading or trailing commas are not allowed in the Taps vector."
      );
    }
    if (!hasLeadingOrTrailingComma(input2)) {
      setError(
        "Leading or trailing commas are not allowed in the Costs vector."
      );
    } else {
      const taps = input1.split(",").map((num) => parseInt(num));
      const costs = input2.split(",").map((num) => parseInt(num));

      if (areVectorsSameLength(taps, costs)) {
        calculateTapService(taps, costs)
          .then((result) => {
            if (result.tap === -1) {
              setError(`${result.message} ${result.tap}`);
            } else setResult(`${result.message} ${result.tap}`);
          })
          .catch((error: React.SetStateAction<string | null>) => {
            setError(error);
          });
      } else {
        setError("The vectors must have the same length.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center pt-10 ">
      <div className="text-center w-1/2">
        <InputComponent
          id="tapsInput"
          value={input1}
          onChange={(e) => handleInputChange(e, 1)}
          label="Taps Vector"
        />
        <InputComponent
          id="costsInput"
          value={input2}
          onChange={(e) => handleInputChange(e, 2)}
          label="Costs Vector"
        />

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Result
        </button>
        <ResultComponent error={error} result={result} />
      </div>
    </div>
  );
};

export default App;
