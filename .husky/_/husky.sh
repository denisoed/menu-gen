#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  debug=""

  if [ "$HUSKY_DEBUG" = "1" ]; then
    debug="--debug"
  fi

  command sh -c "husky $debug \"$0\" \"$@\"" husky-sh "$0" "$@"
fi
