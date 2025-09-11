/**
 * Weight conversion utilities for PEAR app
 * All weights should be displayed in pounds and ounces for consistency
 */

export interface WeightDisplay {
  pounds: number;
  ounces: number;
  displayString: string;
}

/**
 * Convert kilograms to pounds and ounces
 * @param kg - Weight in kilograms
 * @returns WeightDisplay object with pounds, ounces, and formatted string
 */
export const kgToPoundsAndOunces = (kg: number): WeightDisplay => {
  const totalPounds = kg * 2.20462;
  const pounds = Math.floor(totalPounds);
  const ounces = Math.round((totalPounds - pounds) * 16);
  
  return {
    pounds,
    ounces,
    displayString: ounces > 0 ? `${pounds} lbs ${ounces} oz` : `${pounds} lbs`
  };
};

/**
 * Convert pounds to pounds and ounces format
 * @param pounds - Weight in pounds (can be decimal)
 * @returns WeightDisplay object with pounds, ounces, and formatted string
 */
export const poundsToPoundsAndOunces = (pounds: number): WeightDisplay => {
  const wholePounds = Math.floor(pounds);
  const ounces = Math.round((pounds - wholePounds) * 16);
  
  return {
    pounds: wholePounds,
    ounces,
    displayString: ounces > 0 ? `${wholePounds} lbs ${ounces} oz` : `${wholePounds} lbs`
  };
};

/**
 * Format weight for display in PEAR app
 * @param weight - Weight value
 * @param unit - Original unit ('kg', 'lbs', 'pounds')
 * @returns Formatted string in pounds and ounces
 */
export const formatWeightForDisplay = (weight: number, unit: 'kg' | 'lbs' | 'pounds' = 'lbs'): string => {
  switch (unit.toLowerCase()) {
    case 'kg':
    case 'kilograms':
      return kgToPoundsAndOunces(weight).displayString;
    case 'lbs':
    case 'pounds':
      return poundsToPoundsAndOunces(weight).displayString;
    default:
      // Assume it's already in pounds
      return poundsToPoundsAndOunces(weight).displayString;
  }
};

/**
 * Convert CO₂ offset from kg to pounds for display
 * Note: CO₂ is typically measured in kg, but we'll convert for consistency
 * @param kgCO2 - CO₂ offset in kilograms
 * @returns Formatted string in pounds
 */
export const formatCO2Offset = (kgCO2: number): string => {
  return kgToPoundsAndOunces(kgCO2).displayString;
};

/**
 * Format material weight for recycling depot
 * @param weight - Weight in pounds
 * @returns Formatted string
 */
export const formatMaterialWeight = (weight: number): string => {
  return poundsToPoundsAndOunces(weight).displayString;
};
