---
slug: 'intro-to-monty-hall'
title: "An Intuitive Guide to the Monty Hall Problem"
date: "2024-07-28"
author: "Dr. Probability"
excerpt: "Why switching doors is always the best strategy in this famous paradoxical game show problem. The answer might surprise you!"
tags: ["Probability", "Paradoxes", "Statistics"]
game: "monty-hall"
---

## The Million-Dollar Question

Imagine you're on a game show. The host, Monty Hall, shows you three closed doors. Behind one door is a brand new car; behind the other two are goats. The rules are simple:

1.  You pick one door (let's say, Door #1).
2.  The host, who knows what's behind each door, opens another door (e.g., Door #3) to reveal a goat.
3.  He then asks you: "Do you want to stick with your original choice (Door #1) or switch to the other remaining door (Door #2)?"

What should you do? Does it even matter?

---

### The Intuitive (but Incorrect) Answer

Most people reason that with two doors left, the odds are 50/50. It feels like your choice no longer matters. After all, how could opening a door you *didn't* pick affect the odds of your *initial* choice?

This is where the paradox lies. The key is that **the host's action gives you new information.**

### The Winning Strategy: Always Switch

Counter-intuitively, you have a **2/3 chance of winning if you switch**, and only a 1/3 chance if you stay.

Here's the simplest way to understand it:

When you first made your choice, you had a **1/3 chance** of picking the car and a **2/3 chance** of picking a goat.

*   **Scenario 1: You picked the car (1/3 probability).**
    *   The host will open one of the two goat doors.
    *   If you switch, you will lose.

*   **Scenario 2: You picked a goat (2/3 probability).**
    *   The host *must* open the *other* goat door, because he can't reveal the car.
    *   The only remaining door is the one with the car.
    *   If you switch, you are guaranteed to win.

So, by switching, you are betting on the higher probability: that you initially picked a goat (2/3 chance).

### See It For Yourself!

Reading about it is one thing, but seeing the statistics in action is another. Our interactive Monty Hall game lets you test this strategy as many times as you want.



Run the simulation, try both staying and switching, and watch how the probabilities converge. You'll see that switching really does pay off two-thirds of the time!
