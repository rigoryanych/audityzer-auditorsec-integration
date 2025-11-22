import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Rate limiting for security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Mock audit endpoint - Step 2 implementation
app.post('/api/audit', async (req: Request, res: Response) => {
  try {
    const { contractCode, contractAddress, network } = req.body;

    // Input validation (sanitization)
    if (!contractCode || typeof contractCode !== 'string' || contractCode.length === 0) {
      return res.status(400).json({ error: 'Invalid contract code' });
    }

    if (!contractAddress || !/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      return res.status(400).json({ error: 'Invalid contract address' });
    }

    // Generate mock audit ID
    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate audit analysis
    const mockVulnerabilities = [
      {
        severity: 'high',
        type: 'reentrancy',
        line: 45,
        description: 'Potential reentrancy vulnerability detected',
      },
      {
        severity: 'medium',
        type: 'integer-overflow',
        line: 67,
        description: 'Unchecked arithmetic operation',
      },
    ];

    // Log silently (no sensitive data in logs)
    console.log(`[${new Date().toISOString()}] Audit started: ${auditId}`);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      auditId,
      network,
      status: 'completed',
      vulnerabilities: mockVulnerabilities,
      summary: {
        total: 2,
        high: 1,
        medium: 1,
        low: 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Audit error:', error);
    res.status(500).json({ error: 'Audit processing failed' });
  }
});

// Get audit results
app.get('/api/audit/:auditId', (req: Request, res: Response) => {
  try {
    const { auditId } = req.params;

    // Mock response for audit retrieval
    res.json({
      auditId,
      status: 'completed',
      vulnerabilities: [
        { severity: 'high', type: 'reentrancy', line: 45 },
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching audit:', error);
    res.status(500).json({ error: 'Failed to fetch audit results' });
  }
});

// Mock Audityzer integration endpoint (Step 3)
app.post('/api/audityzer/scan', (req: Request, res: Response) => {
  try {
    const { contractCode } = req.body;

    if (!contractCode) {
      return res.status(400).json({ error: 'Contract code required' });
    }

    // Mock Audityzer response
    res.json({
      status: 'success',
      scanId: `scan_${Date.now()}`,
      findings: [
        { id: 'AUD-001', severity: 'high', title: 'Reentrancy Risk' },
      ],
    });
  } catch (error) {
    console.error('Audityzer scan error:', error);
    res.status(500).json({ error: 'Audityzer scan failed' });
  }
});

// Mock AuditorSEC integration endpoint (Step 3)
app.post('/api/auditorsec/analyze', (req: Request, res: Response) => {
  try {
    const { contractCode, contractAddress } = req.body;

    if (!contractCode || !contractAddress) {
      return res.status(400).json({ error: 'Contract details required' });
    }

    // Mock AuditorSEC response
    res.json({
      status: 'success',
      analysisId: `analysis_${Date.now()}`,
      recommendations: [
        { priority: 'critical', recommendation: 'Add checks for reentrancy' },
      ],
    });
  } catch (error) {
    console.error('AuditorSEC analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  POST /api/audit');
  console.log('  GET  /api/audit/:auditId');
  console.log('  POST /api/audityzer/scan');
  console.log('  POST /api/auditorsec/analyze');
});
