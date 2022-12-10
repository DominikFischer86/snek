import { useEffect, useState } from "react"

const PREFIX = "snake-app-"

export const useLocalStorage = (key: string, initialValue: any) => {
	const prefixedKey = PREFIX + key
	const [value, setValue] = useState(() => {
		const jsonValue = localStorage.getItem(prefixedKey)
		if (jsonValue != null) return JSON.parse(jsonValue)
		if (typeof initialValue === "function") return initialValue()
		return initialValue
	})

	useEffect(() => {
		localStorage.setItem(prefixedKey, JSON.stringify(value))
	}, [value, prefixedKey])

	return [value, setValue]
}
