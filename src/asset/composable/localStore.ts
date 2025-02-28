import { ref, watch } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const data = ref<T>(getStoredValue())

  // Get data from localStorage, parse it and return it
  // If no data is found or parsing fails, return the default value
  function getStoredValue(): T {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  // Save data to localStorage
  function setStoredValue(value: T): void {
    try {
      if (value === undefined) {
        window.localStorage.removeItem(key)
      } else {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // Watch for changes to the ref and update localStorage
  watch(
    data,
    (newValue) => {
      setStoredValue(newValue)
    },
    { deep: true }
  )

  // Function to manually set the value
  function setValue(value: T): void {
    data.value = value
  }

  // Function to remove this item from localStorage
  function removeItem(): void {
    try {
      window.localStorage.removeItem(key)
      data.value = defaultValue
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  // Function to check if the key exists in localStorage
  function exists(): boolean {
    return window.localStorage.getItem(key) !== null
  }

  return {
    data,
    setValue,
    removeItem,
    exists,
    getStoredValue
  }
}