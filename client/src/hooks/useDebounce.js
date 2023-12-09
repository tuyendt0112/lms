import { useEffect, useState } from 'react'

const useDebounce = (value, ms) => {
    const [debounceValue, setdebounceValue] = useState('')
    useEffect(() => {
        const setTimeOutid = setTimeout(() => {
            setdebounceValue(value)
        }, ms)
        return () => {
            clearTimeout(setTimeOutid)
        }
    }, [value, ms])
    return debounceValue
}

export default useDebounce