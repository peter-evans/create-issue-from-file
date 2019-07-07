workflow "Create an issue" {
  resolves = ["Create Issue From File"]
  on = "push"
}

action "Create Issue From File" {
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  env = {
    ISSUE_TITLE = "An example issue"
    ISSUE_CONTENT_FILEPATH = "./example-content/output.md"
    ISSUE_LABELS = "report, automated issue"
    ISSUE_ASSIGNEES = "peter-evans"
  }
}
