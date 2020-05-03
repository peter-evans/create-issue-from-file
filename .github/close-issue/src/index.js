const { inspect } = require("util");
const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const inputs = {
      token: core.getInput("token"),
      repository: core.getInput("repository"),
      issueNumber: core.getInput("issue-number"),
      comment: core.getInput("comment"),
    };
    core.debug(`Inputs: ${inspect(inputs)}`);

    const repo = inputs.repository.split("/");
    core.debug(`Repo: ${inspect(repo)}`);

    const octokit = new github.GitHub(inputs.token);

    if (inputs.comment && inputs.comment.length > 0) {
      core.info("Adding a comment before closing the issue");
      await octokit.issues.createComment({
        owner: repo[0],
        repo: repo[1],
        issue_number: inputs.issueNumber,
        body: inputs.comment,
      });
    }

    core.info("Closing the issue");
    await octokit.issues.update({
      owner: repo[0],
      repo: repo[1],
      issue_number: inputs.issueNumber,
      state: "closed",
    });
  } catch (error) {
    core.debug(inspect(error));
    core.setFailed(error.message);
  }
}

run();
