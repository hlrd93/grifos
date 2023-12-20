import React from "react";

interface ResultComponentProps {
  error: string | null;
  result: string | null;
}

const ResultComponent: React.FC<ResultComponentProps> = ({ error, result }) => {
  return (
    <div className="mt-4">
      {error && <span data-testid="error" className="text-red-500">{error}</span>}
      {result && <span data-testid="result" className="text-green-500">{result}</span>}
    </div>
  );
};

export default ResultComponent;
