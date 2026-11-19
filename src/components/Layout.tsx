import { useEffect, useState, type FormEvent } from 'react';
import { Eye, EyeOff, Menu, Sparkles, UserRound, X } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = 'admin@idolverse.com';
const ADMIN_PASSWORD = 'Admin123!';

export function Layout() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const isAdmin = localStorage.getItem('idolverse-current-role') === 'admin';

    if (isAdmin) {
      navigate('/admin', { replace: true });
      return;
    }

    // Remove legacy visitor accounts from earlier MVP iterations.
    localStorage.removeItem('idolverse-current-user');
    localStorage.removeItem('idolverse-current-role');
    localStorage.removeItem('idolverse-accounts');
  }, [navigate]);

  const closeMenu = () => setMenuOpen(false);

  const openAdminLogin = () => {
    setAuthOpen(true);
    setAuthError('');
    setEmail('');
    setPassword('');
  };

  const submitAdminLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidAdmin =
      email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;

    if (!isValidAdmin) {
      setAuthError('Неверная почта или пароль. Вход доступен только администратору.');
      return;
    }

    localStorage.setItem('idolverse-current-user', 'Администратор');
    localStorage.setItem('idolverse-current-role', 'admin');
    setAuthError('');
    setAuthOpen(false);
    setEmail('');
    setPassword('');
    navigate('/admin', { replace: true });
  };

  return (
    <>
      <header className="header">
        <Link className="brand" to="/" onClick={closeMenu}>
          <Sparkles size={19} />
          <span>IDOLVERSE</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          type="button"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          <NavLink to="/" end onClick={closeMenu}>Главная</NavLink>
          <NavLink to="/idols" onClick={closeMenu}>Айдолы</NavLink>
          <NavLink to="/groups" onClick={closeMenu}>Группы</NavLink>
          <NavLink to="/news" onClick={closeMenu}>Новости</NavLink>
          <NavLink to="/corrections" onClick={closeMenu}>Обратная связь</NavLink>
        </nav>

        <div className="header-account">
          <button
            className="header-account-button"
            onClick={openAdminLogin}
            aria-label="Вход администратора"
            title="Вход администратора"
            type="button"
          >
            <UserRound size={19} />
          </button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="footer">
        <span>© 2025 IDOLVERSE. Все права защищены</span>
      </footer>

      {authOpen && (
        <div
          className="auth-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setAuthOpen(false);
            }
          }}
        >
          <section
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              className="auth-close"
              onClick={() => setAuthOpen(false)}
              aria-label="Закрыть"
              type="button"
            >
              <X size={20} />
            </button>

            <div className="auth-icon">
              <UserRound size={23} />
            </div>
            <span className="auth-eyebrow">WELCOME TO IDOLVERSE</span>
            <h2 id="auth-title">Вход администратора</h2>

            <form className="auth-form" onSubmit={submitAdminLogin}>
              <label>
                Электронная почта
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="username"
                />
              </label>

              <label>
                Пароль
                <div className="auth-password">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Введите пароль"
                    required
                    minLength={6}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>

              {authError && <p className="auth-message" role="alert">{authError}</p>}

              <button className="auth-submit" type="submit">
                Войти в кабинет
              </button>
            </form>

          </section>
        </div>
      )}
    </>
  );
}
