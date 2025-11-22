# Audityzer & AuditorSEC Integration

Automated Web3 smart contract security audit platform integrating Audityzer scanning with AuditorSEC analysis via REST API and CI/CD pipelines.

## Features

- **Automated Smart Contract Audits**: Continuous security scanning of Web3 contracts
- **REST API Integration**: Seamless integration between Audityzer and AuditorSEC platforms
- **CI/CD Pipeline Support**: Automated audit workflows in development pipelines
- **Real-time Security Analysis**: Immediate vulnerability detection and reporting
- **Secure API Communication**: Encrypted credential storage and silent logging

## Tech Stack

### Backend
- **Node.js** with TypeScript
- **ethers.js** for Web3 contract interaction
- **Express.js** for REST API endpoints
- **Encryption** for sensitive data (API keys, credentials)

### Frontend
- **React** 18+
- **TypeScript** for type safety
- **Axios** for API communication

## Prerequisites

- **Node.js** 16+ ([nodejs.org](https://nodejs.org/))
- **npm** 7+
- Audityzer API credentials
- AuditorSEC API credentials

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/rigoryanych/audityzer-auditorsec-integration.git
cd audityzer-auditorsec-integration
```

### 2. Install Dependencies

```bash
npm install axios dotenv ethers
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
AUDITYZER_API_KEY=your_audityzer_key
AUDITYZER_API_URL=https://api.audityzer.com
AUDITORSEC_API_KEY=your_auditorsec_key
AUDITORSEC_API_URL=https://api.auditorsec.com
ENCRYPTION_SECRET=your_encryption_secret_key
NODE_ENV=development
```

**Security Note**: Never commit `.env` files. Add to `.gitignore`.

## Project Structure

```
.
├── src/
│   ├── index.ts           # Main entry point
│   ├── config/
│   │   └── env.ts         # Environment configuration
│   ├── services/
│   │   ├── audityzer.ts   # Audityzer API client
│   │   ├── auditorsec.ts  # AuditorSEC API client
│   │   └── encryption.ts  # Encryption utilities
│   ├── utils/
│   │   ├── validators.ts  # Input sanitization
│   │   └── logger.ts      # Silent logging
│   └── routes/
│       └── audit.ts       # API routes
├── .env                   # Environment variables (git ignored)
├── .gitignore
├── package.json
└── README.md
```

## Usage

### Running the Integration

```bash
node src/index.js
```

### API Endpoints

#### Submit Contract for Audit

```bash
POST /api/audit
Content-Type: application/json

{
  "contractAddress": "0x...",
  "network": "ethereum",
  "sourceCode": "contract code..."
}
```

#### Get Audit Results

```bash
GET /api/audit/:auditId
```

## Security Best Practices

1. **Input Sanitization**: All user inputs validated before API calls
2. **Credential Encryption**: API keys encrypted at rest using `crypto` module
3. **Silent Logging**: Sensitive data never logged; audit trails maintained securely
4. **HTTPS Only**: All external API calls use encrypted HTTPS connections
5. **Error Handling**: Generic error messages to clients; detailed logs server-side only

## Development

### Build

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Run Contract Audit
  run: npm run audit -- ${{ github.event.pull_request.body }}
```

## Documentation

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [ethers.js Guide](https://docs.ethers.org/)

## Support

For issues or questions, please open a GitHub issue.

## License

MIT
