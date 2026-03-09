# Next.js + Tailwind CSS + shadcn/ui Rules

## Next.js

- Preserve the repo's current routing model and folder conventions.
- Respect server and client component boundaries.
- Do not introduce unnecessary client-side state when server rendering is more appropriate.
- Avoid changing data contracts unless explicitly required.

## Tailwind CSS

- Keep utility usage readable.
- Prefer consistent spacing and typography conventions over ad hoc class piles.
- Use responsive utilities intentionally, not as patchwork.

## shadcn/ui

- Reuse existing shadcn/ui components where sensible.
- Extend carefully instead of forking patterns without reason.
- Preserve accessibility semantics when customizing components.

## General

- Favor minimal diffs.
- Avoid broad refactors unless they are necessary to solve the request correctly.
- Match the existing repo style when it is not actively harmful.