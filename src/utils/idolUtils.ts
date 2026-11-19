import type { Idol, MusicDirection } from '../data/mockData';
export type DirectionFilter = 'Все' | MusicDirection;
export function filterIdols(idols: Idol[], query: string, direction: DirectionFilter): Idol[] {
  const normalized = query.trim().toLocaleLowerCase('ru');
  return idols.filter((idol) => {
    const matchesDirection = direction === 'Все' || idol.direction === direction;
    const searchable = [idol.name, idol.nativeName, idol.group, idol.country, idol.role].join(' ').toLocaleLowerCase('ru');
    return matchesDirection && (!normalized || searchable.includes(normalized));
  });
}
export function validateCorrection(input: { name: string; email: string; message: string }): Record<string, string> {
  const errors: Record<string, string> = {};
  if (input.name.trim().length < 2) errors.name = 'Укажите имя (минимум 2 символа).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) errors.email = 'Введите корректный email.';
  if (input.message.trim().length < 10) errors.message = 'Опишите исправление подробнее (минимум 10 символов).';
  return errors;
}
