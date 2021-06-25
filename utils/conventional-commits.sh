#!/bin/bash

RED='\033[0;31m'
RESET='\033[0m'
UNDERLINE='\033[4m'

REGEX="^(revert|feat|fix|ci|chore|docs|test|style|refactor)(\(.+?\))?:.{1,}$"
IFS=$'\n'
commits=( $(git log origin..HEAD --pretty=format:%s | awk '{print $0}') )

badCommitsExist=false
for i in "${commits[@]}"; do
  if ! echo "$i" | grep -qE $REGEX; then
    badCommitsExist=true
    echo -e "${RED}Commit message invalid: please use conventional commits${RESET}"
    echo -e "${RED}\t -> ${i}${RESET}"
  fi
done

if $badCommitsExist; then
  echo -e "See ${UNDERLINE}https://www.conventionalcommits.org/en/v1.0.0/#specification${RESET} for more information"
  exit 1;
fi
