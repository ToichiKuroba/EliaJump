export function readResourceImage(selector: string, fallback: string) : HTMLImageElement {
    const image = document.querySelector<HTMLImageElement>(selector);
    if(!image) {
        const fallbackImage = document.querySelector<HTMLImageElement>(fallback);
        if(!fallbackImage) {
            throw new Error("Couldn't load resource!");
        }

        return fallbackImage;
    }

    return image;
}

export function readResourceImages(selectors: string[], fallback: string, selectorPrefix?: string) {
    return selectors.map(selector => readResourceImage((selectorPrefix ?? "") + selector, fallback));
}