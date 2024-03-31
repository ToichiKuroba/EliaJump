import { isTransferImage } from "../image/imageHandler";
import { ImageMap } from "../image/imageMap";
import { OffscreenRenderer } from "../offscreenRenderer";
import { RenderMapImpl } from "../render/renderMap";
import { AsyncRenderData, IsAsyncRenderData } from "./asyncRenderData";

(function renderer() {
    const imageMap: ImageMap = new Map<string, ImageBitmap>();
    const renderMap = new RenderMapImpl(imageMap);
    let offscreenRenderer: OffscreenRenderer | null;
    let lastRenderData : AsyncRenderData | null;
    onmessage = (e) => {
        const {render, canvas, widthAdjustment, heightAdjustment, dpr, image} = e.data;

        if(canvas != null && canvas instanceof OffscreenCanvas) {
            offscreenRenderer = new OffscreenRenderer(canvas, renderMap);
        }else if(render && IsAsyncRenderData(render)) {
            offscreenRenderer?.renderFrame(render);
            lastRenderData = render;
            postMessage({renderCompletet: true});
        } else if(typeof widthAdjustment == "number" && typeof heightAdjustment == "number" && typeof dpr == "number") {
            offscreenRenderer?.adjustSize(widthAdjustment, heightAdjustment, dpr, lastRenderData?.yTranslation ?? 0);
        } else if(image && isTransferImage(image)) {
            imageMap.set(image.id, image.image);
        }
    }
})();