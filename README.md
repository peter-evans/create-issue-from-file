# Create Issue From File

A GitHub action to create an issue using content from a file.

This is useful to pair with other actions that output to a file. This action will create an issue if a file exists at a specified path. If the file does not exist the action exits silently.

## Usage

```hcl
action "Create Issue From File" {
  uses = "peter-evans/create-issue-from-file@v1.0.0"
  secrets = ["GITHUB_TOKEN"]
  env = {
    ISSUE_TITLE = "An example issue"
    ISSUE_CONTENT_FILEPATH = "./example-content/output.md"
    ISSUE_LABELS = "report, automated issue"
    ISSUE_ASSIGNEES = "peter-evans"
  }
}
```

#### Environment variables

- `ISSUE_TITLE` (**required**) - A title for the issue
- `ISSUE_CONTENT_FILEPATH` (**required**) - The file path to the issue content
- `ISSUE_LABELS` - A comma separated list of labels to apply
- `ISSUE_ASSIGNEES` - A comma separated list of assignees

## License

MIT License - see the [LICENSE](LICENSE) file for details
