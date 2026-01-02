---
slug: 'staircase-fibonacci'
title: "Climbing Stairs and the Surprising Link to Fibonacci"
date: "2024-07-29"
author: "Prof. Recursion"
excerpt: "How many ways can you climb a staircase? The answer reveals one of the most famous sequences in mathematics."
tags: ["Dynamic Programming", "Recursion", "Fibonacci"]
game: "staircase"
---

## The Staircase Challenge

Here's a simple puzzle: you are at the bottom of a staircase with *N* steps. You are allowed to climb either 1 or 2 steps at a time. How many distinct ways are there to reach the top?

Let's work it out for a few small values of N:

*   **N = 1:** You can only take one 1-step.  
    *   Path: (1)
    *   **Total ways: 1**

*   **N = 2:** You can take two 1-steps, or one 2-step.
    *   Paths: (1, 1), (2)
    *   **Total ways: 2**

*   **N = 3:** You can take three 1-steps, a 1-step then a 2-step, or a 2-step then a 1-step.
    *   Paths: (1, 1, 1), (1, 2), (2, 1)
    *   **Total ways: 3**

*   **N = 4:**
    *   Paths: (1, 1, 1, 1), (1, 1, 2), (1, 2, 1), (2, 1, 1), (2, 2)
    *   **Total ways: 5**

The sequence of the number of ways is: **1, 2, 3, 5, ...** Does that look familiar?

---

### Unveiling the Fibonacci Sequence

This is the Fibonacci sequence, starting from its second term! (The full sequence is 0, 1, 1, 2, 3, 5, 8, 13, ...)

Why does this happen? Let's think about the very last move you make to get to the Nth step.

1.  You could have come from **step N-1** by taking a single 1-step.
2.  You could have come from **step N-2** by taking a single 2-step.

There are no other possibilities. This means that the total number of ways to reach step N is the sum of the ways to reach step N-1 and the ways to reach step N-2.

This gives us the famous recursive formula:

`ways(N) = ways(N-1) + ways(N-2)`

This is the exact same formula that defines the Fibonacci sequence.

### Visualize the Pattern

This recursive relationship is the foundation of a technique called dynamic programming. By breaking a larger problem down into smaller, overlapping subproblems, we can find an efficient solution.

The best way to get a feel for this is to see it. Our interactive Staircase Problem visualizer lets you pick the number of steps and then animates every possible path you can take.

> **[Play the Staircase Problem Game Now!](./staircase.html)**

Watch how the paths for N=3 and N=4 combine to form the paths for N=5. It's the Fibonacci sequence brought to life!
