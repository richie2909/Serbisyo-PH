export const encodeFile = (data: ArrayBuffer): Uint8Array => new Uint8Array(data);
export const decodeFile = (data: Uint8Array): ArrayBuffer => data.slice().buffer;