
# Eagle Security Guard Services

A polished, conversion-focused website for a security services company serving multifamily communities. The site presents apartment security offerings clearly and gives prospective property managers a direct, low-friction way to request more information.

## Overview

This project is a server-rendered Astro site with a responsive single-page experience and a custom inquiry workflow. Content, branding, theme presets, metrics, and optional widgets are centralized in one data module, making the site straightforward to adapt for future customers or campaigns.

## Highlights

- Responsive landing page designed for desktop and mobile visitors
- Clear positioning for patrol, camera monitoring, incident reporting, and access control services
- Conversion-focused inquiry form with inline submission states
- Server-side validation for names, email addresses, phone numbers, property names, and messages
- Honeypot field for basic bot protection
- Resend integration for delivering inquiries directly to the business inbox
- Request timeout and user-friendly error handling for the email provider
- Configurable visual themes, colors, typography, content, metrics, and UI widgets
- Netlify-ready server output and API deployment configuration
- Accessible form status updates using `aria-live`

## Technology

- [Astro](https://astro.build/) 6
- TypeScript
- Netlify adapter and server output
- Resend API for transactional email delivery
- Google Fonts: Space Grotesk and Manrope
- Native browser APIs for form submission and client-side feedback

## Project Structure

```text
.
├── public/                  # Static assets and favicon files
├── src/
│   ├── data/
│   │   └── site-content.ts  # Brand, copy, theme, metrics, and widget settings
│   └── pages/
│       ├── index.astro      # Main landing page
│       └── api/
│           └── inquiry.ts   # Validated inquiry endpoint and Resend integration
├── astro.config.mjs         # Astro and Netlify server configuration
├── netlify.toml             # Build, publish, and API routing configuration
└── package.json             # Scripts and dependencies
```

## Getting Started

### Prerequisites

- Node.js `22.12.0` or newer
- npm
- A Resend account and API key for the inquiry form

### Installation

```bash
npm install
```

Create a local environment file named `.env` in the project root:

```env
RESEND_API_KEY=re_xxxxxxxxx
INQUIRY_TO_EMAIL=your-inbox@example.com
INQUIRY_FROM_EMAIL=Security Website <onboarding@resend.dev>
```

`INQUIRY_TO_EMAIL` and `INQUIRY_FROM_EMAIL` have development-safe defaults in the endpoint, but setting them explicitly is recommended for production. Use a verified sending domain and sender address when deploying with Resend.

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Astro development server |
| `npm run build` | Create the production server build |
| `npm run preview` | Preview the production build locally |
| `npm run astro` | Run the Astro CLI |

## Customization

Most customer-specific updates can be made in [`src/data/site-content.ts`](src/data/site-content.ts):

- Page metadata and SEO description
- Brand name and badge
- Hero headline and service messaging
- Feature pills and performance metrics
- Inquiry form labels, placeholders, and status messages
- Color overrides and theme preset selection
- Optional badge, pill, metric, and card animation widgets

This keeps presentation content separate from the page layout and backend delivery logic.

## Inquiry Flow

1. A visitor completes the form on the landing page.
2. The browser submits the form to `POST /api/inquiry` using `FormData`.
3. The API validates the request and silently accepts submissions containing the honeypot value.
4. A plain-text email is sent through Resend to `INQUIRY_TO_EMAIL`.
5. The page displays a success or actionable error message without a full-page reload.

The endpoint rejects invalid email addresses, names outside the accepted length, oversized contact fields, and messages shorter than 20 or longer than 2,000 characters.

## Deployment

The project is configured for Netlify:

- Build command: `npm run build`
- Publish directory: `dist`
- Server output: Astro with `@astrojs/netlify`
- API route: `/api/inquiry`

Add the following environment variables to the Netlify site settings before production deployment:

```text
RESEND_API_KEY
INQUIRY_TO_EMAIL
INQUIRY_FROM_EMAIL
```

Build locally before deploying to verify the production output:

```bash
npm run build
```

## License

This project was developed as a client website. Content, branding, and business information are intended for the customer's use.
