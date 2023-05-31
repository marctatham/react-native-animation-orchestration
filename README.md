# react-native-animation-orchestration

# Orchestration
Orchestrating complex sequences of actions can be a daunting task. 
The trick is simply to break the interactions down into the **individual** parts.
This repo exists to support a short article I'm writing about orchestration of 
advanced animation sequences in React Native _(link to article to come soon)_

## Example - Instagram Story Animation
| iOS                                                                                                                            | Android                                                                                                                                                    |
|--------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ![iOS](https://github.com/marctatham/react-native-animation-orchestration/assets/1032038/1d0e3a72-6054-4eff-b896-26b822c68ea2) | ![animation-orchestration-android](https://github.com/marctatham/react-native-animation-orchestration/assets/1032038/bdaabb38-69c1-4837-9e99-a6b02541fc09) |
| or as a video: https://imgur.com/8s0gsS3                                                                                       | or as a video: https://imgur.com/a/IxTUjsd                                                                                                                 |
In this Instagram-style story animation sequence, we are working with
- lottie animations (swapping animations in, playing animations at key intervals within the sequence)
- custom fading of elements in/out of the screen
- Timers
- interacting with events that take place (human interactions, story segments completing, etc.)

## The high-level implementation
In its simplest form a sequence has several steps to it.
- Step 1 begins, upon completion invoke step 2
- Step 2 begins, upon completion invoke step 3
- Step 3 begins, upon completion invoke step 4
- and so on and so forth

So with this in mind, we can break these steps down into: 
- the actors (Views, Animations, Timers, Events, etc)
- the actions taken by each actor (what is it that you want to happen?)
- the order in which each action takes place

...It's not looking quite so daunting now, is it? So 🤷let's give it a go!

## Example - Instagram Story Animation - Breakdown
- **Step 0** - _trigger: mounting of the screen_
  - first story segment begins animating 
  - we set the Header & Description relevant for story part 1
  - first lottie animation is set & begins to play
- **Step 1:** _trigger: completion the first story segment_
  - begin fading out just the description
- **Step 2:** _trigger: completion the fade out animation_
  - begin fading out _just the description_
- **Step 3:** _trigger: completion of the fade in animation_
    - second story segment begins animating
    - display new description
    - begin playing lottie animation 2
    - set timer to trigger step 4 in a short while
- **Step 4:** _trigger: completion of the timer_
  - fade out of both the description & the lottie animation
- **Step 5:** _trigger: completion of the fade out animation_ 
  - fade in new description & new lottie animation (but don't play it)
- **Step 6:** _trigger: completion of the third story segment_
  - third story segment begins animating
  - lottie animation begins playing
- **Step 7:** _trigger: completion of the fourth story segment_
  - display new description for part 4 of the story
  - begin playing lottie animation 3

# Caveats
We live in an imperfect world 🤷& sometimes the tools we use are flawed
This is especially true in the world of React where even popular libraries
such as Lottie may work as expected on one platform but not the other. 

When this happens, it does not mean the approach is flawed. In the case of this 
example repo, while the completion callback of a lottie animation works well on
iOS, it works less well on Android. And so we simply rely on a different hook
(in this case, the completion of the custom story segment component). The ideal 
scenario is certainly to simplify the sequence such that it's a single sequence that
needs to be maintained that works the same all platforms.

While this example focuses on iOS & Android, the same basic principle applies 
on any platform, in any language. 

