import StorageFacade from './StorageFacade';
let instance = undefined;
export  class LocalStorageFacade extends StorageFacade {
    /**
     * Creates instance or gets one which exists already
     */
    constructor() {
        super(localStorage);
        if (!instance) {
            instance = this;
        }
        return instance;
    }
}
