.PHONY: dev build lint type-check install

# Load nvm and run all apps in parallel via Turborepo
dev:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm dev

# Install all workspace dependencies
install:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm install

# Build all apps
build:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm build

# Lint all apps and packages
lint:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm lint

# TypeScript check across the monorepo
type-check:
	@. ${HOME}/.nvm/nvm.sh && nvm use && pnpm type-check
