---
slug: 'sum-of-cubes-identity'
title: "Why Is (1+2+...+n)² Always a Perfect Square?"
date: "2026-07-11"
author: "Your Pen Name"
excerpt: "A genuinely surprising identity connecting sums and cubes — and a one-picture proof that needs no algebra at all."
tags: ["Fascinating Problems", "Number Theory"]
---

## The Claim

Add up the first $n$ positive integers, then square the result. Claim: you get the exact same number as if you'd cubed each integer from $1$ to $n$ and added *those* up.

In symbols:

$$
(1 + 2 + 3 + \cdots + n)^2 = 1^3 + 2^3 + 3^3 + \cdots + n^3
$$

Let's check it for $n = 4$:

* Left side: $(1+2+3+4)^2 = 10^2 = 100$
* Right side: $1^3 + 2^3 + 3^3 + 4^3 = 1 + 8 + 27 + 64 = 100$

They match. That's already a little suspicious — sums and cubes feel like unrelated operations, so why would squaring one give you the other?

## A Proof by Induction

The standard way to prove this rigorously is induction on $n$. Recall the well-known formula:

$$
1 + 2 + \cdots + n = \frac{n(n+1)}{2}
$$

So the claim we want to prove is equivalent to:

$$
1^3 + 2^3 + \cdots + n^3 = \left(\frac{n(n+1)}{2}\right)^2
$$

**Base case ($n = 1$):** Left side is $1^3 = 1$. Right side is $\left(\frac{1 \cdot 2}{2}\right)^2 = 1^2 = 1$. They match.

**Inductive step:** Assume the formula holds for some $n = k$, i.e.

$$
1^3 + 2^3 + \cdots + k^3 = \left(\frac{k(k+1)}{2}\right)^2.
$$

We want to show it holds for $n = k+1$. Adding $(k+1)^3$ to both sides:

$$
1^3 + \cdots + k^3 + (k+1)^3 = \left(\frac{k(k+1)}{2}\right)^2 + (k+1)^3
$$

Factor out $(k+1)^2$ from the right-hand side:

$$
= (k+1)^2 \left[ \frac{k^2}{4} + (k+1) \right] = (k+1)^2 \cdot \frac{k^2 + 4k + 4}{4} = (k+1)^2 \cdot \frac{(k+2)^2}{4}
$$

which is exactly $\left(\frac{(k+1)(k+2)}{2}\right)^2$ — the formula with $n = k+1$. Since the base case holds and each case implies the next, the identity holds for all positive integers $n$. $\blacksquare$

## The Proof Without Any Algebra

Induction proves it's true but doesn't explain *why* it's true — why cubes and squared-sums would be connected at all. Here's a cleaner way to see it.

Let $T_k = 1 + 2 + \cdots + k = \frac{k(k+1)}{2}$ denote the $k$-th triangular number, so the identity we want is $T_n^2 = 1^3 + 2^3 + \cdots + n^3$.

Picture a sequence of nested squares: a square of side length $T_1$, sitting inside a square of side length $T_2$, sitting inside a square of side length $T_3$, and so on up to a square of side length $T_n$. Going from the square of side $T_{k-1}$ to the square of side $T_k$ adds an L-shaped border (a *gnomon*) around two sides. The area of that border is just the difference of the two square areas:

$$
T_k^2 - T_{k-1}^2 = (T_k - T_{k-1})(T_k + T_{k-1})
$$

Since $T_k - T_{k-1} = k$ (that's just the definition of the triangular numbers) and $T_k + T_{k-1} = k^2$ (a short computation: $\frac{k(k+1)}{2} + \frac{(k-1)k}{2} = \frac{k[(k+1)+(k-1)]}{2} = \frac{k \cdot 2k}{2} = k^2$), the $k$-th gnomon has area

$$
T_k^2 - T_{k-1}^2 = k \cdot k^2 = k^3.
$$

So each border you add, going from one nested square to the next, has area *exactly* $k^3$. Stack up all $n$ borders (starting from the empty square, $T_0 = 0$) and you've built the full $T_n \times T_n$ square — one gnomon of area $k^3$ at a time, for $k = 1$ through $n$:

$$
T_n^2 = \sum_{k=1}^{n} (T_k^2 - T_{k-1}^2) = \sum_{k=1}^{n} k^3
$$

which is exactly the identity we set out to explain. No induction needed — just watching a square grow one L-shaped layer at a time, and noticing that each layer's area happens to be a perfect cube.

## Something to Try Yourself

Can you find a similar closed form for $1^3 - 2^3 + 3^3 - \cdots$ (alternating cubes)? Or generalize the gnomon argument to fourth powers? Neither has as clean an answer as the identity above — which is exactly what makes them worth exploring.
