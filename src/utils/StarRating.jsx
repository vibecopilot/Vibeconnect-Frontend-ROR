import React, { useState } from "react";

const StarRating = ({ rating, onRatingChange, readOnly = false, scale = 5 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readOnly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  return (
    <div className="star-rating">
      {Array.from({ length: scale }, (_, i) => i + 1).map((star) => (
        <span
          key={star}
          className={`star ${
            star <= (hoverRating || rating) ? "filled" : ""
          } ${!readOnly ? "clickable" : ""}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;