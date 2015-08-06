/*
 * action types
 */

export const EXAMPLE = 'EXAMPLE';

export function example(text) {
  return {
    type: EXAMPLE,
    text
  };
}