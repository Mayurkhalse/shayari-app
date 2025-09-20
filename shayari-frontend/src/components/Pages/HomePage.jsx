import { useState, useEffect } from "react";
import api from "../../utils/api";
import { ShayariCard } from "../ShayariCard";
import { useAuth } from "../../contexts/AuthContext";
import { HomePageSkeleton } from "../SkeletonLoader";
import { useToast } from "../../contexts/ToastContext";

export default function HomePage() {
  const [shayaris, setShayaris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { showError } = useToast();

  useEffect(() => {
    const fetchShayaris = async () => {
      try {
        setLoading(true);
        const res = await api.get("/shayari/public");
        
        // Map API data to ShayariCard format
        const mapped = res.data.map((item) => ({
          id: item._id,
          content: item.text,
          likes: item.likes.length,
          isLiked: item.likes.includes(user?.id) || false,
          comments: 0, // placeholder if comments not implemented
          createdAt: item.createdAt,
          backgroundImage: null, // placeholder
          author: {
            name: item.author.username,
            username: item.author.username
          }
        }));
        
        setShayaris(mapped);
        setError(null);
      } catch (err) {
        console.error("Error fetching shayaris:", err);
        setError("Failed to load shayaris. Please try again.");
        showError("Error", "Failed to load shayaris. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchShayaris();
  }, [user?.id]);
  

  if (loading) {
    return <HomePageSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Latest Shayaris</h1>
        <p className="text-gray-600">Discover beautiful poetry from our community</p>
      </div>
      
      {shayaris.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No shayaris found. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shayaris.map((shayari) => (
            <ShayariCard
              key={shayari.id}
              shayari={shayari}
              onComment={(id) => console.log("Comment on", id)}
              onShare={(id) => console.log("Share", id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
