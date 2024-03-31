import { AsyncRenderData } from "./asyncRenderData";

export interface AsyncRenderer {
    renderFrame(data: AsyncRenderData): void;
}