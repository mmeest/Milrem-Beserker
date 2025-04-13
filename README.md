<div>
  <p align="center">
    <img src="https://github.com/mmeest/Milrem-Beserker/blob/main/screen.jpg" height="250px">
  </p>
</div>


# Milrem Beserker

Application with Vue.js 3, TypeScript and HTML/CSS.

### Demo Video: https://github.com/mmeest/Milrem-Beserker/blob/main/UGV%20Operational%20Video.mp4

### Github Pages link(operate with numeric keyboard): https://mmeest.github.io/Milrem-Beserker/

## Contents

- [Assignement](#assignement)
- [Getting started](#getting-started)
- [Features and functionality](#features-and-functionality)
- [Operating instructions](#operating-instructions)
- [Tools used](#tools-used)
- [Pre requirements](#pre-requirements)
- [Setup](#setup)

## Assignement

Objective:
Develop an interface prototype for an Unmanned Ground Vehicle (UGV) system, employing Vue 3 alongside HTML, CSS, and TypeScript.

Key Deliverables:

1. Vue 3 Project Setup:
    • Initialize a Vue 3 application incorporating HTML, CSS, and TypeScript
2. Map Integration:
    • Incorporate a digital map from a provider and/or library of your choice (e.g., Google Maps or Leaflet).
    • Display the UGV's location on the map, marking a predefined starting point as its initial location.
3. Planning, Engine Control and Driving:
    • Implement a mock-up control mechanism to start the UGV's engine. This should be achieved through a visually distinct button at top
    • right corner, featuring both an icon and text for clarity. The button must have grey background with 80% opacity, black borders with 2px
    • width and white text color.
    • Ensure the UGV can be maneuvered on the map using the keyboard's arrow keys for directional movement. User should not be able to
    • move UGV if engine is not started. The controls required for prototype are:
    
* Move UGV forward
* Move UGV backward
* Move UGV right
* Move UGV left
  
  Add a simple Drive-To-Destination feature.
Long press on the map lets you add a waypoint
After adding a waypoint, popup appears with buttons:
Drive - Changes UGV current location to the waypoints location
Save - Saves the waypoint to a store/runtime variable
Discard - Discards the waypoint that was created

    Add a simple view which displays all the saved way-points. Upon clicking the saved waypoint in the waypoints list, you can issue
following commands in a popup:
Delete - Deletes waypoint from store/runtime variable
Rename - Lets you alter the name of waypoint
Drive - Changes UGV current location to the waypoints location
4. Engine Status Notification:
    • When the UGV's engine is off and arrow keys are pressed, display a popup notification advising the user to start the engine.

Suggestions:

1. First implement everything that is required by the deliverable, then focus on refactoring, formatting and styling. Keep the UI simple but intuitive.

2. Make the implementation as modular as possible without introducing too much boilerplate, ensuring that developers working on this in the future

could re-use your components.
    
3. Note down what was the most time consuming/difficult part of the assignment for you

4. Proper documentation on how to set up and use the application

5. Comment any use of AI systems

Submission:
    • The code-base to be uploaded to Github
    • Code base to include with instructions to set-up and use the applicationREADME.md
    • Code base to include a demo video file in root showcasing the application

## Getting started

1. Clone repository:

```
git clone https://github.com/mmeest/Milrem-Beserker.git
cd Milrem-Beserker
```

2. Install dependencies:

```
npm install
```

3. Run the application
   
```
npm run dev
```

## Features and functionality

Uses Leaflet to display digital map
UGV’s initial position is marked on the map with red marker(engine is turned off by default)

Engine control:

* A button at the top-right corner starts or stops the engine.
* When engine is off button text ‘START ENGINE’ with green icon. UGV marker is red (no movement)
* When engine is turned on button text ‘STOP ENGINE’ with red icon. UGV marker is displayed as UGV icon. (can be moved 8 directions)
* Button design: grey background (80% opacity), 2px black border, white text.
* UGV movement is disabled if the engine is off.
* Pressing arrow keys when engine is off triggers a popup warning.

UGV movement (8 directions)
Use numeric keyboard keys to move UGV:

* 7 - Move upper left
* 8 - Move up
* 9 - Move upper right
* 4 - Move left
* 6 - Move right
* 1 - Move down left
* 2 - Move down
* 3 - Move down right

Waypoint system:
Mouse right click creates new waypoint on the map(blue marker)
To ‘Saved vaypoints’ appears new waypoint with name of new waypoint and 3 buttons: 

* Drive - drives UGV to the waypoint if engine is turned on
* Rename - renames the waypoint
* Delete - removes the waypoint



## Operating instructions

ENGINE OFF

Location of the UGV is marked with static red marker.

If engine is not running and you try to move - application will throw notification
with name of the button pressed followed by 'Please start the engine before moving.'

ENGINE ON

To switch engine ON/OFF click on the button right down corner 'START ENGINE'/'STOP ENGINE'

Location of the UGV is marked with UGV icon. 
UGV moves in 8 directions. Movement is controlled by 8 numeric keyboard keys:

<div>
  <p>
    <img src="https://github.com/mmeest/Milrem-Beserker/blob/main/src/img/keyboard.jpg">
  </p>
</div>

'Find UGV' button will center the marker on the map.

On the top left corner notification area gives info of the current location and engine status.

## Tools used

* TypeScript
* Vue.js
* HTML/CSS

Libraries:

* Vue.js 3.5.13        - Frontend framework
* Leaflet 1.9.4        - Used for map implementation ( https://leafletjs.com/examples/quick-start/ )
* Vue-Leaflet 0.10.1   - Vue and Leaflet integration
* Vue3-toastify 0.2.8  - Used for creating notifications ( https://www.npmjs.com/package/react-toastify )

Development tools:

* Vite 6.2.0           - For development and binding
* TypeScript 5.7.2     - JavaScript's superscript
* Vue TypeScript Compiler (vue-tsc) 2.2.4
* Vite Vue Plugin 5.2.1

IDE:

VSCode

Project structure:

* Components are located in 'src/components' folder
* Images are located in 'src/img' folder
* Styles are located in 'src/style.css' file (plus some extra styling)
* App main logic is located in 'src/App.vue' file
* Main script file 'src/main.ts'

Configuration files:

* tsconfig.json  - TypeScript configuration
* vite.config.ts - Vite configuration
* package.json   - Project dependencies and scripts

## Pre requirements

1. Node.js must be installed. 
To check the version

```
node -v
npm -v
```

2. VSCode or similar IDE

3. VSCode plugins:

   Vue - Official or Volar or Vetur for developing Vue and TypeScript project
   ESLint for keeping code clean
   Prettier code formatter

## Setup

Creating new project

```
npm create vite@latest
Project name: Milrem-Beserker
package.json: milrem_beserker
Framework: Vue
Language: TypeScript
```

Go to project folder

```
cd Milrem-Beserker
```

Open project in VSCode

```
code .
```

Install dependencies

```
npm install
```

Running development server

```
npm run dev
```

It will open our application in local server at: http://localhost:5173

