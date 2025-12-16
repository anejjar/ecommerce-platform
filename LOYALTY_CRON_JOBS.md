# Loyalty Program Cron Jobs Setup

This document explains how to set up automated cron jobs for the loyalty program system.

## Prerequisites

1. Set the `CRON_SECRET_TOKEN` environment variable in your `.env` file:
   ```
   CRON_SECRET_TOKEN=your-secret-token-here
   ```

2. Use a cron job service like:
   - **Vercel Cron** (if deployed on Vercel)
   - **GitHub Actions** (scheduled workflows)
   - **External services**: EasyCron, Cron-job.org, or similar
   - **Server cron** (if self-hosted)

## Available Cron Endpoints

### 1. Expire Points (Daily at 00:00 UTC)

**Endpoint**: `POST /api/cron/loyalty/expire-points`

**Purpose**: Expires loyalty points that have passed their expiration date.

**Schedule**: Daily at midnight UTC
```cron
0 0 * * *
```

**Example curl**:
```bash
curl -X POST https://your-domain.com/api/cron/loyalty/expire-points \
  -H "Authorization: Bearer YOUR_CRON_SECRET_TOKEN"
```

---

### 2. Expiration Warnings (Daily at 09:00 UTC)

**Endpoint**: `POST /api/cron/loyalty/expiration-warnings`

**Purpose**: Sends email warnings to customers whose points are expiring within 7 days.

**Schedule**: Daily at 9am UTC
```cron
0 9 * * *
```

**Example curl**:
```bash
curl -X POST https://your-domain.com/api/cron/loyalty/expiration-warnings \
  -H "Authorization: Bearer YOUR_CRON_SECRET_TOKEN"
```

---

### 3. Recalculate Tiers (Daily at 02:00 UTC)

**Endpoint**: `POST /api/cron/loyalty/recalculate-tiers`

**Purpose**: Batch recalculates all customer tiers based on lifetime points.

**Schedule**: Daily at 2am UTC
```cron
0 2 * * *
```

**Example curl**:
```bash
curl -X POST https://your-domain.com/api/cron/loyalty/recalculate-tiers \
  -H "Authorization: Bearer YOUR_CRON_SECRET_TOKEN"
```

---

### 4. Early Access Notifications (Hourly)

**Endpoint**: `POST /api/cron/loyalty/early-access-notifications`

**Purpose**: Sends VIP early access notifications for flash sales and product launches.

**Schedule**: Every hour
```cron
0 * * * *
```

**Example curl**:
```bash
curl -X POST https://your-domain.com/api/cron/loyalty/early-access-notifications \
  -H "Authorization: Bearer YOUR_CRON_SECRET_TOKEN"
```

---

## Setup Methods

### Option 1: Vercel Cron (Recommended for Vercel deployments)

Create `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/loyalty/expire-points",
      "schedule": "0 0 * * *"
    },
    {
      "path": "/api/cron/loyalty/expiration-warnings",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/loyalty/recalculate-tiers",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/loyalty/early-access-notifications",
      "schedule": "0 * * * *"
    }
  ]
}
```

**Note**: Vercel Cron automatically includes authentication headers. You may need to adjust the authentication logic for Vercel.

---

### Option 2: GitHub Actions

Create `.github/workflows/loyalty-cron.yml`:

```yaml
name: Loyalty Program Cron Jobs

on:
  schedule:
    # Expire points - Daily at 00:00 UTC
    - cron: '0 0 * * *'
    # Expiration warnings - Daily at 09:00 UTC
    - cron: '0 9 * * *'
    # Recalculate tiers - Daily at 02:00 UTC
    - cron: '0 2 * * *'
    # Early access notifications - Every hour
    - cron: '0 * * * *'

jobs:
  expire-points:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 0 * * *'
    steps:
      - name: Call expire points endpoint
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/cron/loyalty/expire-points \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET_TOKEN }}"

  expiration-warnings:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 9 * * *'
    steps:
      - name: Call expiration warnings endpoint
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/cron/loyalty/expiration-warnings \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET_TOKEN }}"

  recalculate-tiers:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 2 * * *'
    steps:
      - name: Call recalculate tiers endpoint
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/cron/loyalty/recalculate-tiers \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET_TOKEN }}"

  early-access-notifications:
    runs-on: ubuntu-latest
    if: github.event.schedule == '0 * * * *'
    steps:
      - name: Call early access notifications endpoint
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/cron/loyalty/early-access-notifications \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET_TOKEN }}"
```

