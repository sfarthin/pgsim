export type KeysOfUnion<T> = T extends any ? keyof T : never;
