/* Snake Out of Bounds — original AI-generated Web Audio synthesis.
   No recordings, samples, or third-party assets. See CREDITS.txt for license. */
(function () {
  'use strict';

  var context = null;
  var master = null;
  var ambience = null;
  var ambientNodes = [];
  var ambientTimer = null;
  var suspendTimer = null;
  var whiteNoise = null;
  var muted = false;
  var paused = false;
  var unlocked = false;
  var destroyed = false;
  var lastStep = -Infinity;
  var voiceCount = 0;
  var MAX_VOICES = 24;

  function disconnect(node) {
    try { node.disconnect(); } catch (_) { /* Already released. */ }
  }

  function createNoise(seconds) {
    var count = Math.ceil(context.sampleRate * seconds);
    var buffer = context.createBuffer(1, count, context.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < count; i += 1) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  function buildGraph() {
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass || destroyed) return false;
    try {
      context = new AudioContextClass();
      master = context.createGain();
      master.gain.value = 0;
      var limiter = context.createDynamicsCompressor();
      limiter.threshold.value = -18;
      limiter.knee.value = 12;
      limiter.ratio.value = 10;
      limiter.attack.value = 0.004;
      limiter.release.value = 0.18;
      master.connect(limiter);
      limiter.connect(context.destination);
      whiteNoise = createNoise(4);

      ambience = context.createGain();
      ambience.gain.value = 0.34;
      ambience.connect(master);

      // Three quiet arcade layers: pulse bass, soft harmonic, filtered air.
      var bass = context.createOscillator();
      bass.type = 'square';
      bass.frequency.value = 110;
      var bassGain = context.createGain();
      bassGain.gain.value = 0.014;
      bass.connect(bassGain);
      bassGain.connect(ambience);
      bass.start();

      var harmonic = context.createOscillator();
      harmonic.type = 'triangle';
      harmonic.frequency.value = 220;
      var harmonicGain = context.createGain();
      harmonicGain.gain.value = 0.012;
      harmonic.connect(harmonicGain);
      harmonicGain.connect(ambience);
      harmonic.start();

      var air = context.createBufferSource();
      air.buffer = whiteNoise;
      air.loop = true;
      var airFilter = context.createBiquadFilter();
      airFilter.type = 'bandpass';
      airFilter.frequency.value = 780;
      airFilter.Q.value = 0.8;
      var airGain = context.createGain();
      airGain.gain.value = 0.012;
      air.connect(airFilter);
      airFilter.connect(airGain);
      airGain.connect(ambience);
      air.start();

      ambientNodes = [bass, bassGain, harmonic, harmonicGain, air, airFilter, airGain, limiter];
      // Only three sustained sources exist. The short original pulse phrase is
      // scheduled on the audio clock; pause never creates a backlog of notes.
      ambientTimer = window.setInterval(function () {
        if (!context || context.state !== 'running' || muted || paused) return;
        var t = context.currentTime;
        bassGain.gain.setTargetAtTime(0.011 + Math.sin(t * 0.19) * 0.003, t, 1.6);
        harmonicGain.gain.setTargetAtTime(0.009 + Math.sin(t * 0.13 + 1.7) * 0.004, t, 1.8);
        harmonic.detune.setTargetAtTime(Math.sin(t * 0.1) * 6, t, 1.6);
        airFilter.frequency.setTargetAtTime(760 + Math.sin(t * 0.11) * 270, t, 2);
        [220, 293.66, 329.63, 440].forEach(function (f, i) {
          tone(f, 0.095, 'square', 0.015, i * 0.175);
        });
      }, 1400);
      return true;
    } catch (_) {
      if (context) {
        try { context.close(); } catch (__) { /* Audio remains optional. */ }
      }
      context = null;
      master = null;
      return false;
    }
  }

  function synchronize() {
    if (!context || !master || destroyed) return;
    if (suspendTimer !== null) {
      window.clearTimeout(suspendTimer);
      suspendTimer = null;
    }
    var shouldPlay = unlocked && !muted && !paused;
    var t = context.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setTargetAtTime(shouldPlay ? 0.24 : 0, t, 0.035);
    if (shouldPlay) {
      if (context.state === 'suspended' || context.state === 'interrupted') {
        // Rejections are harmless on browsers that require another user gesture.
        try { var result = context.resume(); if (result) result.catch(function () {}); } catch (_) {}
      }
    } else if (context.state === 'running') {
      suspendTimer = window.setTimeout(function () {
        suspendTimer = null;
        if (context && !destroyed && (muted || paused || !unlocked)) {
          try { var result = context.suspend(); if (result) result.catch(function () {}); } catch (_) {}
        }
      }, 160);
    }
  }

  function init() {
    if (destroyed) return false;
    if (!context && !buildGraph()) return false;
    unlocked = true;
    synchronize();
    return true;
  }

  function tone(frequency, duration, type, volume, delay, endFrequency) {
    if (!context || voiceCount >= MAX_VOICES) return;
    var start = context.currentTime + (delay || 0);
    var osc = context.createOscillator();
    var gain = context.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(Math.max(20, frequency), start);
    if (endFrequency) osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + Math.min(0.012, duration * 0.15));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain);
    gain.connect(master);
    voiceCount += 1;
    osc.onended = function () {
      voiceCount = Math.max(0, voiceCount - 1);
      disconnect(osc);
      disconnect(gain);
    };
    osc.start(start);
    osc.stop(start + duration + 0.025);
  }

  function noise(duration, volume, frequency, delay) {
    if (!context || voiceCount >= MAX_VOICES) return;
    var start = context.currentTime + (delay || 0);
    var source = context.createBufferSource();
    source.buffer = whiteNoise;
    var filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = frequency;
    var gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    voiceCount += 1;
    source.onended = function () {
      voiceCount = Math.max(0, voiceCount - 1);
      disconnect(source);
      disconnect(filter);
      disconnect(gain);
    };
    source.start(start, Math.random() * 3);
    source.stop(start + duration + 0.025);
  }

  function play(name) {
    if (!context || !unlocked || muted || paused || destroyed || context.state !== 'running') return;
    switch (name) {
      case 'eat':
        tone(587.33, 0.075, 'square', 0.11);
        tone(880, 0.1, 'square', 0.085, 0.045);
        break;
      case 'cut':
        noise(0.07, 0.14, 2000);
        tone(990, 0.11, 'square', 0.1, 0, 280);
        break;
      case 'poison':
        tone(415.3, 0.13, 'square', 0.12, 0, 104);
        noise(0.13, 0.12, 900, 0.04);
        break;
      case 'choose':
        tone(440, 0.055, 'square', 0.1);
        tone(659.25, 0.13, 'square', 0.09, 0.045);
        break;
      case 'draft':
        [329.63, 440, 659.25].forEach(function (f, i) { tone(f, 0.13, 'square', 0.08, i * 0.07); });
        break;
      case 'activate':
        tone(220, 0.25, 'square', 0.11, 0, 880);
        tone(440, 0.3, 'triangle', 0.14, 0.08, 1320);
        noise(0.09, 0.075, 2300, 0.1);
        break;
      case 'expire':
        tone(659.25, 0.13, 'square', 0.07);
        tone(329.63, 0.18, 'triangle', 0.1, 0.095);
        break;
      case 'devour':
        tone(110, 0.085, 'square', 0.17, 0, 440);
        tone(880, 0.12, 'triangle', 0.09, 0.06);
        noise(0.05, 0.07, 1600);
        break;
      case 'die':
        [440, 329.63, 220, 110].forEach(function (f, i) { tone(f, 0.22, 'square', 0.12, i * 0.14, f * 0.8); });
        noise(0.3, 0.1, 650, 0.16);
        break;
      case 'rock':
        noise(0.07, 0.14, 700);
        tone(100, 0.09, 'triangle', 0.17, 0, 55);
        break;
      case 'energy':
        tone(523.25, 0.12, 'triangle', 0.1, 0, 1046.5);
        break;
      case 'step':
        if (context.currentTime - lastStep < 0.115) return;
        lastStep = context.currentTime;
        tone(96 + Math.random() * 12, 0.028, 'triangle', 0.035);
        break;
      default:
        break;
    }
  }

  function stop() {
    destroyed = true;
    if (ambientTimer !== null) window.clearInterval(ambientTimer);
    if (suspendTimer !== null) window.clearTimeout(suspendTimer);
    ambientNodes.forEach(function (node) {
      if (typeof node.stop === 'function') { try { node.stop(); } catch (_) {} }
      disconnect(node);
    });
    ambientNodes = [];
    if (ambience) disconnect(ambience);
    if (master) disconnect(master);
    if (context) { try { var result = context.close(); if (result) result.catch(function () {}); } catch (_) {} }
    context = null;
  }

  window.SNAKE_AUDIO = Object.freeze({
    init: init,
    setMuted: function (value) { muted = Boolean(value); synchronize(); },
    setPaused: function (value) { paused = Boolean(value); synchronize(); },
    play: play,
    stop: stop
  });
}());
