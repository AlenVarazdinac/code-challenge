## Setup and Installation
1. Make sure you have npm installed on your system
2. Clone this repository:
```
git clone https://github.com/AlenVarazdinac/code-challenge.git
cd code-challenge
```
3. Install the dependencies
```
npm install
```

## Running the app
To build and run the application:
```
npm run start
```
This command will use webpack to build the project and then run the resulting Javascript file.

## Running tests
```
npm run test
```
Runs tests using Jest.


## Usage
1. Create a map using the following characters
```
@ starting point
x ending point
| move vertical
- move horizontal
+ intersection (for changing direction)
' ' empty space (non traversable areas)
A-Z letters that will be collected (can also be used for changing direction)
```
2. Initialize the `MapController` with the map you create
3. Create a `PathTraversal` instance
4. Call the `traverse()` method to get the result

Example:
```typescript
const map: MapGrid = [
  ['@', '-', 'A', '-', '+'],
  [' ', ' ', ' ', ' ', '|'],
  [' ', ' ', 'x', '-', 'B']
]

const mapController = MapController.getInstance()
mapController.map = map

const traversal = new PathTraversal()
const result = traversal.traverse()
console.log(result.letters) // 'AB'
console.log(result.path) // '@-A-+|B-x'
