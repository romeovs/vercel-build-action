import * as core from "@actions/core"
import * as exec from "@actions/exec"

import * as inputs from "./inputs"
import { run } from "./run"

run(async function main() {
	const production = inputs.boolean("production")
	const cwd = inputs.string("working-directory")
	const token = inputs.string("vercel-token", true)

	if (production) {
		core.info("Building for production...")
	} else {
		core.info("Building for development...")
	}

	await build({ cwd, production, token })
})

type BuildOptions = {
	cwd: string
	production: boolean
	token: string
}

async function build(options: BuildOptions) {
	const { production, cwd, token } = options

	const args: string[] = ["build", "--token", token]
	if (production) {
		args.push("--prod")
	}

	await exec.exec("vercel", args, { cwd })
}
