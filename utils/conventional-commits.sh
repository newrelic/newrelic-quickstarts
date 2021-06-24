#!/bin/sh

RED='\033[0;31m'
RESET='\033[0m'
UNDERLINE='\033[4m'

REGEX="^(revert|feat|fix|ci|chore|docs|test|style|refactor)(\(.+?\))?:.{1,}$"

git log origin..HEAD --pretty=format:%s | awk '$0 ~ /(chore|feat)/ {print $0}'

# if ! head -1 "$1" | grep -qE $REGEX; then
#   echo "${RED}Commit message invalid: please use conventional commits${RESET}"
#   echo "See ${UNDERLINE}https://www.conventionalcommits.org/en/v1.0.0/#specification${RESET} for more information"
#   exit 1;
# fi
