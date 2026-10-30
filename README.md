# Dynamic Profile Page

A profile page that shows its content from a JavaScript object, with a skill search, a category
filter and a skill lookup. Task 11 of my Bloomrix internship.

## Files
- index.html - the page structure
- style.css - the styling
- data.js - the profile object (data only)
- app.js - the code that shows the data and handles the search, lookup and random skill
- images/profile.jpg - profile photo

## How the scripts are loaded
Both scripts use defer. data.js is first, so the profile object exists when app.js runs.

## Features
- The header, About section, stat cards, skills, education, experience, projects, awards and
  contact list are all built from the profile object.
- Skill search and category filter work together and update as you type.
- Skill lookup finds a skill by name. It throws an error for an empty or unknown name, and
  try, catch and finally show a friendly message.
- The random skill button uses Math.random.
- Skill levels are my own given dummy ratings from 1 to 10. The average, the highest level and the level
  labels are calculated from them.
- Experience is calculated from the months of each job.

## JavaScript used
- Objects, nested objects and arrays of objects
- map, filter, find, reduce and sort
- Arrow functions and callbacks (renderList takes a callback)
- Template literals, destructuring, spread, optional chaining and nullish coalescing
- switch, if and else, ternary operator and for...of
- Date, Math.round, Math.floor, Math.max and Math.random
- A closure that counts the lookups
- try, catch, finally and throw
- Strict mode

## How to run
Open index.html with Live Server in Visual Studio Code, or in any web browser.