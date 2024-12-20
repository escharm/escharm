"use client";

import { WebContainer } from "@webcontainer/api";

export const webcontainerInstance = await WebContainer.boot();
