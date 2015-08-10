/*
 * action types
 */

export const SETSHOPS = 'SETSHOPS';

export function setShops(shop) {
  return {
    type: SETSHOPS,
    shop
  };
}