#!/usr/bin/env node

import * as p from "@clack/prompts";
import { execSync, spawnSync } from "child_process";
import { existsSync, copyFileSync, writeFileSync } from "fs";
import { join } from "path";

const ORANGE = "\x1b[38;2;255;84;84m";
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";

const REPO_URL = "https://github.com/mashdotdev/saas-starter-kit.git";

console.log(`
${ORANGE}${BOLD}  ╔═══════════════════════════════════╗
  ║   AI SaaS Starter Kit             ║
  ║   by mashdotdev                   ║
  ╚═══════════════════════════════════╝${RESET}
${DIM}  Ship your AI SaaS in days, not months${RESET}
`);

p.intro(`${ORANGE}${BOLD}create-ai-saas${RESET}`);

// Get project name from CLI arg or prompt
const argName = process.argv[2];

const answers = await p.group(
  {
    name: () =>
      argName
        ? Promise.resolve(argName)
        : p.text({
            message: "Project name",
            placeholder: "my-ai-saas",
            defaultValue: "my-ai-saas",
            validate: (v) => {
              if (!v) return "Name is required";
              if (!/^[a-z0-9-_]+$/.test(v))
                return "Only lowercase letters, numbers, hyphens and underscores";
            },
          }),

    tier: () =>
      p.select({
        message: "Which tier?",
        options: [
          {
            value: "free",
            label: "Community (free)",
            hint: "MIT licensed — full source code on GitHub",
          },
          {
            value: "pro",
            label: "Pro ($249 one-time)",
            hint: "Multi-tenancy, RBAC, RAG, usage billing",
          },
        ],
      }),
  },
  {
    onCancel: () => {
      p.cancel("Cancelled.");
      process.exit(0);
    },
  },
);

if (answers.tier === "pro") {
  p.note(
    `Purchase at: ${ORANGE}https://mashdotdev.gumroad.com/l/ai-saas-pro${RESET}\n` +
      `After purchase you will receive access to the private pro branch.`,
    "Pro tier",
  );
  p.outro("Come back after purchase to scaffold the Pro template!");
  process.exit(0);
}

const projectName = answers.name;
const projectPath = join(process.cwd(), projectName);

// Clone
const cloneSpinner = p.spinner();
cloneSpinner.start(`Cloning repository into ${BOLD}${projectName}${RESET}`);

const clone = spawnSync("git", ["clone", "--depth=1", REPO_URL, projectName], {
  stdio: "pipe",
  encoding: "utf8",
});

if (clone.status !== 0) {
  cloneSpinner.stop("Clone failed");
  p.cancel(clone.stderr?.trim() ?? "git clone failed. Is git installed?");
  process.exit(1);
}
cloneSpinner.stop(`Repository cloned`);

// Copy .env.example → apps/web/.env.local
const envExample = join(projectPath, "apps", "web", ".env.example");
const envLocal = join(projectPath, "apps", "web", ".env.local");

if (existsSync(envExample)) {
  copyFileSync(envExample, envLocal);
} else {
  // Create a minimal blank .env.local so the app doesn't crash
  writeFileSync(
    envLocal,
    [
      "# Fill in your secrets — see README.md for full list",
      "DATABASE_URL=",
      "DIRECT_URL=",
      "BETTER_AUTH_SECRET=",
      "NEXT_PUBLIC_APP_URL=http://localhost:3000",
    ].join("\n") + "\n",
  );
}

// Install dependencies
const installSpinner = p.spinner();
installSpinner.start("Installing dependencies");

const hasBun = spawnSync("bun", ["--version"], { stdio: "pipe" }).status === 0;
const pm = hasBun ? "bun" : "npm";
const installArgs = hasBun ? ["install"] : ["install", "--legacy-peer-deps"];

const install = spawnSync(pm, installArgs, {
  cwd: projectPath,
  stdio: "pipe",
  encoding: "utf8",
});

if (install.status !== 0) {
  installSpinner.stop("Install failed");
  p.cancel(
    install.stderr?.trim() ?? `${pm} install failed. Check the error above.`,
  );
  process.exit(1);
}
installSpinner.stop(`Dependencies installed via ${pm}`);

// Done
p.note(
  [
    `${GREEN}cd ${projectName}${RESET}`,
    `${DIM}# Fill in your secrets:${RESET}`,
    `${GREEN}code apps/web/.env.local${RESET}`,
    `${DIM}# Push the database schema:${RESET}`,
    `${GREEN}cd packages/db && bun run db:push${RESET}`,
    `${DIM}# Start the dev server:${RESET}`,
    `${GREEN}cd ../.. && bun dev${RESET}`,
  ].join("\n"),
  "Next steps",
);

p.outro(
  `${ORANGE}${BOLD}Done!${RESET} Built something cool? Star us on GitHub ⭐\n` +
    `  ${DIM}https://github.com/mashdotdev/saas-starter-kit${RESET}`,
);
