import { app } from "electron";

export async function configureSingleInstance() {
  const gotLock = app.requestSingleInstanceLock();

  if (!gotLock) {
    process.exit();
  }
}
