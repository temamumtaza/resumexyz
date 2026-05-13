#!/bin/bash
# tools/validate.sh
# Run after generating the resume .docx to verify it's valid.
#
# Usage:
#   bash tools/validate.sh /mnt/user-data/outputs/resume_[name].docx
#
# Returns: "All validations PASSED!" on success, or error details on failure.

FILE="${1}"

if [ -z "$FILE" ]; then
  echo "Usage: bash validate.sh <path-to-docx>"
  exit 1
fi

if [ ! -f "$FILE" ]; then
  echo "ERROR: File not found: $FILE"
  exit 1
fi

python /mnt/skills/public/docx/scripts/office/validate.py "$FILE"
