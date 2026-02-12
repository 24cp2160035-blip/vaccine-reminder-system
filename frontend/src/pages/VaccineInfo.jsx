import React, { useState } from "react";

const vaccineDatabase = {
  // Children Vaccines
  "BCG": {
    name: "BCG (Bacillus Calmette-Guérin)",
    purpose: "Protects against tuberculosis (TB)",
    recommendedAge: "At birth",
    sideEffects: "Small sore at injection site, mild fever",
    postCareTips: "Keep injection site clean and dry. A small scar is normal.",
    category: "child"
  },
  "Hepatitis B": {
    name: "Hepatitis B Vaccine",
    purpose: "Prevents hepatitis B virus infection affecting the liver",
    recommendedAge: "Birth, 1-2 months, 6 months",
    sideEffects: "Soreness at injection site, mild fever",
    postCareTips: "Apply cool compress if sore. Give plenty of fluids.",
    category: "child"
  },
  "DTP/DTaP": {
    name: "DTP/DTaP (Diphtheria, Tetanus, Pertussis)",
    purpose: "Protects against diphtheria, tetanus, and whooping cough",
    recommendedAge: "2, 4, 6, 15-18 months, 4-6 years",
    sideEffects: "Redness/swelling at site, fever, fussiness",
    postCareTips: "Monitor temperature. Give acetaminophen if fever develops (consult doctor).",
    category: "child"
  },
  "Polio (IPV)": {
    name: "Inactivated Poliovirus Vaccine",
    purpose: "Prevents polio, a crippling disease",
    recommendedAge: "2, 4, 6-18 months, 4-6 years",
    sideEffects: "Soreness at injection site",
    postCareTips: "Normal activities can resume immediately.",
    category: "child"
  },
  "MMR": {
    name: "MMR (Measles, Mumps, Rubella)",
    purpose: "Protects against measles, mumps, and rubella",
    recommendedAge: "12-15 months, 4-6 years",
    sideEffects: "Mild rash, fever 7-12 days after vaccination",
    postCareTips: "Monitor for fever. Rash is not contagious.",
    category: "child"
  },
  "Varicella": {
    name: "Varicella (Chickenpox) Vaccine",
    purpose: "Prevents chickenpox",
    recommendedAge: "12-15 months, 4-6 years",
    sideEffects: "Mild rash, soreness at injection site",
    postCareTips: "Avoid aspirin for 6 weeks after vaccination.",
    category: "child"
  },
  "Hib": {
    name: "Haemophilus influenzae type b",
    purpose: "Prevents Hib disease (meningitis, pneumonia)",
    recommendedAge: "2, 4, 6, 12-15 months",
    sideEffects: "Redness/warmth at site, mild fever",
    postCareTips: "Apply cool compress. Monitor temperature.",
    category: "child"
  },
  "PCV": {
    name: "Pneumococcal Conjugate Vaccine",
    purpose: "Protects against pneumococcal bacteria (pneumonia, meningitis)",
    recommendedAge: "2, 4, 6, 12-15 months",
    sideEffects: "Drowsiness, mild fever, loss of appetite",
    postCareTips: "Extra rest and fluids. Symptoms resolve in 1-2 days.",
    category: "child"
  },
  "Rotavirus": {
    name: "Rotavirus Vaccine",
    purpose: "Prevents rotavirus (severe diarrhea)",
    recommendedAge: "2, 4, 6 months (oral vaccine)",
    sideEffects: "Mild diarrhea, irritability",
    postCareTips: "Ensure adequate hydration. Contact doctor if severe diarrhea.",
    category: "child"
  },
  "Influenza": {
    name: "Flu Vaccine",
    purpose: "Protects against seasonal influenza",
    recommendedAge: "Annually from 6 months onwards",
    sideEffects: "Soreness, mild fever, fatigue",
    postCareTips: "Rest and fluids. Symptoms typically last 1-2 days.",
    category: "both"
  },

  // Pet Vaccines
  "Rabies": {
    name: "Rabies Vaccine",
    purpose: "Prevents rabies, a fatal viral disease",
    recommendedAge: "12-16 weeks, then annually or every 3 years",
    sideEffects: "Mild swelling at injection site, lethargy",
    postCareTips: "Monitor for allergic reactions. Keep pet calm for 24 hours.",
    category: "pet"
  },
  "DHPP": {
    name: "DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)",
    purpose: "Core vaccine protecting against multiple diseases",
    recommendedAge: "6-8 weeks, then every 3-4 weeks until 16 weeks",
    sideEffects: "Mild fever, decreased appetite, lethargy",
    postCareTips: "Provide quiet space. Symptoms resolve in 24-48 hours.",
    category: "pet"
  },
  "Bordetella": {
    name: "Bordetella (Kennel Cough)",
    purpose: "Prevents kennel cough",
    recommendedAge: "8 weeks, then annually",
    sideEffects: "Mild cough, sneezing",
    postCareTips: "Avoid boarding for 72 hours after vaccination.",
    category: "pet"
  },
  "Leptospirosis": {
    name: "Leptospirosis Vaccine",
    purpose: "Prevents bacterial infection affecting kidneys and liver",
    recommendedAge: "12 weeks, booster in 2-4 weeks, then annually",
    sideEffects: "Vomiting, diarrhea, facial swelling (rare)",
    postCareTips: "Monitor closely for 24 hours. Contact vet if severe reaction.",
    category: "pet"
  },
  "FVRCP": {
    name: "FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)",
    purpose: "Core vaccine for cats against respiratory and GI diseases",
    recommendedAge: "6-8 weeks, then every 3-4 weeks until 16 weeks",
    sideEffects: "Mild fever, sneezing, reduced appetite",
    postCareTips: "Keep cat indoors. Provide fresh water and quiet environment.",
    category: "pet"
  },
  "FeLV": {
    name: "Feline Leukemia Virus Vaccine",
    purpose: "Prevents feline leukemia",
    recommendedAge: "8 weeks, booster at 12 weeks, then annually",
    sideEffects: "Lethargy, mild fever",
    postCareTips: "Monitor for 24 hours. Symptoms typically mild and brief.",
    category: "pet"
  }
};

