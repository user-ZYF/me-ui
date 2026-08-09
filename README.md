# Me UI

A Vue 3 UI component library.

## Tech Stack

- Vue 3 + Composition API
- TypeScript
- Vite
- Less

## Getting Started

```bash
# Install dependencies
pnpm install

# Start playground for development
pnpm dev

# Build library
pnpm build

# Run tests
pnpm test:run
```

## Usage

```ts
import { createApp } from 'vue';
import MeUI from 'me-ui';
import 'me-ui/styles';

const app = createApp(App);
app.use(MeUI);
```

## Components

- [x] Button

## License

MIT
