#!/bin/sh

YELLOW=$(tput setaf 3);
CYAN=$(tput setaf 6);
NC=$(tput sgr0); # No Color

function changed {
  git diff --name-only HEAD@{1} HEAD | grep "^$1" > /dev/null 2>&1
  FILE=$1
}

if changed 'src/orbital-designer/package-lock.json'; then
  LINE1="📦  ${CYAN}${FILE}${NC} has changed."
  LINE2="Run 'npm install' to update your dependencies."

  L1_COLOR_LEN=$((${#CYAN} + ${#NC}))
  L1_OFFSET=$((2 + $L1_COLOR_LEN)) # +2 to offset pad consumption of 📦
  LEN1=$((${#LINE1} + 1 - $L1_COLOR_LEN)) # +1 to offset display of 📦
  LEN2=${#LINE2}
  if [ "$LEN1" -ge "$LEN2" ]; then WIDTH="$LEN1"; else WIDTH="$LEN2"; fi;

  MARK="#"
  MARK_LINE=$(printf '%*s' $((WIDTH + 8)))
  MARK_LINE=${MARK_LINE// /${MARK}}

  echo ""
  echo "${YELLOW}${MARK_LINE}"
  printf "${MARK}   %-${WIDTH}s   ${MARK}\n" ""
  printf "${MARK}   %-$((${WIDTH} + ${L1_OFFSET}))s   ${YELLOW}${MARK}\n" "$LINE1"
  printf "${MARK}   ${NC}%-${WIDTH}s   ${YELLOW}${MARK}\n" "$LINE2"
  printf "${MARK}   %-${WIDTH}s   ${MARK}\n" ""
  echo "${MARK_LINE}${NC}"
  echo ""
fi

exit 0
