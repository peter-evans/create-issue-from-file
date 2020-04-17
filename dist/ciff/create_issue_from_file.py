#!/usr/bin/env python3
''' Create Issue From File '''
import os
from pathlib import Path
from github import Github, GithubException

# Fetch required environment variables
github_token = os.environ['GITHUB_TOKEN']
github_repository = os.environ['GITHUB_REPOSITORY']
issue_title = os.environ['CIFF_TITLE']
issue_content_path = os.environ['CIFF_CONTENT_FILEPATH']

# Fetch optional environment variables
issue_number = os.environ.get('CIFF_ISSUE_NUMBER')
issue_labels = os.environ.get('CIFF_LABELS')
issue_assignees = os.environ.get('CIFF_ASSIGNEES')
project_name = os.environ.get('CIFF_PROJECT_NAME')
project_column_name = os.environ.get('CIFF_PROJECT_COLUMN_NAME')


def create_project_card(github_repo, project_name, project_column_name, issue):
    # Locate the project by name
    project = None
    for project_item in github_repo.get_projects("all"):
        if project_item.name == project_name:
            project = project_item
            break

    if not project:
        print("::error::Project not found. Unable to create project card.")
        return

    # Locate the column by name
    column = None
    for column_item in project.get_columns():
        if column_item.name == project_column_name:
            column = column_item
            break

    if not column:
        print("::error::Project column not found. Unable to create project card.")
        return

    # Create a project card for the pull request
    column.create_card(content_id=issue.id, content_type="Issue")
    print(
        "Added issue #%d to project '%s' under column '%s'"
        % (issue.number, project.name, column.name)
    )


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

if issue_number is not None:
    # Update an existing issue
    issue = repo.get_issue(int(issue_number))
    issue.edit(title=issue_title, body=issue_content)
    print("Updated issue %d" % (issue.number))
else:
    # Create an issue
    issue = repo.create_issue(title=issue_title, body=issue_content)
    print("Created issue %d" % (issue.number))

# Set the step output
os.system(f"echo ::set-output name=issue-number::{issue.number}")

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

# Create a project card for the pull request
if project_name is not None and project_column_name is not None:
    try:
        create_project_card(
            repo, project_name, project_column_name, issue
        )
    except GithubException as e:
        # Likely caused by "Project already has the associated issue."
        if e.status == 422:
            print(
                "Create project card failed - {}".format(
                    e.data["errors"][0]["message"]
                )
            )
