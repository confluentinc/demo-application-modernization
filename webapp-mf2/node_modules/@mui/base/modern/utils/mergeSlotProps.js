import _extends from "@babel/runtime/helpers/esm/extends";
import clsx from 'clsx';
import extractEventHandlers from './extractEventHandlers';
import omitEventHandlers from './omitEventHandlers';

/**
 * Merges the slot component internal props (usually coming from a hook)
 * with the externally provided ones.
 *
 * The merge order is (the latter overrides the former):
 * 1. The internal props (specified as a getter function to work with get*Props hook result)
 * 2. Additional props (specified internally on an unstyled component)
 * 3. External props specified on the owner component. These should only be used on a root slot.
 * 4. External props specified in the `componentsProps.*` prop.
 * 5. The `className` prop - combined from all the above.
 * @param parameters
 * @returns
 */
export default function mergeSlotProps(parameters) {
  const {
    getSlotProps,
    additionalProps,
    externalSlotProps,
    externalForwardedProps,
    className
  } = parameters;

  if (!getSlotProps) {
    // The simpler case - getSlotProps is not defined, so no internal event handlers are defined,
    // so we can simply merge all the props without having to worry about extracting event handlers.
    const joinedClasses = clsx(externalForwardedProps?.className, externalSlotProps?.className, className, additionalProps?.className);

    const props = _extends({}, additionalProps, externalForwardedProps, externalSlotProps, {
      className: joinedClasses
    });

    if (joinedClasses.length === 0) {
      delete props.className;
    }

    return {
      props,
      internalRef: undefined
    };
  } // In this case, getSlotProps is responsible for calling the external event handlers.
  // We don't need to include them in the merged props because of this.


  const eventHandlers = extractEventHandlers(_extends({}, externalForwardedProps, externalSlotProps));
  const componentsPropsWithoutEventHandlers = omitEventHandlers(externalSlotProps);
  const otherPropsWithoutEventHandlers = omitEventHandlers(externalForwardedProps);
  const internalSlotProps = getSlotProps(eventHandlers);
  const joinedClasses = clsx(externalForwardedProps?.className, externalSlotProps?.className, className, additionalProps?.className, internalSlotProps?.className);

  const props = _extends({}, internalSlotProps, additionalProps, otherPropsWithoutEventHandlers, componentsPropsWithoutEventHandlers, {
    className: joinedClasses
  });

  if (joinedClasses.length === 0) {
    delete props.className;
  }

  return {
    props,
    internalRef: internalSlotProps.ref
  };
}