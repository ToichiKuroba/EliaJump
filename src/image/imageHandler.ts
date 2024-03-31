export class ImageHandler {
    private _renderWorker: Worker;
    private _loadedImageMaps: string[] = [];
    constructor(renderWorker: Worker) {
        this._renderWorker = renderWorker;

    }

    queryImages(selectors: string[], fallback: string, selectorPrefix?: string, options?: ImageBitmapOptions) {
        return selectors.map(selector => this.queryImage((selectorPrefix ?? "") + selector, fallback, options));
    }   

    queryImage(selector: string, fallback: string, options?: ImageBitmapOptions) {
        const image = document.querySelector<HTMLImageElement>(selector);
        if(!image) {
            const fallbackImage = document.querySelector<HTMLImageElement>(fallback);
            if(!fallbackImage) {
                throw new Error("Couldn't load resource!");
            }
    
            return this.loadImage(fallbackImage, options);
        }
    
        return this.loadImage(image, options);
    }

    loadImage(image: HTMLImageElement, options?: ImageBitmapOptions) : string {
        const id = image.src;
        if(this._loadedImageMaps.indexOf(id) >= 0) {
            return id;
        }

        this._loadedImageMaps.push(id);
        createImageBitmap(image, options).then(bitmap => {
            this._renderWorker.postMessage({image: {id, image: bitmap} as TransferImage}, [bitmap]);
        });

        return id;
    }
}

export function isTransferImage(value: any) : value is TransferImage {
    const transferImage = value as TransferImage;
    return transferImage.id !== undefined && transferImage.image !== undefined;
}

export interface TransferImage {
    id: string,
    image: ImageBitmap
}