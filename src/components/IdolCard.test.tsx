import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { IdolCard } from './IdolCard';
import { mockIdols } from '../data/mockData';
describe('IdolCard', () => { it('renders artist details and profile link', () => { render(<MemoryRouter><IdolCard idol={mockIdols[0]}/></MemoryRouter>); expect(screen.getByRole('heading',{name:'S.Coups'})).toBeInTheDocument(); expect(screen.getByText(/SEVENTEEN/)).toBeInTheDocument(); expect(screen.getByRole('link')).toHaveAttribute('href','/idols/scoups'); }); });
