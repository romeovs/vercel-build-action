import * as core from "@actions/core"
import * as exec from "@actions/exec"

import * as inputs from "./inputs"
import { run } from "./run"

run(async function main() {
	const production = inputs.boolean("production")
	const cwd = inputs.string("working-directory")

	if (production) {
		core.info("building for production...")
	} else {
		core.info("building...")
	}

	await build({ cwd, production })
})

type BuildOptions = {
	cwd: string
	production: boolean
}

async function build(options: BuildOptions) {
	const { production, cwd } = options

	const args: string[] = []
	if (production) {
		args.push("--prod")
	}

	function write(data: Buffer) {
		const str = data.toString()
		core.info(str)
	}

	await exec.exec("vercel", args, {
		cwd,
		listeners: {
			stdout: write,
			stderr: write,
		},
	})
}
