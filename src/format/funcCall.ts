import { FuncCall } from "../types";

export default function funcCall(c: FuncCall): string {
  return `${c.funcname[0].String.str}()`;
}
