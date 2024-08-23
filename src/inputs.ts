import * as core from "@actions/core"

export function string(name: string) {
	return core.getInput(name)
}

export function boolean(name: string) {
	const value = core.getInput(name)
	return value === "true" || value === "1"
}
