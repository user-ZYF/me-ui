# Me UI

A Vue 3 UI component library built with TypeScript.

## Tech Stack

- Vue 3 + Composition API
- TypeScript
- Vite
- Less

## Install

```bash
npm install @zyf_dsb/me-ui
# or
pnpm add @zyf_dsb/me-ui
```

Requires Vue `^3.3.0`. Peer dependencies (`lodash`, `async-validator`, `uuid`, `@vueuse/core`, `@element-plus/icons-vue`, `js-easing-functions`) are auto-installed by npm 7+ / pnpm.

## Usage

Styles are automatically injected — no manual CSS import needed.

Full import:

```ts
import { createApp } from 'vue';
import MeUI from '@zyf_dsb/me-ui';

const app = createApp(App);
app.use(MeUI);
```

On-demand import:

```ts
import { MeButton } from '@zyf_dsb/me-ui/button';

app.use(MeButton);
```

## Components

- Button
- Checkbox / CheckboxGroup
- ConfigProvider
- Form / FormItem
- Icon
- Input
- Modal
- Pagination
- Radio / RadioButton / RadioGroup
- Select
- Scrollbar
- Table / TableColumn
- Tag
- Tooltip
- Tree
- VirtualList

## Development

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

## License

MIT
