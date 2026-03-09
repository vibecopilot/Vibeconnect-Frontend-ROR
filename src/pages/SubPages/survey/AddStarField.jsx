import React, { useState } from "react";
import { FaStar, FaHeart, FaThumbsUp, FaSmile } from "react-icons/fa";

const StarRating = ({
  rating = 0,
  onRatingChange,
  readOnly = false,
  scale = 5,
  shape = "star",
  color = "#F59E0B",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const getIcon = () => {
    switch (shape) {
      case "heart":
        return FaHeart;
      case "thumb":
        return FaThumbsUp;
      case "smiley":
        return FaSmile;
      default:
        return FaStar;
    }
  };

  const Icon = getIcon();

  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {[...Array(Number(scale))].map((_, index) => {
        const value = index + 1;

        return (
          <Icon
            key={value}
            size={28}
            className="cursor-pointer transition"
            color={
              value <= (hoverRating || rating)
                ? color
                : "#D1D5DB"
            }
            onClick={() => handleClick(value)}
            onMouseEnter={() => !readOnly && setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;