FROM python:3.7.3

LABEL maintainer="Peter Evans <mail@peterevans.dev>"
LABEL repository="https://github.com/peter-evans/create-issue-from-file"
LABEL homepage="https://github.com/peter-evans/create-issue-from-file"

LABEL com.github.actions.name="Create Issue From File"
LABEL com.github.actions.description="An action to create an issue using content from a file"
LABEL com.github.actions.icon="alert-circle"
LABEL com.github.actions.color="orange"

COPY LICENSE README.md /

COPY requirements.txt /tmp/
RUN pip install --requirement /tmp/requirements.txt

COPY create-issue-from-file.py /create-issue-from-file.py
ENTRYPOINT [ "/create-issue-from-file.py" ]
