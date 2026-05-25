"use client";

import { useEffect, useState } from "react";

const BASE_URL = "/api/tracker";
const DOCS_URL = "/api/tracker/docs#/Records";

type DiagnosticResult = {
  title: string;
  url: string;
  method: string;
  status: number | null;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  rawBody: string;
  serverErrorMessage: string | null;
};

function normalizeHeaders(headers: Headers): Record<string, string> {
  const entries = Array.from(headers.entries()).sort(([a], [b]) => a.localeCompare(b));
  return Object.fromEntries(entries);
}

function tryParseJson(text: string): unknown {
  if (!text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getRecordList(body: unknown): Record<string, unknown>[] {
  if (Array.isArray(body)) return body as Record<string, unknown>[];
  if (body && typeof body === "object") {
    const obj = body as { results?: unknown; items?: unknown; records?: unknown; data?: unknown };
    if (Array.isArray(obj.results)) return obj.results as Record<string, unknown>[];
    if (Array.isArray(obj.items)) return obj.items as Record<string, unknown>[];
    if (Array.isArray(obj.records)) return obj.records as Record<string, unknown>[];
    if (Array.isArray(obj.data)) return obj.data as Record<string, unknown>[];
    if (obj.data && typeof obj.data === "object") {
      const nested = obj.data as { results?: unknown; items?: unknown; records?: unknown };
      if (Array.isArray(nested.results)) return nested.results as Record<string, unknown>[];
      if (Array.isArray(nested.items)) return nested.items as Record<string, unknown>[];
      if (Array.isArray(nested.records)) return nested.records as Record<string, unknown>[];
    }
  }
  return [];
}

async function runRequest(
  title: string,
  url: string,
  init?: RequestInit
): Promise<DiagnosticResult> {
  try {
    const response = await fetch(url, init);
    const rawBody = await response.text();
    const parsedBody = tryParseJson(rawBody);

    return {
      title,
      url,
      method: init?.method ?? "GET",
      status: response.status,
      statusText: response.statusText,
      headers: normalizeHeaders(response.headers),
      body: parsedBody,
      rawBody,
      serverErrorMessage: response.ok ? null : rawBody || response.statusText,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      title,
      url,
      method: init?.method ?? "GET",
      status: null,
      statusText: "NETWORK_ERROR",
      headers: {},
      body: null,
      rawBody: "",
      serverErrorMessage: message,
    };
  }
}

export default function ApiTestPage() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function runDiagnostics() {
      const items: DiagnosticResult[] = [];

      const recordsUrl = `${BASE_URL}/records?page=1&limit=20`;
      const recordsResult = await runRequest("1) GET /records", recordsUrl);
      items.push(recordsResult);

      let firstId: string | number | undefined;
      const recordsList = getRecordList(recordsResult.body);
      if (recordsList.length > 0) {
        const firstRecord = recordsList[0];
        firstId = firstRecord?.id as string | number | undefined;
      }

      if (firstId !== undefined && firstId !== null && String(firstId).trim() !== "") {
        const recordByIdUrl = `${BASE_URL}/records/${firstId}`;
        const recordByIdResult = await runRequest("2) GET /records/{id}", recordByIdUrl);
        items.push(recordByIdResult);

        const notesUrl = `${BASE_URL}/records/${firstId}/notes`;
        const notesResult = await runRequest("3) GET /records/{id}/notes", notesUrl);
        items.push(notesResult);
      } else {
        items.push({
          title: "2) GET /records/{id}",
          url: "No ejecutado",
          method: "GET",
          status: null,
          statusText: "SKIPPED",
          headers: {},
          body: { reason: "No se obtuvo id en el primer registro" },
          rawBody: "",
          serverErrorMessage: "No se obtuvo id en el primer registro",
        });

        items.push({
          title: "3) GET /records/{id}/notes",
          url: "No ejecutado",
          method: "GET",
          status: null,
          statusText: "SKIPPED",
          headers: {},
          body: { reason: "No se obtuvo id en el primer registro" },
          rawBody: "",
          serverErrorMessage: "No se obtuvo id en el primer registro",
        });
      }

      const postUrl = `${BASE_URL}/records`;
      const postResult = await runRequest("4) POST /records", postUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: "Test User",
          email: "test@test.com",
          position: "test",
        }),
      });
      items.push(postResult);

      if (active) {
        setResults(items);
        setLoading(false);
      }
    }

    runDiagnostics();

    return () => {
      active = false;
    };
  }, []);

  const firstRecordsBody = results[0]?.body;
  const firstTwoObjects = getRecordList(firstRecordsBody).length > 0
    ? getRecordList(firstRecordsBody).slice(0, 2)
    : { note: "La respuesta no fue un array" };

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Diagnostico API real</h1>
      <p className="text-sm text-gray-600">Base URL: {BASE_URL}</p>
      <p className="text-sm text-gray-600">Docs URL: {DOCS_URL}</p>
      {loading && <p>Ejecutando llamadas...</p>}

      {results.length > 0 && (
        <section className="border rounded p-4">
          <h2 className="font-semibold mb-2">Primeros 2 objetos de GET /records</h2>
          <pre className="text-xs overflow-auto bg-gray-50 p-3 rounded">
            {JSON.stringify(firstTwoObjects, null, 2)}
          </pre>
        </section>
      )}

      {results.map((result) => (
        <section key={result.title} className="border rounded p-4 space-y-3">
          <h2 className="font-semibold">{result.title}</h2>
          <p>
            <strong>Metodo:</strong> {result.method}
          </p>
          <p>
            <strong>URL:</strong> {result.url}
          </p>
          <p>
            <strong>Status:</strong> {result.status !== null ? `${result.status} ${result.statusText}` : result.statusText}
          </p>

          <div>
            <h3 className="font-medium">Headers</h3>
            <pre className="text-xs overflow-auto bg-gray-50 p-3 rounded">
              {JSON.stringify(result.headers, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-medium">Body completo</h3>
            <pre className="text-xs overflow-auto bg-gray-50 p-3 rounded">
              {JSON.stringify(result.body, null, 2)}
            </pre>
          </div>

          {result.serverErrorMessage && (
            <div>
              <h3 className="font-medium text-red-700">Mensaje de error del servidor</h3>
              <pre className="text-xs overflow-auto bg-red-50 p-3 rounded text-red-900">
                {result.serverErrorMessage}
              </pre>
            </div>
          )}
        </section>
      ))}
    </main>
  );
}
