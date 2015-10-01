Atlas' codebase should be written and refactored towards the following guidelines to ensure consistent formatting. They are not too meticulous, but we do expect to keep the airy layout and space for comments.

# JavaScript

## General

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

Stylesheets follow BEM conventions:

	.block__element--modifier

Elements should not be nested more than two levels down. ``.button__content__logo`` is still ok, but avoid ``.button__content__logo__inner``. Instead, simplify, flatten or apply/define a reusable utility class that achieves the required styling.