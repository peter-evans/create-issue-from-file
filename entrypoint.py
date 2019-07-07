'''Create Issue From File'''
from github import Github
from pathlib import Path
import random
import os

# Fetch required environment variables
github_token = os.environ['GITHUB_TOKEN']
github_repository = os.environ['GITHUB_REPOSITORY']
issue_title = os.environ['ISSUE_TITLE']
issue_content_path = os.environ['ISSUE_CONTENT_FILEPATH']

# Fetch optional environment variables
issue_labels = os.environ.get('ISSUE_LABELS')
issue_assignees = os.environ.get('ISSUE_ASSIGNEES')

# If the file does not exist there is no issue to create
if not Path(issue_content_path).is_file():
    print("File not found")
    exit(0)

# Fetch the file content
with open(issue_content_path, 'r') as f:
    issue_content = f.read()

# Fetch the repository object
g = Github(github_token)
repo = g.get_repo(github_repository)
# Create the issue
issue = repo.create_issue(issue_title, issue_content)
print("Created issue %d" % (issue.number))

if issue_labels is not None:
    # Split the labels input into a list
    labels_list = [l.strip() for l in issue_labels.split(',')]
    # Remove empty strings
    labels_list = list(filter(None, labels_list))
    # Apply labels to issue
    print("Applying labels")
    issue.edit(labels=labels_list)

if issue_assignees is not None:
    # Split the assignees input into a list
    assignees_list = [l.strip() for l in issue_assignees.split(',')]
    # Remove empty strings
    assignees_list = list(filter(None, assignees_list))
    # Assign issue
    print("Assigning issue to assignees")
    issue.edit(assignees=assignees_list)
