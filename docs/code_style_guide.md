Atlas' codebase should be written and refactored towards the following guidelines to ensure consistent formatting. They are not too meticulous, but we do expect to keep the airy layout and space for comments.

# JavaScript

## General

JavaScript on Atlas is written spaciously, allowing ample empty space to visually separate different blocks of code. With new compiling tools out there, it started ommitting semicolons, making code look more friendly, open and uninterrupted. It also makes heavy use of ES6 features such as destructuring, fat arrows, native promises and so on.

Here are the specifics:

### File Heading

The beginning of a file should contain the description, preferably in a single line:

	// This file does things when other files it them to.

This should be followed by library imports:

	import * as React from 'react';

Then by other imports from Atlas' source code:

	import BaseComponent from './../base.jsx';

A file may contain multiple classes.

### Constructor/Class Methods

When defining a class or constructor, methods should be two lines apart and followed by the preceded by comments signs (for time-sensitive features, this may be left temporarily blank):

	/*
	 *
	 *
	 */

These comments should be preceded by two empty lines, a rule established to ensure adequate visual separation between methods, even if developers decide to add blank lines inside longer methods to separate blocks of code.

## Backbone Models

Methods should be defined in the following order:

* constructor
* defaults
* fields

## Backbone Collections

Methods should be defined in the following order:

* constructor
* model
* apiUrl
* comparator

## React Components

Methods should be defined in the following order:

* constructor
* render
* renderPartial
* lifecycle methods
* fetch methods
* interaction handlers
* miscellaneous

# Stylesheets

## General

Stylesheets follow BEM conventions:

	.block__element--modifier

Elements should not be nested more than two levels down. ``.button__content__logo`` is still ok, but avoid ``.button__content__logo__inner``. Instead, simplify, flatten or apply/define a reusable utility class that achieves the required styling.

## What goes where?

Organizing CSS is a tricky one. The organization is certainly inspired by SMACSS, but it pretty much does its own thing.

### Base

### Mixins

### Components

Small things, buttons, modals, the loader. Classes in these are not prefixed by ``atl__``.

### Modules

Anything larger than a component