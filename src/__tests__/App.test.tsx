import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renderiza a Dashboard por padrão', () => {
    render(<App />);
    // A Dashboard contém o título 'Consultas de Hoje'
    expect(screen.getByText(/Consultas de Hoje/i)).toBeInTheDocument();
  });
});
