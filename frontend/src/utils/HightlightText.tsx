import { CompareViewStore } from '../store/CompareViewStore';

export function HighlightText(text: string) {
  const query = CompareViewStore.getState().searchQuery;
  if (query.length === 0) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? <mark key={index}>{part}</mark> : part,
  );
}
