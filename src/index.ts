import * as core from "@actions/core"
import * as exec from "@actions/exec"

main()

async function main() {
	try {
		const production = inputs.boolean("production")
		const cwd = inputs.string("working-directory")

		if (production) {
			core.info("building for production...")
		} else {
			core.info("building...")
		}

		await build({ cwd, production })
	} catch (err) {
		if (err instanceof Error) {
			core.setFailed(err.message)
			return
		}
		core.setFailed("unknown error")
	}
}

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

const inputs = {
	string(name: string) {
		return core.getInput(name)
	},
	boolean(name: string) {
		const value = core.getInput(name)
		return value === "true" || value === "1"
	},
}
