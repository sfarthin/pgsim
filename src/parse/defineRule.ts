/**
 * To prevent circular dependencies, lets wrap definitions in defineRule(() => ...).
 * https://railsware.com/blog/how-to-analyze-circular-dependencies-in-es6/
 *
 * This file intentially has zero dependencies (outside types)
 */
import type { Rule, Context } from "./util";

export const defineRule = <T>(ruleDefinition: () => Rule<T>) => (
  ctx: Context
) => ruleDefinition()(ctx);
