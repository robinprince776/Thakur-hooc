import React, { useState, useMemo } from 'react';
import {
  Shield,
  Terminal,
  Code2,
  Copy,
  Check,
  Search,
  BookOpen,
  ArrowRight,
  Server,
  Layers,
  FileJson,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface StatusCodeInfo {
  code: number;
  phrase: string;
  category: '1xx' | '2xx' | '3xx' | '4xx' | '5xx';
  meaning: string;
  troubleshooting: string;
}

const STATUS_CODES: StatusCodeInfo[] = [
  { code: 200, phrase: 'OK', category: '2xx', meaning: 'Request succeeded and response payload contains the requested data.', troubleshooting: 'Ensure payload response body matches client contract.' },
  { code: 201, phrase: 'Created', category: '2xx', meaning: 'Resource was created successfully (usually following POST/PUT).', troubleshooting: 'Check Location header to inspect newly created resource URL.' },
  { code: 204, phrase: 'No Content', category: '2xx', meaning: 'Request succeeded, but server has intentionally returned no body.', troubleshooting: 'Common in DELETE requests or notifications; client should not parse response JSON.' },
  { code: 301, phrase: 'Moved Permanently', category: '3xx', meaning: 'Target resource has been assigned a new permanent URI.', troubleshooting: 'Update bookmarks/hardcoded URLs; check Location header.' },
  { code: 304, phrase: 'Not Modified', category: '3xx', meaning: 'Resource has not been modified since the version specified in request headers (If-None-Match/ETag).', troubleshooting: 'Client can safely use its locally cached response; saves bandwidth.' },
  { code: 400, phrase: 'Bad Request', category: '4xx', meaning: 'Server could not understand the request due to invalid syntax or malformed JSON.', troubleshooting: 'Inspect request body against API schema; check types, commas, and mandatory fields.' },
  { code: 401, phrase: 'Unauthorized', category: '4xx', meaning: 'Authentication credentials are missing or invalid.', troubleshooting: 'Verify Bearer token, check expiration, ensure Authorization header format: "Bearer <token>".' },
  { code: 403, phrase: 'Forbidden', category: '4xx', meaning: 'Server understands credentials, but user lacks permissions (RBAC) to access resource.', troubleshooting: 'Verify user roles/scopes; check database row-level security or ACL policies.' },
  { code: 404, phrase: 'Not Found', category: '4xx', meaning: 'Target resource URI does not exist on the server.', troubleshooting: 'Double-check URL spelling, trailing slashes, route parameters, and HTTP method.' },
  { code: 405, phrase: 'Method Not Allowed', category: '4xx', meaning: 'HTTP method used is not supported by target resource.', troubleshooting: 'Check Allowed methods header; e.g. using POST on a GET-only endpoint.' },
  { code: 409, phrase: 'Conflict', category: '4xx', meaning: 'Request conflicts with current server state (e.g. duplicate email in database).', troubleshooting: 'Check unique constraints or concurrent optimistic locking versions.' },
  { code: 422, phrase: 'Unprocessable Entity', category: '4xx', meaning: 'Syntax is valid, but semantic validation failed (e.g. invalid email format or negative price).', troubleshooting: 'Read response error details to see which field validation rule triggered.' },
  { code: 429, phrase: 'Too Many Requests', category: '4xx', meaning: 'Client has sent too many requests in a given amount of time (rate limited).', troubleshooting: 'Check Retry-After header; implement client-side exponential backoff and jitter.' },
  { code: 500, phrase: 'Internal Server Error', category: '5xx', meaning: 'Generic server-side uncaught exception or crash.', troubleshooting: 'Inspect backend server application logs; check database connection timeouts.' },
  { code: 502, phrase: 'Bad Gateway', category: '5xx', meaning: 'Reverse proxy/gateway (Nginx, Cloudflare) received an invalid response from upstream.', troubleshooting: 'Verify upstream Node/Python backend process is running and bound to correct internal port.' },
  { code: 503, phrase: 'Service Unavailable', category: '5xx', meaning: 'Server is overloaded, down for maintenance, or experiencing cold starts.', troubleshooting: 'Check autoscaling limits, CPU spikes, or scheduled downtime notices.' },
  { code: 504, phrase: 'Gateway Timeout', category: '5xx', meaning: 'Gateway timed out waiting for upstream server to respond.', troubleshooting: 'Optimize slow SQL queries; increase proxy read timeouts or delegate heavy work to background workers.' }
];

const COMMON_HEADERS = [
  { name: 'Authorization', category: 'Auth', description: 'Carries credentials (e.g. Bearer token, Basic auth) to authenticate user.' },
  { name: 'Access-Control-Allow-Origin', category: 'CORS', description: 'Specifies which origins (* or specific domain) are permitted to read response.' },
  { name: 'Access-Control-Allow-Methods', category: 'CORS', description: 'Lists HTTP methods allowed during CORS preflight (OPTIONS) check.' },
  { name: 'Content-Type', category: 'Entity', description: 'Declares MIME type of body (e.g. application/json, multipart/form-data).' },
  { name: 'Cache-Control', category: 'Caching', description: 'Directives for caching (e.g. max-age=3600, no-cache, public, stale-while-revalidate).' },
  { name: 'Content-Security-Policy (CSP)', category: 'Security', description: 'Restricts sources from which scripts, styles, images can be loaded; mitigates XSS.' },
  { name: 'Strict-Transport-Security (HSTS)', category: 'Security', description: 'Forces browsers to only communicate via HTTPS for specified duration.' },
  { name: 'X-Frame-Options', category: 'Security', description: 'Prevents clickjacking by controlling if page can be framed (DENY, SAMEORIGIN).' }
];

export const ApiXApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'curl' | 'status' | 'headers' | 'mock' | 'methods'>('curl');
  const [curlInput, setCurlInput] = useState(
    `curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer my_jwt_token_123" \\
  -d '{"name": "Prince Thakur", "role": "admin"}'`
  );
  const [targetLang, setTargetLang] = useState<'fetch' | 'axios' | 'python' | 'go' | 'c'>('fetch');
  const [copied, setCopied] = useState(false);

  // Status code search
  const [statusSearch, setStatusSearch] = useState('');
  const [statusCategory, setStatusCategory] = useState('All');

  // JSON Mock State
  const [jsonInput, setJsonInput] = useState(`{
  "status": "success",
  "data": {
    "userId": 1042,
    "username": "prince_dev",
    "roles": ["admin", "architect"],
    "verified": true,
    "metrics": {
      "requests": 4500,
      "latencyMs": 14.2
    }
  }
}`);
  const [jsonValidationResult, setJsonValidationResult] = useState<{ valid: boolean; error?: string }>({ valid: true });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert cURL to Target Language
  const convertedCode = useMemo(() => {
    const raw = curlInput.trim();
    if (!raw) return '// Paste a valid cURL command above to convert.';

    // Extract URL
    const urlMatch = raw.match(/https?:\/\/[^\s"'\\]+/);
    const url = urlMatch ? urlMatch[0] : 'https://api.example.com/endpoint';

    // Extract Method
    let method = 'GET';
    const methodMatch = raw.match(/-X\s+([A-Z]+)/);
    if (methodMatch) {
      method = methodMatch[1];
    } else if (raw.includes('-d ') || raw.includes('--data')) {
      method = 'POST';
    }

    // Extract Data
    let bodyData = '';
    const dataMatch = raw.match(/-d\s+['"]([\s\S]*?)['"]/) || raw.match(/--data(-raw)?\s+['"]([\s\S]*?)['"]/);
    if (dataMatch) {
      bodyData = dataMatch[1] || dataMatch[2] || '';
    }

    // Extract Headers
    const headers: Record<string, string> = {};
    const headerRegex = /-H\s+['"]([^'"]+)['"]/g;
    let hMatch;
    while ((hMatch = headerRegex.exec(raw)) !== null) {
      const parts = hMatch[1].split(':');
      if (parts.length >= 2) {
        headers[parts[0].trim()] = parts.slice(1).join(':').trim();
      }
    }

    if (targetLang === 'fetch') {
      const headersStr = JSON.stringify(headers, null, 4);
      return `// JavaScript / TypeScript Fetch API
async function executeRequest() {
  const url = '${url}';
  const options = {
    method: '${method}',
    headers: ${headersStr}${
      bodyData
        ? `,\n    body: JSON.stringify(${bodyData})`
        : ''
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    console.log('Success:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

executeRequest();`;
    }

    if (targetLang === 'axios') {
      return `// JavaScript / TypeScript Axios
import axios from 'axios';

async function executeRequest() {
  try {
    const response = await axios({
      method: '${method.toLowerCase()}',
      url: '${url}',
      headers: ${JSON.stringify(headers, null, 6)}${
        bodyData ? `,\n      data: ${bodyData}` : ''
      }
    });

    console.log('Data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Axios error:', error.response?.data || error.message);
  }
}

executeRequest();`;
    }

    if (targetLang === 'python') {
      return `# Python 3 Requests
import requests

url = "${url}"
headers = ${JSON.stringify(headers, null, 4)}
${bodyData ? `payload = ${bodyData}\n` : ''}
try:
    response = requests.${method.toLowerCase()}(
        url,
        headers=headers${bodyData ? ',\n        json=payload' : ''},
        timeout=10
    )
    response.raise_for_status()
    print("Response Status:", response.status_code)
    print("Response JSON:", response.json())
except requests.exceptions.RequestException as e:
    print("Request failed:", e)`;
    }

    if (targetLang === 'go') {
      return `// Go (Golang) net/http
package main

import (
\t"bytes"
\t"fmt"
\t"io"
\t"net/http"
)

func main() {
\turl := "${url}"
\t${bodyData ? `var payload = []byte(\`${bodyData}\`)\n\treq, err := http.NewRequest("${method}", url, bytes.NewBuffer(payload))` : `req, err := http.NewRequest("${method}", url, nil)`}
\tif err != nil {
\t\tpanic(err)
\t}

\t// Set Headers
${Object.entries(headers)
  .map(([k, v]) => `\treq.Header.Set("${k}", "${v}")`)
  .join('\n')}

\tclient := &http.Client{}
\tresp, err := client.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\tbody, _ := io.ReadAll(resp.Body)
\tfmt.Printf("Status: %s\\n", resp.Status)
\tfmt.Println(string(body))
}`;
    }

    if (targetLang === 'c') {
      return `/* C Programming with libcurl */
#include <stdio.h>
#include <curl/curl.h>

int main(void) {
    CURL *curl;
    CURLcode res;

    curl = curl_easy_init();
    if(curl) {
        struct curl_slist *headers = NULL;
${Object.entries(headers)
  .map(([k, v]) => `        headers = curl_slist_append(headers, "${k}: ${v}");`)
  .join('\n')}

        curl_easy_setopt(curl, CURLOPT_URL, "${url}");
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${method}");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
${bodyData ? `        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "${bodyData.replace(/"/g, '\\"')}");` : ''}

        res = curl_easy_perform(curl);
        if(res != CURLE_OK) {
            fprintf(stderr, "curl_easy_perform() failed: %s\\n", curl_easy_strerror(res));
        }

        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
    }
    return 0;
}`;
    }

    return '';
  }, [curlInput, targetLang]);

  // Format and Validate JSON
  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
      setJsonValidationResult({ valid: true });
    } catch (err: any) {
      setJsonValidationResult({ valid: false, error: err.message });
    }
  };

  const filteredStatusCodes = useMemo(() => {
    return STATUS_CODES.filter((item) => {
      const matchesCategory = statusCategory === 'All' || item.category === statusCategory;
      const matchesSearch =
        item.code.toString().includes(statusSearch) ||
        item.phrase.toLowerCase().includes(statusSearch.toLowerCase()) ||
        item.meaning.toLowerCase().includes(statusSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [statusCategory, statusSearch]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Server className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                API-X Studio
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Testing Lab
                </span>
              </h1>
              <p className="text-xs text-slate-400">cURL Converter, Status Inspector &amp; JSON Mock Lab</p>
            </div>
          </div>

          <a
            href="#bcaverse"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            Back to Suite
          </a>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/50 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5">
          {[
            { id: 'curl', label: 'cURL Converter', icon: Terminal },
            { id: 'status', label: 'HTTP Status Cheat-Sheet', icon: Shield },
            { id: 'headers', label: 'Headers Inspector', icon: Layers },
            { id: 'mock', label: 'JSON Mock & Validator', icon: FileJson },
            { id: 'methods', label: 'HTTP Methods Guide', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'curl' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Paste cURL Command
                </span>
                <button
                  onClick={() =>
                    setCurlInput(`curl -X POST https://api.example.com/v1/orders \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer my_secret_token" \\
  -d '{"itemId": 99, "quantity": 2, "price": 49.99}'`)
                  }
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Load Example
                </button>
              </div>
              <textarea
                rows={9}
                value={curlInput}
                onChange={(e) => setCurlInput(e.target.value)}
                placeholder="Paste curl command here..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 outline-none focus:border-emerald-500 leading-relaxed resize-none shadow-inner"
              />

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Supported Parameters:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-mono">
                  <div>-X / --request (GET, POST, etc.)</div>
                  <div>-H / --header (Headers)</div>
                  <div>-d / --data (JSON Payload)</div>
                  <div>Auto-detects Bearer Tokens</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                  {(['fetch', 'axios', 'python', 'go', 'c'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setTargetLang(lang)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer ${
                        targetLang === lang
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleCopy(convertedCode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
                <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Generated Code ({targetLang})</span>
                  <span>Ready to paste</span>
                </div>
                <pre className="p-4 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre leading-relaxed max-h-[380px] select-text">
                  {convertedCode}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'status' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['All', '2xx', '3xx', '4xx', '5xx'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setStatusCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                      statusCategory === cat
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={statusSearch}
                  onChange={(e) => setStatusSearch(e.target.value)}
                  placeholder="Search by code (e.g. 404, 502)..."
                  className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 w-full sm:w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStatusCodes.map((st) => (
                <div
                  key={st.code}
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-black text-sm px-2.5 py-0.5 rounded-lg border ${
                            st.category === '2xx'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : st.category === '3xx'
                              ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
                              : st.category === '4xx'
                              ? 'bg-amber-950 text-amber-400 border-amber-800'
                              : 'bg-rose-950 text-rose-400 border-rose-800'
                          }`}
                        >
                          {st.code}
                        </span>
                        <h3 className="font-bold text-white text-sm">{st.phrase}</h3>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">{st.category}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">{st.meaning}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
                    <strong className="text-slate-300">Troubleshooting:</strong> {st.troubleshooting}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMMON_HEADERS.map((h) => (
                <div
                  key={h.name}
                  className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all shadow-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-xs font-bold text-emerald-300 font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      {h.name}
                    </code>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700">
                      {h.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">{h.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mock' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-emerald-400" />
                  JSON Input / Webhook Payload
                </span>
                <button
                  onClick={formatJson}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Beautify &amp; Validate</span>
                </button>
              </div>

              <textarea
                rows={12}
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  try {
                    JSON.parse(e.target.value);
                    setJsonValidationResult({ valid: true });
                  } catch (err: any) {
                    setJsonValidationResult({ valid: false, error: err.message });
                  }
                }}
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 outline-none focus:border-emerald-500 leading-relaxed resize-none shadow-inner"
              />

              <div
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                  jsonValidationResult.valid
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800 text-rose-300'
                }`}
              >
                {jsonValidationResult.valid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Valid JSON Format</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Syntax Error: {jsonValidationResult.error}</span>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Inferred TypeScript Interface
                </span>
                <button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(jsonInput);
                      const keys = Object.keys(parsed)
                        .map((k) => `  ${k}: ${typeof parsed[k]};`)
                        .join('\n');
                      const ts = `interface AutoGeneratedType {\n${keys}\n}`;
                      handleCopy(ts);
                    } catch {
                      handleCopy('// Invalid JSON');
                    }
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy TS Type</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed min-h-[280px]">
                {(() => {
                  try {
                    const parsed = JSON.parse(jsonInput);
                    return (
                      <pre>
                        {`export interface MockResponse {\n` +
                          Object.entries(parsed)
                            .map(([key, val]) => {
                              const type = Array.isArray(val)
                                ? `${typeof val[0] || 'any'}[]`
                                : typeof val === 'object' && val !== null
                                ? 'Record<string, any>'
                                : typeof val;
                              return `  ${key}: ${type};`;
                            })
                            .join('\n') +
                          `\n}`}
                      </pre>
                    );
                  } catch {
                    return <span className="text-rose-400">// Fix JSON syntax to preview TypeScript model</span>;
                  }
                })()}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'methods' && (
          <div className="space-y-4">
            {[
              { method: 'GET', safe: 'Yes', idempotent: 'Yes', body: 'No', usage: 'Retrieve representation of a resource. Must never modify server state.' },
              { method: 'POST', safe: 'No', idempotent: 'No', body: 'Yes', usage: 'Create a subordinate resource or trigger non-idempotent server-side processing.' },
              { method: 'PUT', safe: 'No', idempotent: 'Yes', body: 'Yes', usage: 'Replace entire target resource with uploaded payload. Repeating yields same state.' },
              { method: 'PATCH', safe: 'No', idempotent: 'No (typically)', body: 'Yes', usage: 'Apply partial modifications to a resource (e.g. updating a single field).' },
              { method: 'DELETE', safe: 'No', idempotent: 'Yes', body: 'Optional', usage: 'Delete target resource. Calling multiple times still leaves resource deleted.' },
              { method: 'OPTIONS', safe: 'Yes', idempotent: 'Yes', body: 'No', usage: 'Query communication options / CORS preflight verification.' },
            ].map((m) => (
              <div key={m.method} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-20 text-center font-mono font-bold text-xs px-2 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-400">
                    {m.method}
                  </span>
                  <p className="text-xs text-slate-300">{m.usage}</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 shrink-0">
                  <span>Safe: <strong className={m.safe === 'Yes' ? 'text-emerald-400' : 'text-amber-400'}>{m.safe}</strong></span>
                  <span>Idempotent: <strong className={m.idempotent === 'Yes' ? 'text-emerald-400' : 'text-amber-400'}>{m.idempotent}</strong></span>
                  <span>Body: <strong className="text-slate-300">{m.body}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
