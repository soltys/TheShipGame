import * as _ from 'lodash';

export enum DisplayLayer {
    Background,
    Main,
    Ui,
    Overlay
}

export function getNumberOfLayers(): number {
    return _.max(getValues(DisplayLayer));
}

//https://github.com/slavik57/enum-values
function getValues(e: any) {
    return getObjectValues(e).filter(v => typeof v === 'number') as number[];
}

function getObjectValues(e: any): (number | string)[] {
    return Object.keys(e).map(k => e[k]);
}

export default DisplayLayer;
