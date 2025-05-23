
import React from 'react';
import { Star } from 'lucide-react';

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  color?: string;
  onClick?: (rating: number) => void;
  readOnly?: boolean;
  value?: number;
  onChange?: (value: number) => void;
  id?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 20,
  color = 'gold',
  onClick,
  readOnly = true,
  value,
  onChange,
  id
}) => {
  // Use value prop if provided, otherwise use rating
  const displayRating = value !== undefined ? value : rating;
  
  const handleClick = (index: number) => {
    if (!readOnly) {
      if (onChange) {
        onChange(index);
      }
      if (onClick) {
        onClick(index);
      }
    }
  };

  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    stars.push(
      <Star
        key={i}
        size={size}
        fill={i <= displayRating ? color : 'transparent'}
        stroke={i <= displayRating ? color : '#ccc'}
        className={!readOnly ? 'cursor-pointer transition-transform hover:scale-110' : ''}
        onClick={() => handleClick(i)}
        id={id ? `${id}-star-${i}` : undefined}
      />
    );
  }

  return <div className="flex gap-1">{stars}</div>;
};

export default StarRating;
