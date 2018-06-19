import StorageFacade from './StorageFacade';
let instance: LocalStorageFacade | undefined = undefined;
export class LocalStorageFacade extends StorageFacade {
    /**
     * Creates instance or gets one which exists already
     */
    constructor() {
        super(window.localStorage);
        if (!instance) {
            instance = this;
        }
        return instance;
    }
}
