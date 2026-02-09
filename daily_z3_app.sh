#!/bin/bash

# === CONFIGURATION ===

INTERVAL_MINUTES=30

MODEL="xai/grok-code-fast-1"

REPO_DIR="/Users/velocityworks/IdeaProjects/three-body-problem"
PROMPT_FILE="$REPO_DIR/prompts/z3-app.md"

BRANCH="main"   # change to "master" if your default branch is master

# =====================

export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"

LOG_DIR="$HOME/logs"
mkdir -p "$LOG_DIR"

while true; do
  LOGFILE="$LOG_DIR/z3-app-$(date +%Y-%m-%d).log"

  echo "=== Run started: $(date) ===" | tee -a "$LOGFILE"

  # Make sure we are in the repo directory
  cd "$REPO_DIR" || {
    echo "ERROR: Cannot cd into $REPO_DIR" | tee -a "$LOGFILE"
    exit 1
  }

  # Pull latest changes (optional, in case you or other tools push changes)
  # Comment out if you prefer purely local iteration.
  if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Git repo detected, pulling latest from origin/$BRANCH..." | tee -a "$LOGFILE"
    git pull origin "$BRANCH" 2>&1 | tee -a "$LOGFILE"
  fi

  # Run the coding agent with the app prompt
  if [ -f "$PROMPT_FILE" ]; then
    opencode run --model "$MODEL" "$(cat "$PROMPT_FILE")" 2>&1 | tee -a "$LOGFILE"
  else
    echo "ERROR: Prompt file not found at $PROMPT_FILE" | tee -a "$LOGFILE"
    exit 1
  fi

  echo "=== Agent run finished: $(date) ===" | tee -a "$LOGFILE"

  # Check if there are changes to commit
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Changes detected, committing..." | tee -a "$LOGFILE"

    git add . 2>&1 | tee -a "$LOGFILE"

    COMMIT_MSG="chore: incremental z3 app update ($(date +%Y-%m-%dT%H:%M:%S))"
    git commit -m "$COMMIT_MSG" 2>&1 | tee -a "$LOGFILE" || {
      echo "No changes to commit or commit failed." | tee -a "$LOGFILE"
    }

    # Ensure remote exists; if not, create with gh
    if ! git remote get-url origin > /dev/null 2>&1; then
      echo "No 'origin' remote found, creating GitHub repo with gh..." | tee -a "$LOGFILE"
      gh repo create "zfifteen/three-body-problem" --source="$REPO_DIR" --public --push 2>&1 | tee -a "$LOGFILE"
    else
      echo "Pushing to origin/$BRANCH..." | tee -a "$LOGFILE"
      git push origin "$BRANCH" 2>&1 | tee -a "$LOGFILE"
    fi
  else
    echo "No changes detected; nothing to commit." | tee -a "$LOGFILE"
  fi

  # Calculate seconds until the next aligned interval boundary
  CURRENT_MIN=$(date +%M | sed 's/^0//')
  CURRENT_SEC=$(date +%S | sed 's/^0//')

  MINS_INTO_INTERVAL=$(( CURRENT_MIN % INTERVAL_MINUTES ))
  MINS_LEFT=$(( INTERVAL_MINUTES - MINS_INTO_INTERVAL ))
  SECS_LEFT=$(( (MINS_LEFT * 60) - CURRENT_SEC ))

  if [ "$SECS_LEFT" -le 0 ]; then
    SECS_LEFT=$(( INTERVAL_MINUTES * 60 ))
  fi

  echo "Sleeping ${SECS_LEFT}s until next ${INTERVAL_MINUTES}-minute mark..." | tee -a "$LOGFILE"
  sleep "$SECS_LEFT"
done
