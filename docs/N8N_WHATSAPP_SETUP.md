# n8n WhatsApp Setup

Use this to send a WhatsApp alert to the restaurant owner every time a customer places an order.

## What the website already does

The website now:

1. Sends customer and restaurant email confirmations from `/api/send-order-email`
2. Posts the same order to an `n8n` webhook if `N8N_ORDER_WEBHOOK_URL` is configured

The app sends these environment variables:

- `N8N_ORDER_WEBHOOK_URL`
- `N8N_WEBHOOK_SECRET`

## Step 1: Add environment variables in Vercel

Add these in Vercel project settings:

```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Taj Mahal <orders@tajmahalmarina-delivery.fr>
RESTAURANT_ORDER_EMAIL=tajmahalmarina06@gmail.com
N8N_ORDER_WEBHOOK_URL=https://your-n8n-domain/webhook/tajmahal-order-alert
N8N_WEBHOOK_SECRET=replace_with_your_secret
```

Redeploy after saving them.

## Step 2: Create an n8n workflow

Create a new workflow with these nodes:

1. `Webhook`
2. `IF`
3. `Set`
4. `HTTP Request`
5. Optional `Gmail` or `Email` backup node

## Step 3: Configure the Webhook node

Use:

- Method: `POST`
- Path: `tajmahal-order-alert`

Copy the production webhook URL and use it as `N8N_ORDER_WEBHOOK_URL` in Vercel.

## Step 4: Protect the webhook

In the `IF` node, validate the header:

- Header name: `x-webhook-secret`
- Expected value: your `N8N_WEBHOOK_SECRET`

If the secret does not match, stop the workflow.

## Step 5: Build the WhatsApp message

The website sends a payload like this:

```json
{
  "event": "order.created",
  "source": "tajmahalmarina-delivery.fr",
  "orderRef": "TM-12345678",
  "createdAt": "2026-06-03T12:00:00.000Z",
  "language": "fr",
  "orderType": "takeaway",
  "orderTypeLabel": "À emporter",
  "customer": {
    "name": "Manoj",
    "phone": "0743660862",
    "email": "customer@example.com",
    "guestCount": 2,
    "addressLine1": "",
    "addressLine2": "",
    "notes": "No onions"
  },
  "schedule": {
    "date": "2026-06-03",
    "timeSlot": "19:30"
  },
  "restaurant": {
    "name": "Taj Mahal Marina",
    "location": "Villeneuve-Loubet, France",
    "phoneNumber": "04 93 73 07 87",
    "address": "The Marina, 1001 Battery Avenue, 06270 Villeneuve-Loubet"
  },
  "items": [
    {
      "id": "palak-paneer",
      "name": "Palak Paneer",
      "quantity": 1,
      "unit_price": 12,
      "unit_price_formatted": "12,00 €",
      "subtotal": 12,
      "subtotal_formatted": "12,00 €",
      "note": ""
    }
  ],
  "total": 12,
  "totalFormatted": "12,00 €",
  "whatsappMessage": "Nouvelle commande ..."
}
```

In the `Set` node, you can simply pass through:

- `{{$json.whatsappMessage}}`

## Step 6: Send WhatsApp

### Option A: Twilio WhatsApp

Use an `HTTP Request` node:

- Method: `POST`
- URL: `https://api.twilio.com/2010-04-01/Accounts/{ACCOUNT_SID}/Messages.json`
- Auth: Basic Auth
- Username: Twilio Account SID
- Password: Twilio Auth Token

Body:

- `From=whatsapp:+14155238886` for sandbox or your approved sender
- `To=whatsapp:+33XXXXXXXXX`
- `Body={{$json.whatsappMessage}}`

### Option B: Meta WhatsApp Cloud API

Use an `HTTP Request` node:

- Method: `POST`
- URL: `https://graph.facebook.com/v22.0/{PHONE_NUMBER_ID}/messages`
- Auth: Bearer Token

JSON body:

```json
{
  "messaging_product": "whatsapp",
  "to": "33XXXXXXXXX",
  "type": "text",
  "text": {
    "body": "={{$json.whatsappMessage}}"
  }
}
```

## Step 7: Test the workflow

1. Activate the workflow
2. Place a test order on the website
3. Confirm:
   - customer email is received
   - restaurant email is received
   - owner WhatsApp is received

## Notes

- The website does not fail the order if the `n8n` webhook fails. Email remains the primary confirmation path.
- This is intentional so customers are not blocked if WhatsApp automation has a temporary issue.
