const vaccineSchedule = {
  Birth: [
    { name: "BCG", purpose: "Prevents Tuberculosis" },
    { name: "OPV-0", purpose: "Prevents Polio" },
    { name: "Hepatitis B-1", purpose: "Prevents liver infection" },
  ],

  "6 Weeks": [
    { name: "DPT-1", purpose: "Prevents Diphtheria, Pertussis, Tetanus" },
    { name: "IPV-1", purpose: "Prevents Polio" },
    { name: "Hib-1", purpose: "Prevents Pneumonia" },
    { name: "Hepatitis B-2", purpose: "Prevents liver infection" },
    { name: "Rotavirus-1", purpose: "Prevents diarrhoea" },
    { name: "PCV-1", purpose: "Prevents Pneumococcal disease" },
  ],

  "10 Weeks": [
    { name: "DPT-2", purpose: "Booster dose" },
    { name: "IPV-2", purpose: "Prevents Polio" },
    { name: "Hib-2", purpose: "Booster dose" },
    { name: "Rotavirus-2", purpose: "Prevents diarrhoea" },
    { name: "PCV-2", purpose: "Prevents Pneumonia" },
  ],

  "14 Weeks": [
    { name: "DPT-3", purpose: "Booster dose" },
    { name: "IPV-3", purpose: "Prevents Polio" },
    { name: "Hib-3", purpose: "Prevents Meningitis" },
    { name: "Rotavirus-3", purpose: "Prevents diarrhoea" },
    { name: "PCV-3", purpose: "Prevents Pneumonia" },
  ],

  "9 Months": [
    { name: "MMR-1", purpose: "Prevents Measles, Mumps, Rubella" },
    { name: "JE-1", purpose: "Prevents Japanese Encephalitis" },
  ],

  "12 Months": [
    { name: "Hepatitis A-1", purpose: "Prevents liver disease" },
  ],

  "15 Months": [
    { name: "MMR-2", purpose: "Booster dose" },
    { name: "PCV-Booster", purpose: "Booster dose" },
    { name: "Varicella-1", purpose: "Prevents Chickenpox" },
  ],

  "16-18 Months": [
    { name: "DPT-Booster-1", purpose: "Booster dose" },
    { name: "IPV-Booster", purpose: "Booster dose" },
    { name: "Hib-Booster", purpose: "Prevents Meningitis" },
  ],

  "5 Years": [
    { name: "DPT-Booster-2", purpose: "Prevents Diphtheria, Tetanus" },
    { name: "Varicella-2", purpose: "Booster dose" },
    { name: "Typhoid Vaccine", purpose: "Prevents Typhoid" },
  ],

  "10 Years": [
    { name: "Tdap", purpose: "Prevents Tetanus & Diphtheria" },
  ],

  "16 Years": [
    { name: "Tdap Booster", purpose: "Booster dose" },
  ],
};

export default vaccineSchedule;