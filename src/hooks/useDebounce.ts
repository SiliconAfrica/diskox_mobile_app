import React from 'react'

function useDebounce<T>(value: T, delay = 1000) {
    const [debounceValue, setDebouncedValue] = React.useState<T>(value);
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay)

        return () => clearTimeout(timeout);
    }, [value, delay])
  return debounceValue;
}

export default useDebounce;