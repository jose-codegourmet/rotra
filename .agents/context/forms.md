# Forms

> **Last verified:** 2026-08-26 · Then run `/rotra-is-my-form-valid` for a full audit.

## Canonical stack (new forms)

There is **no** shadcn `Form.tsx`. Use:

1. `react-hook-form` — `useForm` + **`FormProvider`** + **`Controller`** (not `register`)
2. Zod — `zodResolver` + colocated `schema.ts`
3. Defaults — colocated `default.ts`
4. Layout — `@/components/ui/field/Field` (`Field`, `FieldLabel`, `FieldContent`, `FieldError`)
5. Pending — `disabled={isPending}` on inputs and submit
6. Feedback — `sonner` `toast.success` **and** `toast.error` (or parent callbacks that toast)

```
SomeForm/
  SomeForm.tsx
  schema.ts
  default.ts
```

Reference: `apps/client/src/components/modules/settings/update-player-name-form/`.

## Skills

- `/rotra-is-my-form-valid` — audit → report at repo root
- `/rotra-correct-my-form` — apply report TODOs

## Known non-compliant forms (debt)

| Form | Issue |
|------|--------|
| `ClubApplicationForm` | Uses `register`; `schema.tsx` + `club-application-defaults.ts` naming |
| `AdminLoginForm` / `AdminOtpForm` | Inline defaults; errors inline (no toast) |
| Landing `WaitlistForm` | No Zod module; no toast |
| Some dialogs | Inline Zod; toast delegated to parent |

Do not copy these patterns for new forms. Fix them only when the task touches that form.

## Anti-patterns

- `register()` for controlled ROTRA fields
- Business logic (cost, MMR, EXP) inside the form component — keep on the server
- Success toast without failure toast (or silent failure)
- Leaving submit enabled while mutation is pending
