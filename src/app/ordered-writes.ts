/** Run same-key storage mutations in order. A rejected write does not block the next one. */
export class OrderedWrites {
  private pending: Promise<void> = Promise.resolve();
  private idle = true;

  enqueue(write: () => Promise<void>): Promise<void> {
    // Start the first call synchronously so a closing popup still issues its save.
    let next: Promise<void>;
    try { next = this.idle ? write() : this.pending.then(write); }
    catch (error) { next = Promise.reject(error); }
    this.idle = false;
    const tail = next.catch(() => {}).then(() => { if (this.pending === tail) this.idle = true; });
    this.pending = tail;
    return next;
  }
}
