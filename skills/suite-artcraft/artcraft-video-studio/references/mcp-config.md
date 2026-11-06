# Registering the ArtCraft MCP servers

## Build the CLIs (each repo under github.com/storytold)
```bash
# Rust stable: https://rustup.rs  (Windows: rustup-init.exe, plus the "Desktop development with C++" build tools)
git clone https://github.com/storytold/filmcraft   && cd filmcraft   && cargo build --release -p filmcraft-cli   && cd ..
git clone https://github.com/storytold/effectcraft && cd effectcraft && cargo build --release -p effectcraft-cli && cd ..
git clone https://github.com/storytold/vectorcraft && cd vectorcraft && cargo install --path apps/vectorcraft-cli --locked && cd ..
git clone https://github.com/storytold/photocraft  && cd photocraft  && cargo install --path apps/photocraft-cli --locked && cd ..
git clone https://github.com/storytold/soundcraft  && cd soundcraft  && cargo build --release -p soundcraft-cli  && cd ..
```
Builds take a while (several minutes per app) and need a few GB of disk. Build only the apps your video type needs
(see `pipeline-por-tipo.md`). Check that each repo and CLI name still exists; this suite moves fast.

## `.mcp.json` (project root, Claude Code)
```json
{
  "mcpServers": {
    "filmcraft":   { "command": "C:/craft/filmcraft/target/release/filmcraft-cli.exe",     "args": ["mcp", "--project", "C:/proyecto/video.fcproj"] },
    "effectcraft": { "command": "C:/craft/effectcraft/target/release/effectcraft-cli.exe", "args": ["mcp", "--autosave"] },
    "vectorcraft": { "command": "vectorcraft-cli", "args": ["mcp"] },
    "photocraft":  { "command": "photocraft-cli",  "args": ["mcp", "--automation-read-root", "C:/proyecto", "--automation-write-root", "C:/proyecto/exports"] },
    "soundcraft":  { "command": "C:/craft/soundcraft/target/release/soundcraft-cli.exe",   "args": ["mcp"] }
  }
}
```
- macOS/Linux: drop `.exe` and use `~/craft/...` paths.
- `cargo install` puts binaries on PATH (`~/.cargo/bin`). `cargo build` leaves them in `target/release/`.
- **Bridge mode** (drive the open window): start the app with its control port, e.g.
  `filmcraft --control 9876`, then use `"args": ["mcp", "--bridge", "127.0.0.1:9876"]`. The control token must be
  in the environment, as the app documents. VectorCraft and LightCraft use `--connect 127.0.0.1:<port>`.
- PhotoCraft and EffectCraft confine file access to the folders passed as automation read/write roots. Point them
  at the project folder.

## Smoke test after restarting the agent
1. FilmCraft: call `command_list` with a filter like `export` and `project_inspect`. An empty project is fine.
2. EffectCraft: `info` (version, mode, counts).
3. Render something trivial (a frame or a 1 s comp) and open the PNG/MP4.

If a server does not start, run its command by hand in a terminal. The error is usually a wrong path, a missing
build, or an unknown flag for that version (`<app>-cli mcp --help`).
