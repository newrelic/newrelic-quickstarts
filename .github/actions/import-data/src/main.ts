import * as core from '@actions/core'
import {importer} from './importer'

async function run(): Promise<void> {
  try {
    const accountId = (core.getInput('nr-account-id') as unknown) as number
    const nrApiKey = core.getInput('nr-api-key')
    const pack = core.getInput('pack-to-import')

    importer(accountId, nrApiKey, pack)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
