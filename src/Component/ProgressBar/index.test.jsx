import React from 'react';
import { screen, render } from '@testing-library/react';
import ProgressBar from './index';

describe('ProgressBar', () => {
  it('renders the progress bar with the correct percentage', () => {
    const percentage = 50;
    render(<ProgressBar percentage={percentage} />);
    const progressBar = screen.getByRole('progressbar', 'progress-bar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle(`width: ${percentage}%`);
  });
});
