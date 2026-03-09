# QA Checklist

## Responsive

- Does the changed surface work at 375x667?
- Does it still feel intentional at 390x844?
- Does tablet layout improve appropriately rather than merely stretch?
- Does desktop preserve hierarchy without excessive empty space?

## Accessibility

- Are semantics and labels clear?
- Is focus behavior visible and coherent?
- Are contrast choices safe enough for normal use?
- Are error and validation messages understandable?

## State Quality

- Loading state present
- Empty state present
- Error state present
- Success feedback present if relevant
- Disabled state behaves clearly if relevant

## Runtime

- No obvious console or runtime errors
- No broken navigation or dead controls
- No clipped or overlapping UI in common breakpoints

## Honesty Rule

If any of these were not actually checked, report them as unverified rather than
assuming they are fine.