import { SavePoint } from "./savePoint";

export type SavePointsProvidedListener = (savePoints: SavePoint[]) => void

export interface SavePointProvider {
    set onSavePointsProvided(listener: SavePointsProvidedListener);
}