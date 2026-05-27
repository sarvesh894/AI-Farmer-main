/**
 * Local Fertilizer Recommendation Engine
 * Instant prediction — no API needed
 */

const FERTILIZER_RULES = [
  {
    name: "Urea",
    condition: ({ Nitrogen, Phosphorous, Potassium }) =>
      Nitrogen < 30 && Phosphorous >= 20 && Potassium >= 20,
    reason: "Low Nitrogen detected",
  },
  {
    name: "DAP (Di-Ammonium Phosphate)",
    condition: ({ Nitrogen, Phosphorous }) =>
      Phosphorous < 25 && Nitrogen < 50,
    reason: "Low Phosphorus and Nitrogen detected",
  },
  {
    name: "MOP (Muriate of Potash)",
    condition: ({ Potassium }) => Potassium < 20,
    reason: "Low Potassium detected",
  },
  {
    name: "NPK 20-20-20",
    condition: ({ Nitrogen, Phosphorous, Potassium }) =>
      Nitrogen < 40 && Phosphorous < 40 && Potassium < 40,
    reason: "All three nutrients are low",
  },
  {
    name: "SSP (Single Super Phosphate)",
    condition: ({ Phosphorous, Potassium }) =>
      Phosphorous < 30 && Potassium >= 30,
    reason: "Low Phosphorus detected",
  },
  {
    name: "Potassium Sulphate",
    condition: ({ Potassium, Phosphorous }) =>
      Potassium < 25 && Phosphorous >= 25,
    reason: "Low Potassium detected",
  },
  {
    name: "Compost",
    condition: ({ Nitrogen, Phosphorous, Potassium, Moisture }) =>
      Nitrogen < 20 && Phosphorous < 20 && Potassium < 20 && Moisture < 30,
    reason: "Very low nutrients and moisture",
  },
];

const CROP_SPECIFIC = {
  Sugarcane:   "NPK 10-26-26",
  Cotton:      "NPK 20-10-10",
  Paddy:       "Urea + SSP",
  Wheat:       "DAP + Urea",
  Maize:       "NPK 12-32-16",
  Pulses:      "SSP + MOP",
  Millets:     "Urea + MOP",
  Barley:      "DAP",
  "Oil seeds": "SSP + Borax",
  "Ground Nuts": "Gypsum + SSP",
  Tobacco:     "NPK 6-12-12",
};

export function predictFertilizer(inputs) {
  const { Crop_Type, Nitrogen, Phosphorous, Potassium } = inputs;

  // Check crop-specific first
  if (CROP_SPECIFIC[Crop_Type]) {
    return `${CROP_SPECIFIC[Crop_Type]} is the best Fertilizer to used right there`;
  }

  // Rule-based fallback
  for (const rule of FERTILIZER_RULES) {
    if (rule.condition({ ...inputs, Nitrogen: +Nitrogen, Phosphorous: +Phosphorous, Potassium: +Potassium })) {
      return `${rule.name} is the best Fertilizer to used right there`;
    }
  }

  // Default balanced
  return "NPK 17-17-17 is the best Fertilizer to used right there";
}
