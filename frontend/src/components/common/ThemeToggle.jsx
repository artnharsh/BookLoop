import { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      className="group relative inline-flex h-12 w-24 items-center rounded-full border border-black/10 bg-white/80 p-1 shadow-lg shadow-black/5 backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.02] dark:border-white/10 dark:bg-black/40 dark:shadow-black/20"
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-amber-200/70 to-sky-200/70 opacity-100 transition-opacity duration-300 dark:from-slate-700 dark:to-slate-900" />

      <span className={`pointer-events-none absolute left-1 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition-transform duration-300 ease-out will-change-transform dark:bg-slate-900 dark:text-amber-300 ${isDark ? 'translate-x-12' : 'translate-x-0'}`}>
        <svg
          className={`h-5 w-5 transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-90 -rotate-90 scale-75'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isDark ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
          )}
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;