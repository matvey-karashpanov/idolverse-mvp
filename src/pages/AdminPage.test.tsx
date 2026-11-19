import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { AdminPage } from './AdminPage';
import idolsReducer from '../features/idols/idolsSlice';
import correctionsReducer from '../features/corrections/correctionsSlice';

function renderAdmin() {
  const store = configureStore({
    reducer: { idols: idolsReducer, corrections: correctionsReducer },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    </Provider>,
  );
}

describe('AdminPage access', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('does not show the admin workspace to an unauthenticated visitor', () => {
    renderAdmin();

    expect(screen.getByRole('heading', { name: /требуется вход администратора/i })).toBeInTheDocument();
    expect(screen.queryByText(/рабочее пространство/i)).not.toBeInTheDocument();
  });

  it('shows the admin workspace for an administrator session', () => {
    localStorage.setItem('idolverse-current-role', 'admin');
    renderAdmin();

    expect(screen.getByRole('heading', { name: /обращения/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /каталог артистов/i })).toBeInTheDocument();
  });
});
