type beginMethod = (timestamp: number, delta: number) => void;
type updateMethod = (delta: number) => void;
type drawMethod = (interpolationPercentage: number) => void;
type endMethod = (fps: number, panic: boolean) => void;
export default class MainLoop {
    // The amount of time (in milliseconds) to simulate each time update()
    // runs. See `MainLoop.setSimulationTimestep()` for details.
    private simulationTimestep = 1000 / 60;

    // The cumulative amount of in-app time that hasn't been simulated yet.
    // See the comments inside animate() for details.
    private frameDelta = 0;

    // The timestamp in milliseconds of the last time the main loop was run.
    // Used to compute the time elapsed between frames.
    private lastFrameTimeMs = 0;

    // An exponential moving average of the frames per second.
    private fps = 60;

    // A factor that affects how heavily to weight more recent seconds'
    // performance when calculating the average frames per second. Valid values
    // range from zero to one inclusive. Higher values result in weighting more
    // recent seconds more heavily.
    private fpsAlpha = 0.9;

    // The minimum duration between updates to the frames-per-second estimate.
    // Higher values increase accuracy, but result in slower updates.
    private fpsUpdateInterval = 1000;

    // The timestamp (in milliseconds) of the last time the `fps` moving
    // average was updated.
    private lastFpsUpdate = 0;

    // The number of frames delivered since the last time the `fps` moving
    // average was updated (i.e. since `lastFpsUpdate`).
    private framesSinceLastFpsUpdate = 0;

    // The number of times update() is called in a given frame. This is only
    // relevant inside of animate(), but a reference is held externally so that
    // this variable is not marked for garbage collection every time the main
    // loop runs.
    private numUpdateSteps = 0;

    // The minimum amount of time in milliseconds that must pass since the last
    // frame was executed before another frame can be executed. The
    // multiplicative inverse caps the FPS (the default of zero means there is
    // no cap).
    private minFrameDelay = 0;

    // Whether the main loop is running.
    private running = false;

    // `true` if `MainLoop.start()` has been called and the most recent time it
    // was called has not been followed by a call to `MainLoop.stop()`. This is
    // different than `running` because there is a delay of a few milliseconds
    // after `MainLoop.start()` is called before the application is considered
    // "running." This delay is due to waiting for the next frame.
    private started = false;

    // Whether the simulation has fallen too far behind real time.
    // Specifically, `panic` will be set to `true` if too many updates occur in
    // one frame. This is only relevant inside of animate(), but a reference is
    // held externally so that this variable is not marked for garbage
    // collection every time the main loop runs.
    private panic = false;

    // In all major browsers, replacing non-specified functions with NOOPs
    // seems to be as fast or slightly faster than using conditions to only
    // call the functions if they are specified. This is probably due to empty
    // functions being optimized away. http://jsperf.com/noop-vs-condition
    private NOOP = function () { };

    // A function that runs at the beginning of the main loop.
    // See `MainLoop.setBegin()` for details.
    private begin: beginMethod = this.NOOP;

    // A function that runs updates (i.e. AI and physics).
    // See `MainLoop.setUpdate()` for details.
    private update: updateMethod = this.NOOP;

    // A function that draws things on the screen.
    // See `MainLoop.setDraw()` for details.
    private draw: drawMethod = this.NOOP;

    // A function that runs at the end of the main loop.
    // See `MainLoop.setEnd()` for details.
    private end: endMethod = this.NOOP;

    // The ID of the currently executing frame. Used to cancel frames when
    // stopping the loop.
    private rafHandle: number;

    /**
     * Gets how many milliseconds should be simulated by every run of update().
     *
     * See `MainLoop.setSimulationTimestep()` for details on this value.
     *
     * @return {Number}
     *   The number of milliseconds that should be simulated by every run of
     *   {@link #setUpdate update}().
     */
    public getSimulationTimestep(): number {
        return this.simulationTimestep;
    }

    /**
     * Sets how many milliseconds should be simulated by every run of update().
     *
     * @param {Number} timestep
     *   The number of milliseconds that should be simulated by every run of
     *   {@link #setUpdate update}().
     */
    public setSimulationTimestep(timestep: number) {
        this.simulationTimestep = timestep;
        return this;
    }

    /**
     * Returns the exponential moving average of the frames per second.
     *
     * @return {Number}
     *   The exponential moving average of the frames per second.
     */
    public getFPS() {
        return this.fps;
    }

    /**
     * Gets the maximum frame rate.
     * @return {Number}
     *   The maximum number of frames per second allowed.
     */
    public getMaxAllowedFPS(): number {
        return 1000 / this.minFrameDelay;
    }

    /**
     * Sets a maximum frame rate.
     *
     * See also `MainLoop.getMaxAllowedFPS()`.
     *
     * @param {Number} [fps=Infinity]
     * @chainable
     */
    public setMaxAllowedFPS(fps: number) {
        if (typeof fps === 'undefined') {
            fps = Infinity;
        }
        if (fps === 0) {
            this.stop();
        } else {
            // Dividing by Infinity returns zero.
            this.minFrameDelay = 1000 / fps;
        }
        return this;
    }


    public resetFrameDelta() {
        const oldFrameDelta = this.frameDelta;
        this.frameDelta = 0;
        return oldFrameDelta;
    }

    /**
    * @param {Function} begin
    *   The begin() function.
    * @param {Number} [begin.timestamp]
    * @param {Number} [begin.delta]
    *   The total elapsed time that has not yet been simulated, in
    *   milliseconds.
    */
    public setBegin(fun: beginMethod) {
        this.begin = fun || this.begin;
        return this;
    }

