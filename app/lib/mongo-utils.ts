import { ObjectId } from 'mongodb';

export function normalizeMongoDocument<T extends Record<string, unknown>>(document: T | null) {
  if (!document) return document;

  const rawId = (document as { _id?: unknown; id?: unknown })._id ?? (document as { id?: unknown }).id;
  const id = typeof rawId === 'string' ? rawId : rawId?.toString?.() ?? '';

  return {
    ...document,
    _id: id,
    id,
  } as T & { _id: string; id: string };
}

export function normalizeMongoDocuments<T extends Record<string, unknown>>(documents: T[]) {
  return documents.map((document) => normalizeMongoDocument(document));
}

export function buildIdFilter(id: string) {
  const filters: Array<Record<string, unknown>> = [{ _id: id }, { id }];

  if (ObjectId.isValid(id)) {
    filters.unshift({ _id: new ObjectId(id) });
  }

  return filters.length === 1 ? filters[0] : { $or: filters };
}