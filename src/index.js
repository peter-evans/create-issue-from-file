const { inspect } = require("util");
const isDocker = require("is-docker");
const core = require("@actions/core");
const exec = require("@actions/exec");
const setupPython = require("./setup-python");

async function run() {
  try {
    // Allows ncc to find assets to be included in the distribution
    const ciff = __dirname + "/ciff";
    core.debug(`ciff: ${ciff}`);

    // Determine how to access python and pip
    const { pip, python } = (function() {
      if (isDocker()) {
        core.info("Running inside a Docker container");
        // Python 3 assumed to be installed and on the PATH
        return {
          pip: "pip3",
          python: "python3"
        };
      } else {
        // Setup Python from the tool cache
        setupPython("3.x", "x64");
        return {
          pip: "pip",
          python: "python"
        };
      }
    })();

    // Install requirements
    await exec.exec(pip, [
      "install",
      "--requirement",
      `${ciff}/requirements.txt`,
      "--no-index",
      `--find-links=${__dirname}/vendor`
    ]);

    // Fetch action inputs
    const inputs = {
      token: core.getInput("token"),
      issueNumber: core.getInput("issue-number"),
      title: core.getInput("title"),
      contentFilepath: core.getInput("content-filepath"),
      labels: core.getInput("labels"),
      assignees: core.getInput("assignees"),
      project: core.getInput("project"),
      projectColumn: core.getInput("project-column")
    };
    core.debug(`Inputs: ${inspect(inputs)}`);

    // Set environment variables from inputs.
    if (inputs.token) process.env.GITHUB_TOKEN = inputs.token;
    if (inputs.issueNumber) process.env.CIFF_ISSUE_NUMBER = inputs.issueNumber;
    if (inputs.title) process.env.CIFF_TITLE = inputs.title;
    if (inputs.contentFilepath) process.env.CIFF_CONTENT_FILEPATH = inputs.contentFilepath;
    if (inputs.labels) process.env.CIFF_LABELS = inputs.labels;
    if (inputs.assignees) process.env.CIFF_ASSIGNEES = inputs.assignees;
    if (inputs.project) process.env.CIFF_PROJECT_NAME = inputs.project;
    if (inputs.projectColumn) process.env.CIFF_PROJECT_COLUMN_NAME = inputs.projectColumn;

    // Execute create issue from file
    await exec.exec(python, [`${ciff}/create_issue_from_file.py`]);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