export default function VaccineInfo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVaccine, setSelectedVaccine] = useState(null);

  const filteredVaccines = Object.entries(vaccineDatabase).filter(([key, vaccine]) => {
    const matchesSearch = vaccine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vaccine.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           vaccine.category === selectedCategory ||
                           vaccine.category === "both";
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">📚 Vaccine Information Center</h1>
        <p className="text-gray-600">Learn about vaccines, their benefits, and post-care tips</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search vaccines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Categories</option>
          <option value="child">Children</option>
          <option value="pet">Pets</option>
        </select>
      </div>

      {/* Vaccine Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVaccines.map(([key, vaccine]) => (
          <div
            key={key}
            onClick={() => setSelectedVaccine(vaccine)}
            className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md cursor-pointer transition"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{key}</h3>
              <span className={`text-xs px-2 py-1 rounded ${
                vaccine.category === 'child' ? 'bg-blue-100 text-blue-700' :
                vaccine.category === 'pet' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {vaccine.category === 'both' ? 'All' : vaccine.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{vaccine.purpose}</p>
            <p className="text-xs text-gray-500">📅 {vaccine.recommendedAge}</p>
          </div>
        ))}
      </div>

      {filteredVaccines.length === 0 && (
        <p className="text-center text-gray-500 py-8">No vaccines found matching your search</p>
      )}

      {/* Detail Modal */}
      {selectedVaccine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedVaccine.name}</h2>
              <button
                onClick={() => setSelectedVaccine(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">🎯 Purpose</h3>
                <p className="text-gray-700">{selectedVaccine.purpose}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">📅 Recommended Age</h3>
                <p className="text-gray-700">{selectedVaccine.recommendedAge}</p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">⚠️ Common Side Effects</h3>
                <p className="text-gray-700">{selectedVaccine.sideEffects}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">💡 Post-Care Tips</h3>
                <p className="text-gray-700">{selectedVaccine.postCareTips}</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> This information is for educational purposes only. 
                  Always consult with your healthcare provider or veterinarian for personalized medical advice.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedVaccine(null)}
              className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">❓ Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Why are vaccines important?</h3>
            <p className="text-gray-700">Vaccines protect against serious diseases by training the immune system to recognize and fight specific pathogens. They prevent illness, reduce severity of disease, and protect vulnerable populations.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Are vaccines safe?</h3>
            <p className="text-gray-700">Yes. Vaccines undergo rigorous testing before approval. Side effects are typically mild and temporary. Serious reactions are extremely rare, and the benefits far outweigh the risks.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">What if I miss a scheduled vaccine?</h3>
            <p className="text-gray-700">Contact your healthcare provider or veterinarian as soon as possible. They can help you get back on schedule. Most vaccine series can be completed even if delayed.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Can vaccines be given together?</h3>
            <p className="text-gray-700">Yes, many vaccines can be safely administered together. This is common practice and doesn't reduce effectiveness or increase side effects significantly.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">How should I prepare for vaccination?</h3>
            <p className="text-gray-700">Ensure your child/pet is well-rested and hydrated. Bring vaccination records. For children, consider bringing a comfort item. For pets, ensure they're on a leash or in a carrier.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
