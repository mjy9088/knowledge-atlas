# Show available commands.
default:
    @just --list

# Start a background server: dev (default), studio, or preview (build first).
start server="dev":
    @node --import tsx scripts/server-control.ts start {{quote(server)}}

# Stop only a server started by this controller.
stop server="dev":
    @node --import tsx scripts/server-control.ts stop {{quote(server)}}

# Stop and start the selected server with the current environment.
restart server="dev":
    @node --import tsx scripts/server-control.ts restart {{quote(server)}}

# Show the selected server's managed process and URL.
status server="dev":
    @node --import tsx scripts/server-control.ts status {{quote(server)}}

# Print the last 80 log lines (not a live stream).
logs server="dev":
    @node --import tsx scripts/server-control.ts logs {{quote(server)}}

# Run the existing validated static build.
build:
    pnpm build

# Run the existing full verification suite.
check:
    pnpm check
