# Taj Mahal Delivery and Kiosk

Next.js App Router project for Taj Mahal restaurant.

This project currently includes:
- public delivery and ordering website
- kiosk menu display
- official restaurant menu data
- bilingual English and French UI
- Resend-based order confirmation email flow

Current routes:
- `/` public ordering website
- `/kiosk` outdoor kiosk display

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- lucide-react
- Resend

## Project Goals

This app is designed to support:
- customer-facing delivery ordering
- outdoor kiosk menu display
- bilingual restaurant presentation
- professional order confirmation emails

The current menu data is shared between the public site and kiosk site through local data files and browser storage.

## Important Current Limitation

The app currently uses `localStorage` for browser-side persistence.

That means:
- public site and kiosk stay connected only when they run on the same browser origin
- different subdomains such as `commandes.restaurants-tajmahal.fr` and `kiosk.restaurants-tajmahal.fr` will not share live browser data

For real production syncing between ordering site and kiosk, a shared backend or database should be added next.

## Local Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/kiosk
```

You can also run on another port:

```bash
npm run dev -- --port 3018
```

## Build Check

Production build:

```bash
npm run build
```

## Environment Variables

Create `.env.local` in the project root.

Required for order emails:

```env
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=Taj Mahal <orders@restaurants-tajmahal.fr>
RESTAURANT_ORDER_EMAIL=manager@restaurants-tajmahal.fr
```

Reference file:
- [.env.example](/Users/manojkumar/Downloads/tajmahal-menu-codex/.env.example)

## Resend Email Setup

This project sends:
- confirmation email to the customer
- order notification email to the restaurant owner

API route:
- [app/api/send-order-email/route.ts](/Users/manojkumar/Downloads/tajmahal-menu-codex/app/api/send-order-email/route.ts)

Email template builder:
- [lib/orderEmail.ts](/Users/manojkumar/Downloads/tajmahal-menu-codex/lib/orderEmail.ts)

To complete setup:

1. Create a Resend account.
2. Verify your sending domain.
3. Create a Resend API key.
4. Add the environment variables above to `.env.local`.
5. Restart the app.

The sender domain should be a real verified domain such as:
- `restaurants-tajmahal.fr`

Example sender:
- `orders@restaurants-tajmahal.fr`

Example owner inbox:
- `manager@restaurants-tajmahal.fr`

## Suggested Production Domain Structure

Recommended structure:

- landing page: `https://www.restaurants-tajmahal.fr`
- ordering site: `https://commandes.restaurants-tajmahal.fr`
- kiosk: `https://kiosk.restaurants-tajmahal.fr`

Why this is recommended:
- keeps the current marketing website untouched
- lets the ordering app deploy independently
- keeps kiosk and ordering separated cleanly

## Vercel Deployment

### 1. Push the project to GitHub

```bash
git init
git add .
git commit -m "Initial Taj Mahal delivery and kiosk app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tajmahal-menu-codex.git
git push -u origin main
```

### 2. Import the repository in Vercel

1. Sign in to [Vercel](https://vercel.com/)
2. Click `Add New...` then `Project`
3. Import the GitHub repository
4. Let Vercel auto-detect Next.js
5. Deploy

### 3. Add environment variables in Vercel

In Vercel:

`Project Settings -> Environment Variables`

Add:
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESTAURANT_ORDER_EMAIL`

### 4. Test the Vercel deployment URL

Before connecting your real domain, test the generated Vercel URL:
- public ordering route
- kiosk route
- order placement flow
- confirmation email sending

### 5. Connect custom subdomains

After deployment, add:
- `commandes.restaurants-tajmahal.fr`
- `kiosk.restaurants-tajmahal.fr`

Note:
- if both subdomains point to one Vercel project, host-based routing or middleware should be added so `kiosk.restaurants-tajmahal.fr` resolves to `/kiosk`

## Main Application Files

- [app/page.tsx](/Users/manojkumar/Downloads/tajmahal-menu-codex/app/page.tsx)
- [app/kiosk/page.tsx](/Users/manojkumar/Downloads/tajmahal-menu-codex/app/kiosk/page.tsx)
- [components/public/PublicMenuClient.tsx](/Users/manojkumar/Downloads/tajmahal-menu-codex/components/public/PublicMenuClient.tsx)
- [components/public/PublicOrderPage.tsx](/Users/manojkumar/Downloads/tajmahal-menu-codex/components/public/PublicOrderPage.tsx)
- [components/kiosk/KioskMenu.tsx](/Users/manojkumar/Downloads/tajmahal-menu-codex/components/kiosk/KioskMenu.tsx)
- [components/kiosk/KioskHero.tsx](/Users/manojkumar/Downloads/tajmahal-menu-codex/components/kiosk/KioskHero.tsx)
- [data/defaultMenu.ts](/Users/manojkumar/Downloads/tajmahal-menu-codex/data/defaultMenu.ts)
- [data/defaultSettings.ts](/Users/manojkumar/Downloads/tajmahal-menu-codex/data/defaultSettings.ts)
- [lib/menuStore.ts](/Users/manojkumar/Downloads/tajmahal-menu-codex/lib/menuStore.ts)
- [lib/publicContent.ts](/Users/manojkumar/Downloads/tajmahal-menu-codex/lib/publicContent.ts)
- [lib/orderEmail.ts](/Users/manojkumar/Downloads/tajmahal-menu-codex/lib/orderEmail.ts)

## Features Included

- official Taj Mahal menu imported from photographed restaurant menu
- bilingual English and French content
- category browsing
- dish cards with pricing and notes
- cart and order summary
- dine-in, takeaway, and home-delivery form flow
- customer confirmation emails
- restaurant owner notification emails
- kiosk layout for large-screen menu presentation

## Order Email Data Included

Each order email includes:
- order type
- customer name
- phone number
- email address
- delivery address when applicable
- date and time
- ordered dishes
- quantity per dish
- item prices
- total price
- customer notes

## Known Next Step

Before real production launch, replace `localStorage` menu persistence with a shared backend so:
- kiosk and public site stay synchronized across different domains or devices
- menu changes are persistent outside the browser

## License / Ownership

This project is prepared for Taj Mahal restaurant delivery and kiosk usage.
