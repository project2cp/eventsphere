import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from "react-icons/fa";

const HeartIcon = ({ eventId, isLiked: initialIsLiked, onLike }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked || false);

  useEffect(() => {
    setIsLiked(initialIsLiked || false);
  }, [initialIsLiked]);

  const handleToggleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    try {
      // Optimistically update UI
      setIsLiked(newLikedState);

      // Call the onLike function to handle backend updates
      if (onLike) {
        await onLike(eventId, newLikedState);
      }

    } catch (error) {
      console.error("Error updating like status:", error);
      // Revert the UI state in case of an error
      setIsLiked(isLiked);
    }
  };

  return (
    <button onClick={handleToggleLike} aria-label="Toggle Favorite" className="mb-2">
      {isLiked ? <FaHeart color="red" size={24} /> : <FaRegHeart color="white" size={24} />}
    </button>
  );
};
export default HeartIcon;

