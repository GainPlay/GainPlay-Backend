# Project Title

Short description on the project

## Project Description

Long description, technologies, challanges

## How to Install and Run the Project

Ensure you have Bun installed. Use the following command to install dependencies:

```bash
bun install
```

## Projects standards

### branches

WIP

### commits

We think [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) are great standard for commit messages
You can look in this [artice](https://gist.github.com/levibostian/71afa00ddc69688afebb215faab48fd7#why) if you want to learn more about conventional commits and understand why they are great...

[Conventional Commits Types](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type)

* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **test**: Adding missing tests or correcting existing tests
* **chore**: Indicates performing routine tasks

## Logs

### Usage

```typescript
import { logger } from "src/common/helpers/logs";

logger.info("info message", { name: "info log name", filters: { age: 24, height: 160 } });
logger.error("error", { example: "example", name: { age: 5 } });

```

### Exception Filters

When you want to throw an exception to the user you don't need to write a log beffor throwing the exception,
beacuse the http filter will already write a log to the exception.

```typescript
    throw new UnauthorizedException("user unauth", {
      cause: { token: "example", roles: { example: "example" } },
    });

```

If you want add custome fileds to the exception you can do this in the cause field
