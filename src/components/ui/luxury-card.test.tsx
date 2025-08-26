
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { LuxuryCard } from './luxury-card';

describe('LuxuryCard', () => {
  it('renders correctly', () => {
    const { container } = render(
      <LuxuryCard>
        <div>Test Content</div>
      </LuxuryCard>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies default variant correctly', () => {
    const { container } = render(
      <LuxuryCard variant="default">
        <div>Default Content</div>
      </LuxuryCard>
    );
    expect(container.firstChild).toHaveClass('luxury-card');
  });

  it('applies premium variant correctly', () => {
    const { container } = render(
      <LuxuryCard variant="premium">
        <div>Premium Content</div>
      </LuxuryCard>
    );
    expect(container.firstChild).toHaveClass('border-luxury-gold');
  });
});
