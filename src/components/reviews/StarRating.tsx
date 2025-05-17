
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  color?: string;
  onClick?: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 20,
  color = 'gold',
  onClick,
  readOnly = true
}) => {
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <Star
        key={i}
        size={size}
        fill={i <= rating ? color : 'transparent'}
        stroke={i <= rating ? color : '#ccc'}
        className={!readOnly ? 'cursor-pointer transition-transform hover:scale-110' : ''}
        onClick={() => !readOnly && onClick && onClick(i)}
      />
    );
  }

  return <div className=" flex gap-1">{stars}</div>;
};

export default StarRating;
