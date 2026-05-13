import { describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { copyBundledResourceTrees } from "../src/resources.js";

describe("copyBundledResourceTrees", () => {
  it("includes resume workflow resource trees", async () => {
    const root = await mkdtemp(join(tmpdir(), "open-design-tools-pack-"));
    const workspaceRoot = join(root, "workspace");
    const resourceRoot = join(root, "resources");

    try {
      await mkdir(join(workspaceRoot, "skills", "sample"), { recursive: true });
      await mkdir(join(workspaceRoot, "design-templates", "sample"), {
        recursive: true,
      });
      await mkdir(join(workspaceRoot, "design-systems", "sample"), {
        recursive: true,
      });
      await mkdir(join(workspaceRoot, "craft", "sample"), { recursive: true });
      await mkdir(join(workspaceRoot, "assets", "frames"), { recursive: true });
      await writeFile(join(workspaceRoot, "skills", "sample", "SKILL.md"), "# Sample\n", "utf8");
      await writeFile(
        join(workspaceRoot, "design-templates", "sample", "SKILL.md"),
        "# Template\n",
        "utf8",
      );

      await copyBundledResourceTrees({ workspaceRoot, resourceRoot });

      await expect(
        readFile(join(resourceRoot, "skills", "sample", "SKILL.md"), "utf8"),
      ).resolves.toBe("# Sample\n");
      await expect(
        readFile(
          join(resourceRoot, "design-templates", "sample", "SKILL.md"),
          "utf8",
        ),
      ).resolves.toBe("# Template\n");
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });
});
