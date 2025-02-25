"use client";

import { useState } from "react";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,dangerouslyAllowBrowser : true });

// Utility function for sanitizing user inputs
const sanitizeInput = (input) => {
  const sanitized = input.trim().replace(/<[^>]*>?/gm, ''); // Remove HTML tags
  return sanitized.length > 200 ? sanitized.substring(0, 200) : sanitized; // Limit to 200 chars
};

export default function Home() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [travellers, setTravellers] = useState('');
  const [preferences, setPreferences] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateInputs = () => {
    if (!destination) return "Destination is required";
    if (new Date(startDate) > new Date(endDate)) return "Start date cannot be after end date.";
    if (budget <= 0) return "Budget must be a positive number.";
    if (travellers <= 0) return "Number of travellers must be at least 1.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse('');

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const userPrompt = `Plan a detailed trip itinerary based on the following details:
    - Destination Location: ${sanitizeInput(destination)}
    - Travel Dates: ${sanitizeInput(startDate)} to ${sanitizeInput(endDate)}
    - Budget: ${sanitizeInput(budget)}
    - Number of Travellers: ${sanitizeInput(travellers)}
    - Interests and Preferences: ${sanitizeInput(preferences)}

    Provide suggestions for transportation, accommodation, sightseeing, activities, local cuisine, and any travel tips. Ensure the plan fits within the budget and aligns with the preferences.`;

    try {
      const aiResponse = await groq.chat.completions.create({
        messages: [{ role: "user", content: userPrompt }],
        model: "mixtral-8x7b-32768",
      });

      const aiContent = aiResponse.choices[0]?.message?.content;
      setResponse(aiContent || "No response received. Please try again.");
    } catch (err) {
      console.error("Error generating trip plan:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">AI Travel Planner</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-md space-y-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg">
            {error}
          </div>
        )}

        <input type="text" placeholder="Destination Location" value={destination} onChange={(e) => setDestination(sanitizeInput(e.target.value))} className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />

        <div className="flex space-x-2">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-1/2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-1/2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>

        <input type="number" placeholder="Budget (USD)" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" min="1" required />
        <input type="number" placeholder="Number of Travellers" value={travellers} onChange={(e) => setTravellers(e.target.value)} className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" min="1" required />
        <textarea placeholder="Interests and Preferences (e.g., adventure, food, museums)" value={preferences} onChange={(e) => setPreferences(sanitizeInput(e.target.value))} className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400" rows="4" required />

        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition duration-200" disabled={loading}>
          {loading ? 'Planning Trip...' : 'Plan My Trip'}
        </button>
      </form>

      {response && (
        <div className="bg-white mt-6 shadow-xl rounded-2xl p-6 w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-2">Your Trip Plan:</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
} 
