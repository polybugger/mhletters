// The director walks the beat list. A beat names its set, its caption, a
// camera pose and an optional set state. Moving to a beat on the same set
// animates the camera and state there; moving to a beat on another set runs
// the beat's transition between the two. Going backwards uses the same poses,
// so every beat is reachable from either direction, and from a URL (#beat-12).
import { gsap } from 'gsap';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

export class Director {
  constructor({ stage, sets, beats, captions, onBeat }) {
    Object.assign(this, { stage, sets, beats, captions, onBeat });
    this.i = -1;
    this.busy = false;
    this.tl = null;
  }

  isBusy() { return this.busy; }
  next() { if (this.i < this.beats.length - 1) this.go(this.i + 1); }
  prev() { if (this.i > 0) this.go(this.i - 1, { back: true }); }

  // Put a set into a beat's camera and state, either over time or at once.
  pose(set, beat, { duration, instant }) {
    const cam = { ...beat.cam };
    const tl = gsap.timeline();
    if (instant || reduce) {
      Object.assign(set.cam, { shake: 0, roll: 0 }, cam);
      set.pose(beat.state || {}, tl, true);
      tl.progress(1);
      return tl;
    }
    tl.to(set.cam, { ...cam, duration, ease: beat.ease || 'power2.inOut' }, 0);
    set.pose(beat.state || {}, tl, false);
    return tl;
  }

  async go(i, { back = false, instant = false } = {}) {
    const beat = this.beats[i];
    if (!beat) return;
    const from = this.beats[this.i];
    const set = this.sets[beat.set];
    this.busy = true;
    // stop the previous move where it is; the new pose tweens on from there,
    // so a quick second gesture bends the motion instead of snapping it
    this.tl?.kill();
    this.i = i;
    this.onBeat?.(i, beat);
    this.captions.show(beat.cap, { layout: beat.layout, instant });
    // a beat is held at least this long, so a second gesture can't land mid-move
    const hold = instant ? 0 : (reduce ? 0.35 : (beat.hold ?? 0.9));
    const release = new Promise((r) => setTimeout(r, hold * 1000));

    if (!from || from.set !== beat.set || instant) {
      // entering this set: pose the incoming set where the beat starts
      const entry = back ? beat : (beat.from ? { ...beat, cam: { ...beat.cam, ...beat.from } } : beat);
      this.pose(set, entry, { instant: true });
      if (!from || instant) {
        this.stage.show(set);
        if (!instant && beat.from && !back) this.tl = this.pose(set, beat, { duration: beat.duration ?? 2.4 });
      } else {
        const type = reduce ? 'fade' : (back ? (beat.backTransition || 'fade') : (beat.transition || 'fade'));
        const dur = reduce ? 0.5 : (beat.tDuration ?? 1.4);
        // the camera starts moving during the transition, so the cut has motion in it
        if (beat.from && !back) this.tl = this.pose(set, beat, { duration: (beat.duration ?? 2.4) });
        await this.stage.transition(set, type, dur, gsap);
      }
    } else {
      this.tl = this.pose(set, beat, { duration: beat.duration ?? 1.6 });
    }
    await release;
    this.busy = false;
  }
}
