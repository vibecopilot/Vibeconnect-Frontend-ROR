import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const ThemeChanger = () => {
    const [theme, setTheme] = useState('light')
     useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const initialTheme = savedTheme || 'light'
    setTheme(initialTheme)
    document.documentElement.classList.toggle('dark', initialTheme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }
  return (
     <button
      onClick={toggleTheme}
      className="p-2 max-w-10 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  )
}

export default ThemeChanger
