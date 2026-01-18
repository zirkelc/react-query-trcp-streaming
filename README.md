# tRPC Streaming Examples

A collection of examples demonstrating **resumable streaming** patterns with tRPC v11.

## Examples

### [Plain tRPC + React Query](src/examples/plain-trpc-react-query/)

Basic resumable streaming with tRPC and TanStack Query.

- In-memory message storage
- Polling-based resume (compares word counts)
- Manual interrupt/resume controls
- Background task persistence via stream tee

### [AI SDK + tRPC](src/examples/ai-sdk-trpc/)

Advanced streaming with Vercel AI SDK integration.

- `@ai-sdk/react` useChat hook with standardized `UIMessage` format
- Custom `ChatTransport` implementation for tRPC
- Redis-backed stream persistence via `resumable-stream`
- SSE serialization for reliable resume
- Auto-resume on page load

## Quick Start

```bash
# Install dependencies
pnpm install

# Run an example (see individual READMEs for details)
cd src/examples/plain-trpc-react-query
pnpm dev:server  # Terminal 1
pnpm dev:client  # Terminal 2
```

## Project Structure

```
├── src/
│   ├── shared/
│   │   └── utils.ts              # Shared utilities (generateId)
│   └── examples/
│       ├── plain-trpc-react-query/  # Plain tRPC + React Query example
│       └── ai-sdk-trpc/             # AI SDK + tRPC example
└── package.json
```

## License

MIT
