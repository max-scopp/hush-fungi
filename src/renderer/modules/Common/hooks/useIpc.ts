import { IpcRendererEvent } from "electron/renderer";
import { useCallback, useRef } from "react";
import { Channel } from "src/shared/channels";
import { useLogger } from "./useLogger";

/**
 * Custom React Hook that listen to channel. When a new message arrives `listener` would be called with `listener(event, args...)`
 * @param {string} channel - The name of the channel
 * @param {Function} listener - The handler function
 */
export function useIpc(channel: Channel) {
  const { log } = useLogger("useIpc()");
  const savedHandler = useRef({});

  const listen = useCallback(
    (
      channel: Channel,
      callback: (event: IpcRendererEvent, ...args: unknown[]) => void,
    ) => {},
    [],
  );
}
