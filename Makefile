.PHONY: dev dev-client dev-admin dev-umpire build lint check-fix type-check install format storybook storybook-client storybook-admin storybook-umpire build-storybook

# Load nvm and run all apps in parallel via Turborepo
dev:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm dev

# Run dev server for the client app only
dev-client:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm --filter client dev

# Run dev server for the admin app only
dev-admin:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm --filter admin dev

# Run dev server for the umpire app only
dev-umpire:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm --filter umpire dev

# Install all workspace dependencies
install:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm install

# Build all apps
build:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm build

# Lint all apps and packages
lint:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm lint

# Auto-fix safe lint/format issues across all apps via Biome
check-fix:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm --filter client check:fix && pnpm --filter admin check:fix && pnpm --filter umpire check:fix

# Format and auto-fix all files in apps/ via Biome
format:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm biome format --write apps/

# TypeScript check across the monorepo
type-check:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm type-check

# Run all Storybooks in parallel (client: 6006, admin: 6007, umpire: 6008)
storybook:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm --filter client storybook & pnpm --filter admin storybook & pnpm --filter umpire storybook & wait

# Run Storybook for the client app (port 6006)
storybook-client:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm --filter client storybook

# Run Storybook for the admin app (port 6007)
storybook-admin:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm --filter admin storybook

# Run Storybook for the umpire app (port 6008)
storybook-umpire:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm --filter umpire storybook

# Build Storybook for all apps
build-storybook:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm --filter client build-storybook && pnpm --filter admin build-storybook && pnpm --filter umpire build-storybook
