workflow "Create an issue" {
  resolves = ["Create Issue From File"]
  on = "push"
}

action "Filter test branch" {
  uses = "actions/bin/filter@master"
  args = "branch test"
}

action "Create Issue From File" {
  needs = "Filter test branch"
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  env = {
    ISSUE_TITLE = "An example issue"
    ISSUE_CONTENT_FILEPATH = "./example-content/output.md"
    ISSUE_LABELS = "report, automated issue"
    ISSUE_ASSIGNEES = "peter-evans"
  }
}
