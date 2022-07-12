/**
 * Creates a type that is T with removed properties that are functions with names beginning with `on`.
 * Note that it does not exactly follow the logic of `omitEventHandlers` as it also removes fields where
 * `on` is followed by a non-letter character,
 */

/**
 * Removes event handlers from the given object.
 * A field is considered an event handler if it is a function with a name beginning with `on`.
 *
 * @param object Object to remove event handlers from.
 * @returns Object with event handlers removed.
 */
export default function omitEventHandlers(object) {
  if (object === undefined) {
    return {};
  }

  const result = {};
  Object.keys(object).filter(prop => !(prop.match(/^on[A-Z]/) && typeof object[prop] === 'function')).forEach(prop => {
    result[prop] = object[prop];
  });
  return result;
}