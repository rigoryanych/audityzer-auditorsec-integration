# Setup & Development Guide

Comprehensive guide for developing and deploying the Audityzer & AuditorSEC Integration platform.

## Prerequisites

- **Node.js** 16+ ([nodejs.org](https://nodejs.org/))
- **npm** 7+
- **Git**
- **Docker** (optional, for isolation)
- **Postman** or **curl** (for API testing)
- **Cypress** (for E2E testing)

## Step 1: Project Initialization (45 min)

### 1.1 Clone Repository

```bash
git clone https://github.com/rigoryanych/audityzer-auditorsec-integration.git
cd audityzer-auditorsec-integration
```

### 1.2 Install Root Dependencies

```bash
npm install
```

### 1.3 Setup Backend

```bash
cd server
npm install
```

**Fact-checked dependencies from:**
- [Node.js Official Docs](https://nodejs.org/docs/)
- [Express.js Best Practices](https://expressjs.com/)
- [ethers.js Documentation](https://docs.ethers.org/)

### 1.4 Environment Configuration

Create `.env` in server directory:

```env
PORT=5000
NODE_ENV=development
AUDITYZER_API_KEY=your_audityzer_key
AUDITYZER_API_URL=https://api.audityzer.com
AUDITORSEC_API_KEY=your_auditorsec_key
AUDITORSEC_API_URL=https://api.auditorsec.com
ENCRYPTION_SECRET=your_256bit_hex_key
```

**SECURITY NOTE:** Never commit `.env` files. Encrypt sensitive data using crypto.js.

### 1.5 Test Backend Server

```bash
cd server
npm run dev
```

**Expected Output:**
```
Server running on port 5000
Available endpoints:
  GET  /health
  POST /api/audit
  GET  /api/audit/:auditId
  POST /api/audityzer/scan
  POST /api/auditorsec/analyze
```

**Verify with curl:**
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{"status":"healthy","timestamp":"2025-11-22T04:00:00.000Z"}
```

---

## Step 2: API Endpoints & Mock Testing (45 min)

### 2.1 Test Mock Audit Endpoint

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/audit \
  -H "Content-Type: application/json" \
  -d '{
    "contractCode": "pragma solidity ^0.8.0; contract Test { }",
    "contractAddress": "0x1234567890123456789012345678901234567890",
    "network": "ethereum"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "auditId": "audit_1234567890_abc123xyz",
  "status": "completed",
  "vulnerabilities": [
    {
      "severity": "high",
      "type": "reentrancy",
      "line": 45,
      "description": "Potential reentrancy vulnerability detected"
    }
  ],
  "summary": {"total": 2, "high": 1, "medium": 1, "low": 0}
}
```

### 2.2 Test Audityzer Integration

```bash
curl -X POST http://localhost:5000/api/audityzer/scan \
  -H "Content-Type: application/json" \
  -d '{"contractCode": "pragma solidity ^0.8.0; contract Test { }"}'
```

### 2.3 Validation & Error Handling

**Invalid Input Test:**
```bash
curl -X POST http://localhost:5000/api/audit \
  -H "Content-Type: application/json" \
  -d '{"contractCode": "", "contractAddress": "invalid"}'
```

**Expected:** 400 error with sanitized message (no sensitive data leaked)

**Fact-checked with:**
- [Axios Documentation](https://axios-http.com/)
- [OWASP Input Validation](https://owasp.org/www-community/attacks/xss/)
- [ethers.js Address Validation](https://docs.ethers.org/v6/api/address/)

---

## Step 3: Security & Rate Limiting (45 min)

### 3.1 Rate Limiting Configuration

Already implemented in `server/src/index.ts`:

```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);
```

**Test rate limiting:**
```bash
for i in {1..101}; do curl http://localhost:5000/api/audit; done
# After 100 requests, 101st should be rate-limited
```

### 3.2 Data Encryption

**Fact-checked from:**
- [Node.js Crypto Module](https://nodejs.org/api/crypto.html)
- [OWASP Encryption Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [ConsenSys Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

**Implementation example:**
```typescript
import crypto from 'crypto';

const encryptData = (data: string, secret: string) => {
  const key = crypto.scryptSync(secret, 'salt', 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};
```

---

## Step 4: Deployment (15 min verification)

### 4.1 Local Testing Checklist

- [ ] Health endpoint returns 200
- [ ] Mock audit endpoint accepts valid input
- [ ] Invalid inputs return 400 with sanitized messages
- [ ] Rate limiting blocks >100 requests/15min
- [ ] No sensitive data in logs
- [ ] All errors caught in try-catch

### 4.2 Deployment to Vercel

```bash
npm install -g vercel
vercel --prod
```

### 4.3 Monitor with Sentry

```bash
npm install @sentry/node
```

**Initialize in server/src/index.ts:**
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## Step 5: Testing & Quality Assurance

### 5.1 Unit Tests

```bash
npm test
```

### 5.2 Load Testing with Artillery

```bash
npm install -g artillery
artillery quick --count 100 --num 10 http://localhost:5000/health
```

### 5.3 E2E Tests with Cypress

```bash
npm install cypress
npx cypress open
```

**Test coverage should be >90%**

---

## Troubleshooting

### Issue: "Cannot find module 'express'"
```bash
cd server && npm install
```

### Issue: "Port 5000 already in use"
```bash
lsof -ti:5000 | xargs kill -9
# or change PORT in .env
```

### Issue: "API returns 429 (Too Many Requests)"
```bash
# Wait 15 minutes or restart server
```

---

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Official Docs](https://react.dev/)
- [ethers.js API](https://docs.ethers.org/)
- [OWASP Security Guidelines](https://owasp.org/)
- [ConsenSys Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)

---

**Last Updated:** 2025-11-22
**Status:** Ready for Production
