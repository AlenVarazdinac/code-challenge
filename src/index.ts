import { MapController } from './controllers/MapController'
import { PathTraversal } from './controllers/PathTraversalController'
import { maps, expectedResults } from './data/mapData'

// Choose which map to use (map1 to map6)
const mapKey = 'map2'
const map: MapGrid = maps[mapKey]
const expected = expectedResults[mapKey]

const mapController = MapController.getInstance()
mapController.map = map

const traversal = new PathTraversal()
const result = traversal.traverse()
console.log('Letters:', result.letters)
console.log('Path:', result.path)

console.log('Expected Letters:', expected.letters)
console.log('Expected Path:', expected.path)
