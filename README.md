# Create Issue From File
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Create%20Issue%20From%20File-blue.svg?colorA=24292e&colorB=0366d6&style=flat&longCache=true&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAM6wAADOsB5dZE0gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAERSURBVCiRhZG/SsMxFEZPfsVJ61jbxaF0cRQRcRJ9hlYn30IHN/+9iquDCOIsblIrOjqKgy5aKoJQj4O3EEtbPwhJbr6Te28CmdSKeqzeqr0YbfVIrTBKakvtOl5dtTkK+v4HfA9PEyBFCY9AGVgCBLaBp1jPAyfAJ/AAdIEG0dNAiyP7+K1qIfMdonZic6+WJoBJvQlvuwDqcXadUuqPA1NKAlexbRTAIMvMOCjTbMwl1LtI/6KWJ5Q6rT6Ht1MA58AX8Apcqqt5r2qhrgAXQC3CZ6i1+KMd9TRu3MvA3aH/fFPnBodb6oe6HM8+lYHrGdRXW8M9bMZtPXUji69lmf5Cmamq7quNLFZXD9Rq7v0Bpc1o/tp0fisAAAAASUVORK5CYII=)](https://github.com/marketplace/actions/create-issue-from-file)

A GitHub action to create an issue using content from a file.

This is designed to be used in conjunction with other actions that output to a file.
Especially if that output can be formatted as [GitHub flavoured Markdown](https://help.github.com/en/articles/basic-writing-and-formatting-syntax).
This action will create an issue if a file exists at a specified path.
The content of the issue will be taken from the file as-is.
If the file does not exist the action exits silently.

## Usage

```yml
    - name: Create Issue From File
      uses: peter-evans/create-issue-from-file@v1.0.1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        ISSUE_TITLE: An example issue
        ISSUE_CONTENT_FILEPATH: ./example-content/output.md
        ISSUE_LABELS: report, automated issue
```

#### Environment variables

- `ISSUE_TITLE` (**required**) - A title for the issue
- `ISSUE_CONTENT_FILEPATH` (**required**) - The file path to the issue content
- `ISSUE_LABELS` - A comma separated list of labels to apply
- `ISSUE_ASSIGNEES` - A comma separated list of assignees (GitHub usernames)

## Actions that pair with this action

- [Link Checker](https://github.com/peter-evans/link-checker) - An action for link checking repository Markdown and HTML files

## License

MIT License - see the [LICENSE](LICENSE) file for details
