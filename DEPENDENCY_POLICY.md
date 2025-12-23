# Production Dependency Governance Policy

## 🚨 Critical Directive

**DO NOT UPDATE DEPENDENCIES AUTOMATICALLY.**
This application has strict fidelity requirements for PDF generation. Updating core libraries (Puppeteer, Chromium, Next.js) without manual verification will break production type-rendering, layout, or binary execution.

## 🔒 Locked Dependencies (High Risk)

The following dependencies are **PINNED** to exact versions. Do not use `^` (caret) or `~` (tilde).

| Package                   | Risk    | Reason for Locking                                                                                                                                           |
| :------------------------ | :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`puppeteer-core`**      | 🔴 HIGH | Must match the exact protocol version supported by the specific Chromium binary used in production. Mismatches cause timeouts or crashes.                    |
| **`@sparticuz/chromium`** | 🔴 HIGH | Extremely sensitive to the serverless execution environment (AWS Lambda/Netlify). New versions often require new glibc/OS layers not present in the runtime. |
| **`puppeteer`** (DEV)     | 🔴 HIGH | Must match `puppeteer-core` exactly to ensure local development mirrors production behavior.                                                                 |

### 🛑 Upgrade Procedure for High Risk

1.  **Never** run `npm update` blindly.
2.  If upgrades are required (e.g. security patch):
    - Upgrade `puppeteer`, `puppeteer-core`, and `@sparticuz/chromium` **together** as a set.
    - Verify locally: `npm run build && npm start`.
    - **Mandatory Verification**: Convert a Word, Excel, and URL document locally and verify the PDF is identical to previous output.
    - Deploy to a staging environment first.

## 🔒 Framework Dependencies (Medium Risk)

| Package                   | Risk   | Reason for Locking                                                                  |
| :------------------------ | :----- | :---------------------------------------------------------------------------------- |
| **`next`**                | 🟡 MED | Updates often introduce breaking build changes or alter the static export output.   |
| **`react` / `react-dom`** | 🟡 MED | Major/Minor updates can break hydration or introduce new warnings.                  |
| **`mammoth` / `xlsx`**    | 🟡 MED | Parsing logic must be deterministic. Updates might handle fonts/tables differently. |

### ⚠️ Upgrade Procedure for Medium Risk

1.  Upgrade one package at a time.
2.  Verify the build pass (`npm run build`).
3.  Manually test the specific feature affected (e.g., if upgrading `mammoth`, test Docx conversion).

## ✅ Safe Dependencies (Low Risk)

- UI libraries (`lucide-react`, `clsx`, `tailwind-merge`)
- Dev tools (`eslint`, `typescript`)

These can be updated via standard semantic versioning (`^` ranges allowed), provided the build passes.

---

**Last Verified Stable Confiuration:**

- Node: 18.x / 20.x
- Puppeteer: 23.11.1
- Chromium: 143.0.0
- Next.js: 15.5.9
