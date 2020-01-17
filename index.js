const { inspect } = require("util");
const core = require("@actions/core");
const exec = require("@actions/exec");
const setupPython = require("./src/setup-python");

async function run() {
  try {
    // Allows ncc to find assets to be included in the distribution
    const src = __dirname + "/src";
    core.debug(`src: ${src}`);

    // Setup Python from the tool cache
    setupPython("3.8.x", "x64");

    // Install requirements
    await exec.exec("pip", [
      "install",
      "--requirement",
      `${src}/requirements.txt`
    ]);

    // Fetch action inputs
    const inputs = {
      token: core.getInput("token"),
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
    if (inputs.title) process.env.CIFF_TITLE = inputs.title;
    if (inputs.contentFilepath) process.env.CIFF_CONTENT_FILEPATH = inputs.contentFilepath;
    if (inputs.labels) process.env.CIFF_LABELS = inputs.labels;
    if (inputs.assignees) process.env.CIFF_ASSIGNEES = inputs.assignees;
    if (inputs.project) process.env.CIFF_PROJECT_NAME = inputs.project;
    if (inputs.projectColumn) process.env.CIFF_PROJECT_COLUMN_NAME = inputs.projectColumn;

    // Execute python script
    await exec.exec("python", [`${src}/create_issue_from_file.py`]);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
