declare global {
  type MessageFormat = {
    id: number;
    type:
      | "config/get"
      | "config_screen/show"
      | "connection-status"
      | "theme-update"
      | "haptic"
      | "tag/write";
    payload?: unknown;
  };

  interface MessageTypeConnectionStatusPayload {
    event: "connected" | "disconnected";
  }

  interface SuccessResult {
    id: number;
    type: "result";
    success: true;
    result: unknown;
  }

  interface ErrorResult {
    id: number;
    type: "result";
    success: false;
    error: {
      code: string;
      message: string;
    };
  }

  interface Window {
    externalApp: typeof externalAppHandler;
    externalBus: (message: SuccessResult | ErrorResult) => void;
  }
}

export {};
