// jsdom has no layout/scroll implementation. Actual viewport behavior is tested in Chrome.
HTMLElement.prototype.scrollTo = function (options: ScrollToOptions | number = {}, top?: number): void {
  if (typeof options === 'number') { this.scrollLeft = options; this.scrollTop = top ?? 0; }
  else { this.scrollLeft = options.left ?? this.scrollLeft; this.scrollTop = options.top ?? this.scrollTop; }
};
