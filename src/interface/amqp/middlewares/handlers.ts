import R from "ramda";
import { Logger } from "@util/logger";
import { AmqpMessage, AmqpMessageHandler } from "@type/interface";

/* eslint-disable no-unused-vars*/
export type FuncHandler = ((_: AmqpMessage) => AmqpMessage) | AmqpMessageHandler;

/**
 * Creates a function to execute a list of handlers
 * @param handlers List of functions to be executed
 */
/* eslint-disable no-unused-vars*/
export const applyHandlers: (
  handlers: FuncHandler[],
) => ReturnType<FuncHandler> | AmqpMessageHandler = R.tryCatch(
  R.ifElse(
    // verify if the list of handlers has at least one handler
    (l) => R.gte(R.length(l), 1),
    // creates a pipe with all handlers
    // @ts-ignore
    (l) => R.pipe(...l),
    () => { throw new Error("Invalid number of handlers"); },
  ),
  // catch the execution error
  R.tap((e) => Logger.error(`Error: ${e}`)),
);
