import { EventEmitter } from 'events'

/*
 * This object logs the progress of a database update operation
 * A database update operation is complete when the cursor has ended.
 *   and the number of found entries equals the number of updated entries,
 *   since the cursor ends before the async update operations are ready.
 */
export class UpdateTracker extends EventEmitter {

	/*
	 *
	 *
	 */
	constructor() {
		super()
		this.reset()
	}


	/*
	 *
	 *
	 */
	reset() {
		this._found = 0
		this._updated = 0
		this._hasCursorEnded = 0
	}


	/*
	 * Log when a new item is found and its update operation is being initiated.
	 *
	 */
	logFound() {
		this._found += 1
	}


	/*
	 * Log when an update operation ended.
	 *
	 */
	logUpdated() {
		this._updated += 1
		this._emitEndEventIfDone()
	}


	/*
	 * Log when the find cursor has ended.
	 *
	 */
	logCursorEnd() {
		this._hasCursorEnded = true
		this._emitEndEventIfDone()
	}


	/*
	 * Is the update operation done.
	 *
	 */
	_isDone() {
		return (this._hasCursorEnded && (this._found === this._updated))
	}


	/*
	 * Emit end event if the operation is complete.
	 *
	 */
	_emitEndEventIfDone() {
		if (this._isDone()) {
			console.log('Update operation complete.');
			this.emit('done');
		}
	}

}