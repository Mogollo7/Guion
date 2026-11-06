#!/usr/bin/env bash
# Instala suites y tema en ~/.claude/skills (Claude Code).
#   bash skills/install.sh codigo artcraft tema-personalizado/grupo34-pitb-antioquia
#   DEST=~/.agents/skills bash skills/install.sh codigo     (otros agentes con estándar SKILL.md)
set -eu
HERE="$(cd "$(dirname "$0")" && pwd)"
DEST="${DEST:-$HOME/.claude/skills}"
mkdir -p "$DEST"
[ $# -eq 0 ] && { echo "uso: install.sh codigo|artcraft|tema-personalizado/<tema> ..."; exit 1; }
for item in "$@"; do
  case "$item" in
    codigo|suite-codigo) src="$HERE/suite-codigo" ;;
    artcraft|suite-artcraft) src="$HERE/suite-artcraft" ;;
    *) src="$HERE/$item" ;;
  esac
  if [ -f "$src/SKILL.md" ]; then
    dirs="$src"
  else
    dirs=$(find "$src" -mindepth 1 -maxdepth 1 -type d ! -name '_*' ! -name '*-workspace')
  fi
  for d in $dirs; do
    [ -f "$d/SKILL.md" ] || continue
    name=$(basename "$d")
    rm -rf "${DEST:?}/$name"
    mkdir -p "$DEST/$name"
    (cd "$d" && tar --exclude='./evals' -cf - .) | (cd "$DEST/$name" && tar -xf -)
    echo "✓ $name → $DEST/$name"
  done
done
echo "Reinicia tu agente para que cargue las skills."
