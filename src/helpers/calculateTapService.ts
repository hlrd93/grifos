interface CalculateTapServiceResult {
  success: boolean;
  message: string;
  tap: number;
}

export const calculateTapService = async (
  taps: number[],
  costs: number[]
): Promise<CalculateTapServiceResult> => {
  const totalTaps = taps.length;
  //we begin to go through the vector tap by tap
  for (let tap = 0; tap < totalTaps; tap++) {
    let fuel = 0;
    //We estimate that there is enough fuel for the next tap
    for (let i = 0; i < totalTaps; i++) {
      const actualTap = (tap + i) % totalTaps;
      fuel += taps[actualTap] - costs[actualTap];
      //if fuel out then break the circuit and return -1
      if (fuel < 0) {
        break;
      }
    }
    // if the circuit is complete then return number tap
    if (fuel >= 0) {
      return {
        success: true,
        message: `You can complete the circuit starting at the tap:`,
        tap,
      };
    }
  }

  return {
    success: false,
    message: `You can't complete the circuit, tap:`,
    tap: -1,
  };
};