Add these secrets to your GitHub repository:
- `APP_URL`: Your application URL
- `CRON_SECRET_TOKEN`: Your cron secret token

---

### Option 3: EasyCron.com (External Service)

1. Sign up at [EasyCron.com](https://www.easycron.com)
2. Create a new cron job for each endpoint:
   - **URL**: Your endpoint URL
   - **HTTP Method**: POST
   - **HTTP Headers**: `Authorization: Bearer YOUR_TOKEN`
   - **Cron Expression**: Use the schedules above

---

### Option 4: Server Crontab (Self-hosted)

Edit your crontab:
```bash
crontab -e
```

Add these lines:
```cron
# Loyalty Program Cron Jobs
0 0 * * * curl -X POST https://your-domain.com/api/cron/loyalty/expire-points -H "Authorization: Bearer YOUR_TOKEN"
0 9 * * * curl -X POST https://your-domain.com/api/cron/loyalty/expiration-warnings -H "Authorization: Bearer YOUR_TOKEN"
0 2 * * * curl -X POST https://your-domain.com/api/cron/loyalty/recalculate-tiers -H "Authorization: Bearer YOUR_TOKEN"
0 * * * * curl -X POST https://your-domain.com/api/cron/loyalty/early-access-notifications -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing Cron Jobs

Test each endpoint manually:

```bash
# Test expire points
curl -X POST http://localhost:3000/api/cron/loyalty/expire-points \
  -H "Authorization: Bearer YOUR_CRON_SECRET_TOKEN"

# Test expiration warnings
curl -X POST http://localhost:3000/api/cron/loyalty/expiration-warnings \
  -H "Authorization: Bearer YOUR_CRON_SECRET_TOKEN"

# Test recalculate tiers
curl -X POST http://localhost:3000/api/cron/loyalty/recalculate-tiers \
  -H "Authorization: Bearer YOUR_CRON_SECRET_TOKEN"

# Test early access notifications
curl -X POST http://localhost:3000/api/cron/loyalty/early-access-notifications \
  -H "Authorization: Bearer YOUR_CRON_SECRET_TOKEN"
```

---

## Monitoring

Each cron endpoint returns a JSON response with:
- `success`: Boolean indicating success
- `message`: Summary message
- Additional metrics specific to the job

Example response:
```json
{
  "success": true,
  "expired": 15,
  "message": "Expired points for 15 transactions"
}
```

Monitor your application logs for cron job execution:
- Check for successful executions
- Monitor for errors
- Track metrics (points expired, emails sent, tiers upgraded, etc.)

---

## Troubleshooting

### Cron job not running
1. Verify `CRON_SECRET_TOKEN` is set correctly
2. Check cron service logs
3. Ensure endpoint URLs are correct
4. Test manually with curl

### Authentication errors
1. Verify Authorization header format: `Bearer YOUR_TOKEN`
2. Check token matches `CRON_SECRET_TOKEN` in `.env`
3. Ensure no extra spaces in the token

### Email delivery issues
1. Verify email configuration in `.env`
2. Check email service credentials
3. Review email sending logs
4. Test email templates manually

---

## Best Practices

1. **Monitoring**: Set up alerts for failed cron jobs
2. **Logging**: Enable detailed logging for debugging
3. **Testing**: Test cron jobs in staging before production
4. **Backups**: Backup database before running batch operations
5. **Rate Limiting**: Consider rate limiting for external cron services
6. **Timezone**: All schedules use UTC - adjust if needed
7. **Overlap Prevention**: Ensure jobs don't overlap (use job locking if needed)

---

## Summary

| Job | Frequency | Time (UTC) | Purpose |
|-----|-----------|------------|---------|
| Expire Points | Daily | 00:00 | Expire old points |
| Expiration Warnings | Daily | 09:00 | Warn about expiring points |
| Recalculate Tiers | Daily | 02:00 | Update customer tiers |
| Early Access | Hourly | Every hour | Send VIP notifications |

All endpoints are secured with `CRON_SECRET_TOKEN` and return JSON responses with execution metrics.
