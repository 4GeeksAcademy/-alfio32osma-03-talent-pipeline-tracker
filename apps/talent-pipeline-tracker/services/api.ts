import type { Candidate, Note, Stage, Status } from "../types";

const BASE_URL = "/api/tracker";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${BASE_URL}${path}`, init);

	if (!response.ok) {
		throw new Error(await response.text());
	}

	return (await response.json()) as T;
}

async function requestVoid(path: string, init?: RequestInit): Promise<void> {
	const response = await fetch(`${BASE_URL}${path}`, init);

	if (!response.ok) {
		throw new Error(await response.text());
	}
}

export async function getRecords(): Promise<Candidate[]> {
	return requestJson<Candidate[]>("/records?page=1&limit=20");
}

export async function getRecordById(id: number | string): Promise<Candidate> {
	return requestJson<Candidate>(`/records/${id}`);
}

export async function createRecord(body: Omit<Candidate, "id">): Promise<Candidate> {
	return requestJson<Candidate>("/records", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
}

export async function updateRecord(id: number | string, body: Partial<Candidate>): Promise<Candidate> {
	return requestJson<Candidate>(`/records/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
}

type RecordPatchBody = { status?: Status } | { stage?: Stage };

export async function patchRecord(id: number | string, body: RecordPatchBody): Promise<Candidate> {
	return requestJson<Candidate>(`/records/${id}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
}

export async function getRecordNotes(id: number | string): Promise<Note[]> {
	return requestJson<Note[]>(`/records/${id}/notes`);
}

export async function createRecordNote(id: number | string, body: { content: string }): Promise<Note> {
	return requestJson<Note>(`/records/${id}/notes`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});
}

export async function deleteRecordNote(id: number | string, noteId: number | string): Promise<void> {
	return requestVoid(`/records/${id}/notes/${noteId}`, {
		method: "DELETE",
	});
}

export function handleApiError(error: unknown): string {
	if (error instanceof Error) {
		const message = error.message.trim();
		return message || "Ha ocurrido un error inesperado";
	}

	if (typeof error === "string") {
		const message = error.trim();
		return message || "Ha ocurrido un error inesperado";
	}

	return "Ha ocurrido un error inesperado";
}
