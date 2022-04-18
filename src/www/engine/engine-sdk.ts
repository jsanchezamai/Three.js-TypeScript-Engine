// Type definitions for engine 0.1
// Project: https://tfs/nechi/Three.js-TypeScript-Engine/src/typings/engine/index.d.ts
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped


export enum Signals {
    SYNC,
    ACK
}

export interface ISignal {

}

export interface IMessage {
    text: string;
    signal: ISignal;
}

export interface IWorker {
    TAG: string;

    ping(): void;
}

export interface IEngine {
    TAG: string;

    import(): boolean;

    export(): boolean;

}

export interface IUnityEngine {

}

export enum Animations {
    ALWAYS,         // Constantly loop an animation
    HELD,           // Looped during the entire duration an object is grabbed.
    GAZE,           // Looped while an object is being looked at
    PROXIMITY,      // Looped while a viewer is near to an object
    POINTING        // Looped while a user is pointing at an object
}

export enum InteractableStates {
    DEFAULT,
    FOCUS,
    PRESS,
    DISABLED,
    Visited,  //the Interactable has been clicked.
    Toggled,  //The button is in a toggled state or Dimension index is an odd number.
    Gesture,  //The hand or controller was pressed and has moved from the original position.
    VoiceCommand,  //A speech command was used to trigger the Interactable.
    PhysicalTouch,  //A touch input is currently detected, use NearInteractionTouchable to enable.
    Grab  //A hand is currently grabbing in the bounds of the object, use NearInteractionGrabbable to enable
}

export enum SelectionModes {
    Button,         // - Dimensions = 1, simple clickable Interactable
    Toggle,         // - Dimensions = 2, Interactable alternates between on/off state
    MultiDimension // - Dimensions >= 3, every click increases the current dimension level + 1. Useful for defining a button state to a list, etc.
}

export interface IInteractableProfileItem {

}

export interface IInteractable {
    BoxCollider: any, // Box Collider for the button's front plate.
    PressableButton: any, //  The logic for the button movement with hand press interaction.
    PhysicalPressEventRouter: any, //  This script sends events from hand press interaction to Interactable.
    Interactable: any, //  Interactable handles various types of interaction states and events. HoloLens gaze, gesture, and voice input and immersive headset motion controller input are directly handled by this script.
    AudioSource: any, //  Unity audio source for the audio feedback clips.
}

export enum InteractableEvents {
    InteractableAudioReceiver,
    InteractableOnClickReceiver,
    InteractableOnFocusReceiver,
    InteractableOnGrabReceiver,
    InteractableOnHoldReceiver,
    InteractableOnPressReceiver,
    InteractableOnToggleReceiver,
    InteractableOnTouchReceiver
}

export interface IPressableButton extends IInteractable {

}

export interface ISlider extends IInteractable {
    ThumbRoot: any, // The gameobject that contains the slider thumb.
    SnapTo: any, //  Position Whether or not this slider snaps to the designated position on the slider
    IsTouchable: any, //  Whether or not this slider is controllable via touch events
    ThumbCollider: any, //  The collider that controls the slider thumb
    TouchableCollider: any, //  The area of the slider that can be touched or selected when Snap To Position is true.
    SliderValue: any, //  The value of the slider.
    UseSliderStepDivisions: any, //  Controls whether this slider is increments in steps or continuously.
    SliderStepDivisionsNumber: any, //  of subdivisions the slider is split into when Use Slider Step Divisions is enabled.
    TrackVisuals: any, //  The gameobject that contains the desired track visuals that goes along the slider.
    TickMarks: any, //  The gameobject that contains the desired tick marks that goes along the slider.
    ThumbVisuals: any, //  The gameobject that contains the desired thumb visual that goes along the slider.
    SliderAxis: any, //  The axis the slider moves along.
    SliderStartDistance: any, //  Where the slider track starts: any, as distance from center along slider axis, in local space units.
    SliderEndDistance: any // Where the slider track ends, as distance from center along slider axis, in local space units.
}

export enum SldierEvents {
    OnValueUpdated,         // Called whenever the slider value changes
    OnInteractionStarted,   // Called when the user grabs the slider
    OnInteractionEnded,     // Called when the user releases the slider
    OnHoverEntered,             // Called when the user's hand / controller hovers over the slider, using either near or far interaction.
    OnHoverExited,          // Called when the user's hand / controller is no longer near the
}
