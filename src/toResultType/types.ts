import { PrimitiveType } from "./getPrimitiveType";

export type Field = {
  name: string | null;
  type: PrimitiveType;
  isNullable: boolean;
};

export type Source = { name: string; fields: Field[] };
