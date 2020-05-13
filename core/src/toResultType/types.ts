import parse, { PrimitiveType } from "../parse";

export type Field = {
  name: string | null;
  type: PrimitiveType;
  isNullable: boolean;
};

export type Source = { name: string; fields: Field[] };
