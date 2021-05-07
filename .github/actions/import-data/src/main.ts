import * as core from '@actions/core'

async function run(): Promise<void> {
  try {

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
