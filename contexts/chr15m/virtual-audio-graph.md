---
title: virtual-audio-graph library
provenance: distilled from the documentation
description: Manage Web Audio API node graphs declaratively using the virtual-audio-graph library in JavaScript
---
# Virtual Audio Graph

A declarative Web Audio API library inspired by React's virtual DOM approach.

## Core Concepts

- Create a virtual audio graph instance that manages Web Audio nodes
- Declaratively specify audio node connections and parameters
- Updates handle all imperative Web Audio API operations automatically

## Basic Usage

```javascript
import createVirtualAudioGraph, {
  oscillator,
  gain,
  OUTPUT
} from 'virtual-audio-graph'

// Create instance
const virtualAudioGraph = createVirtualAudioGraph()

// Update the audio graph
virtualAudioGraph.update({
  0: gain(OUTPUT, { gain: 0.5 }),
  1: oscillator(0, { 
    frequency: 440,
    stopTime: virtualAudioGraph.currentTime + 1 
  })
})
```

## Key Features

- Node connections specified via IDs
- AudioParam automation via method arrays
- Custom node creation for reusable components
- Support for AudioWorklet nodes
- Works with both AudioContext and OfflineAudioContext

## Custom Node Example

```javascript
const customOsc = createNode(({
  frequency,
  startTime,
  stopTime
}) => ({
  0: gain(OUTPUT, {
    gain: [
      ['setValueAtTime', 0, startTime],
      ['linearRampToValueAtTime', 1, startTime + 0.1],
      ['linearRampToValueAtTime', 0, stopTime]
    ]
  }),
  1: oscillator(0, { frequency, startTime, stopTime })
}))

virtualAudioGraph.update({
  0: customOsc(OUTPUT, {
    frequency: 440,
    startTime: currentTime,
    stopTime: currentTime + 1
  })
})
```

## Best Practices

- Use custom nodes to encapsulate reusable audio components
- Leverage AudioParam automation for smooth parameter changes
- Clean up by updating with an empty graph `{}`
- Use unique numeric IDs for nodes
- Connect nodes via their IDs or special OUTPUT constant

## API Reference

### Core Functions

- `createVirtualAudioGraph({audioContext?, output?})` - Create a new virtual audio graph instance
- `createNode(fn)` - Create a custom virtual audio node
- `createWorkletNode(name)` - Create an AudioWorklet node

### Instance Methods

- `virtualAudioGraph.update(graphDefinition)` - Update the audio graph
- `virtualAudioGraph.currentTime` - Get current audio context time
- `virtualAudioGraph.getAudioNodeById(id)` - Get AudioNode by ID

### Standard Node Types

- `analyser` - AnalyserNode
- `biquadFilter` - BiquadFilterNode 
- `bufferSource` - AudioBufferSourceNode
- `channelMerger` - ChannelMergerNode
- `channelSplitter` - ChannelSplitterNode
- `convolver` - ConvolverNode
- `delay` - DelayNode
- `dynamicsCompressor` - DynamicsCompressorNode
- `gain` - GainNode
- `mediaElementSource` - MediaElementAudioSourceNode
- `mediaStreamDestination` - MediaStreamAudioDestinationNode
- `mediaStreamSource` - MediaStreamAudioSourceNode
- `oscillator` - OscillatorNode
- `panner` - PannerNode
- `stereoPanner` - StereoPannerNode
- `waveShaper` - WaveShaperNode

### Special Constants

- `OUTPUT` - Connect node to graph output
- `NO_OUTPUT` - Node has no output connection

### Node Parameters

Common parameters that can be passed to node constructors:

- `startTime` - When to start the node
- `stopTime` - When to stop the node
- `gain` - Gain value (for GainNode)
- `frequency` - Frequency value (for OscillatorNode)
- `detune` - Detune value in cents
- `type` - Oscillator type ('sine', 'square', 'sawtooth', 'triangle')
- `delayTime` - Delay time in seconds
- `maxDelayTime` - Maximum delay time
- `buffer` - AudioBuffer for BufferSourceNode
- `playbackRate` - Playback rate for BufferSourceNode

Parameters can be:
- Simple values
- Arrays of AudioParam method calls like `['setValueAtTime', value, time]`
- Arrays of multiple method calls for complex automation

## More Examples

### Stopping All Audio

To stop all audio and remove all nodes, update with an empty graph:

```javascript
virtualAudioGraph.update({})
```

### Complex Oscillator with Envelope

```javascript
const { currentTime } = virtualAudioGraph

virtualAudioGraph.update({
  0: gain(OUTPUT, {
    gain: [
      ['setValueAtTime', 0, currentTime],
      ['linearRampToValueAtTime', 0.5, currentTime + 0.1],
      ['exponentialRampToValueAtTime', 0.01, currentTime + 2]
    ]
  }),
  1: oscillator(0, {
    frequency: [
      ['setValueAtTime', 440, currentTime],
      ['linearRampToValueAtTime', 880, currentTime + 2]
    ],
    stopTime: currentTime + 2
  })
})
```

### Stereo Panning Example

```javascript
const { currentTime } = virtualAudioGraph

virtualAudioGraph.update({
  0: stereoPanner(OUTPUT, {
    pan: [
      ['setValueAtTime', -1, currentTime],
      ['linearRampToValueAtTime', 1, currentTime + 2]
    ]
  }),
  1: oscillator(0, {
    frequency: 440,
    stopTime: currentTime + 2
  })
})
```

### Working with Audio Files

```javascript
// Load audio file
const response = await fetch('sound.wav')
const arrayBuffer = await response.arrayBuffer()
const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

// Play with effects
virtualAudioGraph.update({
  0: gain(OUTPUT, { gain: 0.7 }),
  1: delay(0, { delayTime: 0.3 }),
  2: bufferSource([0, 1], {
    buffer: audioBuffer,
    playbackRate: 1.2,
    startTime: virtualAudioGraph.currentTime
  })
})

// Stop playback after 3 seconds
setTimeout(() => {
  virtualAudioGraph.update({})
}, 3000)
```
