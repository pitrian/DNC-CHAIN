import type { NextApiRequest, NextApiResponse } from 'next';

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="100%" stop-color="#0d2137"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(#bg)" rx="20"/>
  <text x="250" y="140" text-anchor="middle" fill="#fbbf24" font-size="28" font-weight="bold" font-family="serif">DNC University</text>
  <text x="250" y="190" text-anchor="middle" fill="#e2e8f0" font-size="18" font-family="sans-serif">Soulbound Diploma</text>
  <circle cx="250" cy="270" r="50" fill="none" stroke="#fbbf24" stroke-width="2"/>
  <polygon points="250,240 265,265 250,290 235,265" fill="#fbbf24"/>
  <text x="250" y="360" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="monospace">ERC-5192</text>
  <text x="250" y="420" text-anchor="middle" fill="#64748b" font-size="10" font-family="monospace">Soulbound Non-Transferable</text>
</svg>`;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { hash } = req.query;

  const metadata = {
    name: `DNC University Diploma`,
    description: `Official digital diploma issued by the Department of National Certification (DNC).\n\nFile Hash: ${hash}\n\nThis is a soulbound (non-transferable) token per ERC-5192.`,
    image: `data:image/svg+xml,${encodeURIComponent(SVG)}`,
    attributes: [
      { trait_type: 'File Hash', value: hash },
      { trait_type: 'Standard', value: 'ERC-5192 Soulbound' },
      { trait_type: 'Network', value: 'Anvil Local' },
    ],
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(metadata);
}
