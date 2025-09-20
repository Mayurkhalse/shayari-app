import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import LoadingSpinner from "./LoadingSpinner";

export default function AddShayari() {
  const [text, setText] = useState("");
  const [genre, setGenre] = useState("other");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await api.post("/shayari/add", { 
        text, 
        genre, 
        isPublic 
      });
      
      console.log("Shayari added:", res.data);
      navigate("/"); // redirect to homepage
    } catch (err) {
      console.error("Add shayari error:", err);
      setError(err.response?.data?.message || "Failed to add shayari");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Add New Shayari</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Shayari
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Write your shayari..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Genre
          </label>
          <select 
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          >
            <option value="romantic">Romantic</option>
            <option value="sad">Sad</option>
            <option value="funny">Funny</option>
            <option value="motivational">Motivational</option>
            <option value="other">Other</option>
          </select>
        </div>
       
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
            Make Public
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Adding...</span>
            </div>
          ) : (
            "Add Shayari"
          )}
        </button>
      </form>
    </div>
  );
}
