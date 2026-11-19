import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { CorrectionsPage } from './CorrectionsPage';
import idolsReducer from '../features/idols/idolsSlice';
import correctionsReducer from '../features/corrections/correctionsSlice';

function renderPage() {
  const store = configureStore({
    reducer: { idols: idolsReducer, corrections: correctionsReducer },
  });
  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter>
          <CorrectionsPage />
        </MemoryRouter>
      </Provider>,
    ),
  };
}

describe('CorrectionsPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('shows validation errors and does not submit invalid data', async () => {
    const user = userEvent.setup();
    const { store } = renderPage();

    await user.click(screen.getByRole('button', { name: /отправить предложение/i }));

    expect(await screen.findByText(/укажите имя/i)).toBeInTheDocument();
    expect(screen.getByText(/корректный email/i)).toBeInTheDocument();
    expect(screen.getByText(/опишите исправление подробнее/i)).toBeInTheDocument();
    expect(store.getState().corrections.items).toHaveLength(0);
  });

  it('submits a valid correction and shows confirmation', async () => {
    const user = userEvent.setup();
    const { store } = renderPage();

    await user.type(screen.getByLabelText(/ваше имя/i), 'Anna');
    await user.type(screen.getByLabelText(/email для связи/i), 'anna@example.com');
    await user.selectOptions(screen.getByLabelText(/к чему относится предложение/i), 'Профиль айдола');
    await user.type(
      screen.getByLabelText(/описание исправления/i),
      'Please correct the debut date in this artist profile.',
    );
    await user.click(screen.getByRole('button', { name: /отправить предложение/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/предложение сохранено/i);
    expect(store.getState().corrections.items).toHaveLength(1);
    expect(store.getState().corrections.items[0].email).toBe('anna@example.com');
    expect(JSON.parse(localStorage.getItem('idolverse-corrections') || '[]')).toHaveLength(1);
  });
});
