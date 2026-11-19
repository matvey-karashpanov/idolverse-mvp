import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';

import { IdolCard } from '../components/IdolCard';
import { SectionTitle } from '../components/SectionTitle';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loadIdols,
  resetFilters,
  selectFilteredIdols,
  setDirection,
  setQuery,
} from '../features/idols/idolsSlice';

const directions = ['Все', 'K-POP', 'C-POP', 'J-POP'] as const;

export function IdolsPage() {
  const dispatch = useAppDispatch();
  const { status, error, query, direction } = useAppSelector((state) => state.idols);
  const idols = useAppSelector(selectFilteredIdols);

  return (
    <div className="page">
      <SectionTitle
        title="Каталог айдолов"
        description="Находи любимых исполнителей или открывай новые имена на музыкальной карте Азии."
      />

      <div className="catalog-toolbar">
        <label className="search-field">
          <Search size={19} />
          <input
            value={query}
            onChange={(event) => dispatch(setQuery(event.target.value))}
            placeholder="Имя, группа или страна..."
            aria-label="Поиск артистов"
          />
          <kbd>⌕</kbd>
        </label>

        <div className="filter-label">
          <SlidersHorizontal size={16} />
          Направление
        </div>

        <div className="filter-row">
          {directions.map((item) => (
            <button
              key={item}
              className={direction === item ? 'filter-chip active' : 'filter-chip'}
              onClick={() => dispatch(setDirection(item))}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>

        <button
          className="reset-button"
          onClick={() => dispatch(resetFilters())}
          type="button"
        >
          <RotateCcw size={15} />
          Сбросить
        </button>
      </div>

      {status === 'loading' && (
        <div className="state-panel" role="status">
          <div className="spinner" />
          Загружаем каталог...
        </div>
      )}

      {status === 'failed' && (
        <div className="state-panel error-state" role="alert">
          <p>{error}</p>
          <button
            className="button primary"
            onClick={() => void dispatch(loadIdols())}
            type="button"
          >
            Повторить
          </button>
        </div>
      )}

      {status === 'succeeded' && (
        <>
          <div className="results-line">
            <span>
              {idols.length} {idols.length === 1 ? 'артист' : 'артистов'}
            </span>
          </div>

          {idols.length > 0 ? (
            <div className="idol-grid">
              {idols.map((idol) => (
                <IdolCard key={idol.id} idol={idol} />
              ))}
            </div>
          ) : (
            <div className="state-panel empty-state">
              <span>✦</span>
              <h3>Ничего не найдено</h3>
              <p>Попробуй изменить запрос или выбрать другое направление.</p>
              <button
                className="button secondary"
                onClick={() => dispatch(resetFilters())}
                type="button"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
