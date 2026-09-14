import PocketBase from "pocketbase";

export const pocketbaseUrl =
  process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090";

export function createPocketBase() {
  const client = new PocketBase(pocketbaseUrl);
  client.autoCancellation(false);
  return client;
}

export function fileUrl(collectionId: string, recordId: string, fileName?: string) {
  if (!fileName) return undefined;
  return `${pocketbaseUrl}/api/files/${collectionId}/${recordId}/${fileName}`;
}