    /**
      * @param {Function} update
      *   The update() function.
      * @param {Number} [update.delta]
      *   The amount of time in milliseconds to simulate in the update. In most
      *   cases this timestep never changes in order to ensure deterministic
      *   updates. The timestep is the same as that returned by
      *   `MainLoop.getSimulationTimestep()`.
      */
    public setUpdate(fun: updateMethod) {
        this.update = fun || this.update;
        return this;
    }
    /**
      *
      * @param {Function} draw
      *   The draw() function.
      * @param {Number} [draw.interpolationPercentage]
      *   The cumulative amount of time that hasn't been simulated yet, divided
      *   by the amount of time that will be simulated the next time update()
      *   runs. Useful for interpolating frames.
      */
    public setDraw(fun: drawMethod) {
        this.draw = fun || this.draw;
        return this;
    }
    /**
    * @param {Function} end
    * @param {Number} [end.fps]
    * @param {Boolean} [end.panic=false]
    *   Indicates whether the simulation has fallen too far behind real time.
    *   Specifically, `panic` will be `true` if too many updates occurred in
    *   one frame.
    */
    public setEnd(fun: endMethod) {
        this.end = fun || this.end;
        return this;
    }


    public start() {
        if (!this.started) {
            // Since the application doesn't start running immediately, track
            // whether this function was called and use that to keep it from
            // starting the main loop multiple times.
            this.started = true;

            // In the main loop, draw() is called after update(), so if we
            // entered the main loop immediately, we would never render the
            // initial state before any updates occur. Instead, we run one
            // frame where all we do is draw, and then start the main loop with
            // the next frame.
            this.rafHandle = requestAnimationFrame((timestamp) => {
                // Render the initial state before any updates occur.
                this.draw(1);

                // The application isn't considered "running" until the
                // application starts drawing.
                this.running = true;

                // Reset variables that are used for tracking time so that we
                // don't simulate time passed while the application was paused.
                this.lastFrameTimeMs = timestamp;
                this.lastFpsUpdate = timestamp;
                this.framesSinceLastFpsUpdate = 0;

                // Start the main loop.
                this.rafHandle = requestAnimationFrame(this.animate);
            });
        }
        return this;
    }

    /**
     * Stops the main loop.
     */
    public stop() {
        this.running = false;
        this.started = false;
        cancelAnimationFrame(this.rafHandle);
        return this;
    }

    /**
     * Returns whether the main loop is currently running.
     *
     * See also `MainLoop.start()` and `MainLoop.stop()`.
     *
     * @return {Boolean}
     *   Whether the main loop is currently running.
     */
    public isRunning() {
        return this.running;
    }


    /**
     * The main loop that runs updates and rendering.
     *
     * @param {DOMHighResTimeStamp} timestamp
     * @ignore
     */
    public animate(timestamp: number) {
        // Run the loop again the next time the browser is ready to render.
        // We set rafHandle immediately so that the next frame can be canceled
        // during the current frame.
        this.rafHandle = requestAnimationFrame(this.animate);

        // Throttle the frame rate (if minFrameDelay is set to a non-zero value by
        // `MainLoop.setMaxAllowedFPS()`).
        if (timestamp < this.lastFrameTimeMs + this.minFrameDelay) {
            return;
        }

        // frameDelta is the cumulative amount of in-app time that hasn't been
        // simulated yet. Add the time since the last frame. We need to track total
        // not-yet-simulated time (as opposed to just the time elapsed since the
        // last frame) because not all actually elapsed time is guaranteed to be
        // simulated each frame. See the comments below for details.
        this.frameDelta += timestamp - this.lastFrameTimeMs;
        this.lastFrameTimeMs = timestamp;

        // Run any updates that are not dependent on time in the simulation. See
        // `MainLoop.setBegin()` for additional details on how to use this.
        this.begin(timestamp, this.frameDelta);

        // Update the estimate of the frame rate, `fps`. Approximately every
        // second, the number of frames that occurred in that second are included
        // in an exponential moving average of all frames per second. This means
        // that more recent seconds affect the estimated frame rate more than older
        // seconds.
        if (timestamp > this.lastFpsUpdate + this.fpsUpdateInterval) {
            // Compute the new exponential moving average.
            this.fps =
                // Divide the number of frames since the last FPS update by the
                // amount of time that has passed to get the mean frames per second
                // over that period. This is necessary because slightly more than a
                // second has likely passed since the last update.
                this.fpsAlpha * this.framesSinceLastFpsUpdate * 1000 / (timestamp - this.lastFpsUpdate) +
                (1 - this.fpsAlpha) * this.fps;

            // Reset the frame counter and last-updated timestamp since their
            // latest values have now been incorporated into the FPS estimate.
            this.lastFpsUpdate = timestamp;
            this.framesSinceLastFpsUpdate = 0;
        }
        // Count the current frame in the next frames-per-second update. This
        // happens after the previous section because the previous section
        // calculates the frames that occur up until `timestamp`, and `timestamp`
        // refers to a time just before the current frame was delivered.
        this.framesSinceLastFpsUpdate += 1;

        this.numUpdateSteps = 0;
        while (this.frameDelta >= this.simulationTimestep) {
            this.update(this.simulationTimestep);
            this.frameDelta -= this.simulationTimestep;

            this.numUpdateSteps += 1;
            if (this.numUpdateSteps >= 240) {
                this.panic = true;
                break;
            }
        }
        this.draw(this.frameDelta / this.simulationTimestep);
        this.end(this.fps, this.panic);
        this.panic = false;
    }
}
