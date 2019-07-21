workflow "Create an issue" {
  resolves = ["Create Issue From File"]
  on = "issue_comment"
}

action "Event data" {
  uses = "ludeeus/action-eventdata@master"
}

action "test command" {
  needs = "Event data"
  uses = "dschep/filter-event-action@master"
  args = "comment.body == '/test'"
}

action "Create Issue From File" {
  needs = "test command"
  uses = "./"
  secrets = ["GITHUB_TOKEN"]
  env = {
    ISSUE_TITLE = "An example issue"
    ISSUE_CONTENT_FILEPATH = "./example-content/output.md"
    ISSUE_LABELS = "report, automated issue"
    ISSUE_ASSIGNEES = "peter-evans"
  }
}
