import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fs from 'fs'
import * as util from 'util'
import * as utils from './utils'
import {inspect} from 'util'

async function run(): Promise<void> {
  try {
    const inputs = {
      token: core.getInput('token'),
      repository: core.getInput('repository'),
      issueNumber: Number(core.getInput('issue-number')),
      title: core.getInput('title'),
      contentFilepath: core.getInput('content-filepath'),
      labels: utils.getInputAsArray('labels'),
      assignees: utils.getInputAsArray('assignees'),
      updateExisting: core.getBooleanInput('update-existing')
    }
    core.debug(`Inputs: ${inspect(inputs)}`)

    const [owner, repo] = inputs.repository.split('/')
    core.debug(`Repo: ${inspect(repo)}`)

    const octokit = github.getOctokit(inputs.token)

    // Check the file exists
    if (await util.promisify(fs.exists)(inputs.contentFilepath)) {
      // Fetch the file content
      const fileContent = await fs.promises.readFile(inputs.contentFilepath, {
        encoding: 'utf8'
      })

      const issueNumber = await (async (): Promise<number> => {
        if (inputs.issueNumber) {
          // Update an existing issue
          await octokit.rest.issues.update({
            owner: owner,
            repo: repo,
            issue_number: inputs.issueNumber,
            title: inputs.title,
            body: fileContent
          })
          core.info(`Updated issue #${inputs.issueNumber}`)
          return inputs.issueNumber
        } else {
          // Check if issue with same title exists
          let existingIssue
          if (inputs.updateExisting) {
            core.info(`Fetching issues with title "${inputs.title}"`)
            try {
              const existingIssues = await octokit.rest.search.issuesAndPullRequests({
                q: `${inputs.title} in:title repo:${inputs.repository} is:issue is:open`
              })
              existingIssue = existingIssues.data.items.find(issue => issue.title === inputs.title)
            } catch (err) {
              core.error("Failed to search issues")
              core.setFailed(err)
            }
            if (existingIssue) {
              try {
                await octokit.rest.issues.update({
                  owner,
                  repo,
                  issue_number: existingIssue.number,
                  body: fileContent
                })
                core.info(`Updated issue #${existingIssue.number}`)
              } catch (err) {
                core.error("Failed to update issue #" + existingIssue.number)
                core.setFailed(err)
              }
            } else {
              core.info(`Existing issue of title ${inputs.title} not found`)
            }
          }

          if (!existingIssue || !inputs.updateExisting) {
            const {data: issue} = await octokit.rest.issues.create({
              owner: owner,
              repo: repo,
              title: inputs.title,
              body: fileContent
            })
            core.info(`Created issue #${issue.number}`)
            return issue.number
          } else {
            return existingIssue.number
          }
        }
      })()

      // Apply labels
      if (inputs.labels.length > 0) {
        core.info(`Applying labels '${inputs.labels}'`)
        await octokit.rest.issues.addLabels({
          owner: owner,
          repo: repo,
          issue_number: issueNumber,
          labels: inputs.labels
        })
      }
      // Apply assignees
      if (inputs.assignees.length > 0) {
        core.info(`Applying assignees '${inputs.assignees}'`)
        await octokit.rest.issues.addAssignees({
          owner: owner,
          repo: repo,
          issue_number: issueNumber,
          assignees: inputs.assignees
        })
      }

      // Set output
      core.setOutput('issue-number', issueNumber)
    } else {
      core.info(`File not found at path '${inputs.contentFilepath}'`)
    }
  } catch (error) {
    core.debug(inspect(error))
    core.setFailed(error.message)
  }
}

run()
