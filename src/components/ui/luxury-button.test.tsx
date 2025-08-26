
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { LuxuryButton } from './luxury-button';

describe('LuxuryButton', () => {
  it('renders correctly', () => {
    const { container } = render(<LuxuryButton>Test Button</LuxuryButton>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies default variant correctly', () => {
    const { container } = render(
      <LuxuryButton variant="default">Default Button</LuxuryButton>
    );
    expect(container.firstChild).toHaveClass('luxury-button');
  });

  it('applies premium variant correctly', () => {
    const { container } = render(
      <LuxuryButton variant="premium">Premium Button</LuxuryButton>
    );
    expect(container.firstChild).toHaveClass('bg-premium-gradient');
  });
});
