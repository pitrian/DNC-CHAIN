import type { NextApiRequest, NextApiResponse } from 'next';

function academicSvg(hash: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#064e3b"/>
      <stop offset="100%" stop-color="#022c22"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(#bg)" rx="20"/>
  <text x="250" y="100" text-anchor="middle" fill="#34d399" font-size="16" font-weight="bold" font-family="monospace">DNC-CERTITRUST</text>
  <text x="250" y="150" text-anchor="middle" fill="#e2e8f0" font-size="24" font-weight="bold" font-family="serif">ACADEMIC DEGREE</text>
  <line x1="100" y1="175" x2="400" y2="175" stroke="#34d399" stroke-width="1" opacity="0.5"/>
  <text x="250" y="220" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="sans-serif">This certifies that the holder has been awarded</text>
  <text x="250" y="250" text-anchor="middle" fill="#fbbf24" font-size="18" font-weight="bold" font-family="serif">DNC University Diploma</text>
  <circle cx="250" cy="310" r="45" fill="none" stroke="#34d399" stroke-width="2"/>
  <polygon points="250,285 262,305 250,325 238,305" fill="#34d399"/>
  <text x="250" y="390" text-anchor="middle" fill="#64748b" font-size="10" font-family="monospace">ERC-5192 Soulbound</text>
  <text x="250" y="430" text-anchor="middle" fill="#475569" font-size="9" font-family="monospace">Hash: ${hash.slice(0, 10)}...</text>
  <text x="250" y="470" text-anchor="middle" fill="#065f46" font-size="9" font-family="monospace">ISSUED BY DNC EDUCATION AUTHORITY</text>
</svg>`;
}

function cityCertificateSvg(hash: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(#bg)" rx="20"/>
  <text x="250" y="100" text-anchor="middle" fill="#fbbf24" font-size="16" font-weight="bold" font-family="monospace">DNC-CERTITRUST</text>
  <text x="250" y="150" text-anchor="middle" fill="#fef3c7" font-size="24" font-weight="bold" font-family="serif">CITY CERTIFICATE</text>
  <line x1="100" y1="175" x2="400" y2="175" stroke="#fbbf24" stroke-width="1" opacity="0.5"/>
  <text x="250" y="220" text-anchor="middle" fill="#d4d4d4" font-size="12" font-family="sans-serif">Da Nang City People's Committee</text>
  <text x="250" y="250" text-anchor="middle" fill="#fbbf24" font-size="18" font-weight="bold" font-family="serif">City Certificate of Recognition</text>
  <circle cx="250" cy="310" r="45" fill="none" stroke="#fbbf24" stroke-width="2"/>
  <polygon points="230,280 270,280 250,310" fill="#fbbf24"/>
  <polygon points="230,340 270,340 250,310" fill="#fbbf24"/>
  <rect x="235" y="290" width="30" height="40" rx="3" fill="none" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="250" y="390" text-anchor="middle" fill="#64748b" font-size="10" font-family="monospace">ERC-5192 Soulbound</text>
  <text x="250" y="430" text-anchor="middle" fill="#475569" font-size="9" font-family="monospace">Hash: ${hash.slice(0, 10)}...</text>
  <text x="250" y="470" text-anchor="middle" fill="#78350f" font-size="9" font-family="monospace">ISSUED BY DANANG CITY AUTHORITY</text>
</svg>`;
}

function legalProofSvg(hash: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e3a5f"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="500" height="500" fill="url(#bg)" rx="20"/>
  <text x="250" y="100" text-anchor="middle" fill="#60a5fa" font-size="16" font-weight="bold" font-family="monospace">DNC-CERTITRUST</text>
  <text x="250" y="150" text-anchor="middle" fill="#bfdbfe" font-size="24" font-weight="bold" font-family="serif">LEGAL PROOF</text>
  <line x1="100" y1="175" x2="400" y2="175" stroke="#60a5fa" stroke-width="1" opacity="0.5"/>
  <text x="250" y="220" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="sans-serif">Department of Science & Technology</text>
  <text x="250" y="250" text-anchor="middle" fill="#60a5fa" font-size="18" font-weight="bold" font-family="serif">Document Proof Registration</text>
  <circle cx="250" cy="310" r="45" fill="none" stroke="#60a5fa" stroke-width="2"/>
  <path d="M225,310 L240,325 L275,295" fill="none" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/>
  <text x="250" y="390" text-anchor="middle" fill="#64748b" font-size="10" font-family="monospace">SHA-256 Anchored</text>
  <text x="250" y="430" text-anchor="middle" fill="#475569" font-size="9" font-family="monospace">Hash: ${hash.slice(0, 10)}...</text>
  <text x="250" y="470" text-anchor="middle" fill="#1e3a5f" font-size="9" font-family="monospace">REGISTERED BY SCIENCE & TECH AUTHORITY</text>
</svg>`;
}

const TYPES: Record<string, { name: string; desc: string }> = {
  ACADEMIC_DEGREE: { name: 'DNC Academic Degree', desc: 'Official academic diploma issued by DNC Education Authority.' },
  CITY_CERTIFICATE: { name: 'DNC City Certificate', desc: 'Official city-level certificate issued by Da Nang City Authority.' },
  LEGAL_PROOF: { name: 'DNC Legal Document Proof', desc: 'Registered document proof filed with the Department of Science & Technology.' },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { hash, type } = req.query;
  const docType = (type as string) || 'ACADEMIC_DEGREE';
  const info = TYPES[docType] || TYPES.ACADEMIC_DEGREE;
  const svgFn = docType === 'CITY_CERTIFICATE' ? cityCertificateSvg
    : docType === 'LEGAL_PROOF' ? legalProofSvg
    : academicSvg;

  const metadata = {
    name: info.name,
    description: `${info.desc}\n\nFile Hash: ${hash}\nDocument Type: ${docType}`,
    image: `data:image/svg+xml,${encodeURIComponent(svgFn(hash as string))}`,
    attributes: [
      { trait_type: 'Document Type', value: docType },
      { trait_type: 'File Hash', value: hash },
      { trait_type: 'Standard', value: 'ERC-5192 Soulbound' },
      { trait_type: 'Network', value: 'Anvil Local' },
    ],
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(metadata);
}
