import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import App from "./App";
import { calculateTapService } from "./helpers/calculateTapService";
import { AppStateProvider } from "./providers/AppStateContext";

jest.mock("./helpers/calculateTapService");

describe("App Component", () => {
  it("renders without crashing", () => {
    render(
      <AppStateProvider>
        <App />
      </AppStateProvider>
    );

    expect(screen.getByLabelText(/Taps Vector/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Costs Vector/i)).toBeInTheDocument();
  });

  it("handles input change correctly", () => {
    render(
      <AppStateProvider>
        <App />
      </AppStateProvider>
    );

    const tapsInput = screen.getByLabelText(/Taps Vector/i);
    const costsInput = screen.getByLabelText(/Costs Vector/i);
    fireEvent.change(tapsInput, { target: { value: "1,2,3" } });
    fireEvent.change(costsInput, { target: { value: "4,5,6" } });

    expect(tapsInput).toHaveValue("1,2,3");
    expect(costsInput).toHaveValue("4,5,6");
  });

  it("handles form submission correctly", async () => {
    render(
      <AppStateProvider>
        <App />
      </AppStateProvider>
    );

    const tapsInput = screen.getByLabelText(/Taps Vector/i);
    const costsInput = screen.getByLabelText(/Costs Vector/i);
    const submitButton = screen.getByText(/Result/i);
    fireEvent.change(tapsInput, { target: { value: "1,2,3,4,5" } });
    fireEvent.change(costsInput, { target: { value: "3,4,5,1,2" } });
    (calculateTapService as jest.Mock).mockResolvedValueOnce({
      success: true,
      messaje: /You can complete the circuit starting at the tap:/i,
      tap: 3,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("result")).toBeInTheDocument();
    });
  });

  it("handles form submission with error correctly", async () => {
    render(
      <AppStateProvider>
        <App />
      </AppStateProvider>
    );

    const tapsInput = screen.getByLabelText(/Taps Vector/i);
    const costsInput = screen.getByLabelText(/Costs Vector/i);
    const submitButton = screen.getByText(/Result/i);
    fireEvent.change(tapsInput, { target: { value: "1,2,3" } });
    fireEvent.change(costsInput, { target: { value: "3,4,5" } });
    (calculateTapService as jest.Mock).mockResolvedValueOnce({
      success: false,
      messaje: /You can't complete the circuit, tap:/i,
      tap: -1,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });
  });
});
