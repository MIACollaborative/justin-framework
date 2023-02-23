export class Node<T> {
  data: T;
  adjNodes: Node<T>[];
  comparator: (a: T, b: T) => number;

  constructor(data: T, comparator: (a: T, b: T) => number) {
    this.data = data;
    this.adjNodes = new Array<Node<T>>();
    this.comparator = comparator;
  }
  /**
   * adds a new node as a neighbor
   * @param {Node<T>}node
   */
  addNewNeighbour(node: Node<T>): void {
    this.adjNodes.push(node);
  }

  /**
   * removes a node from the list of neighbors
   * @param {T} data
   * @returns {Node<T>| null}
   */
  removeNeighbour(data: T): Node<T> | null {
    let index = this.adjNodes.findIndex(
      (node) => this.comparator(node.data, data) == 0
    );
    if (index != -1) {
      return this.adjNodes.splice(index, 1)[0];
    }
    return null;
  }
}

export class Graph<T> {
  nodes: Map<T, Node<T>> = new Map<T, Node<T>>();
  comparator: (a: T, b: T) => number;
  root: Node<T>;

  constructor(comparator: (a: T, b: T) => number, data: T) {
    this.comparator = comparator;
    this.root = new Node<T>(data, comparator);
  }

  /**
   * adds a new node to the graph
   * @param {T} data
   * @returns {Node<T>}
   */
  addNewNode(data: T): Node<T> {
    let node = this.nodes.get(data);
    // if the node is already in the graph, then there is no need to build it
    if (node != null) {
      return node;
    }
    // if the node is not already in the graph, then create a node and set the node into the map of nodes
    node = new Node(data, this.comparator);
    this.nodes.set(data, node);
    return node;
  }

  /**
   * remove a node from the graph
   * @param {T} data
   * @returns {Node<T> | null}
   */

  removeNode(data: T) {
    let nodeToRemove = this.nodes.get(data);

    this.nodes.forEach((node) => {
      // if nodeToRemove is not undefined and if node in graph contains nodeToRemove in list of adjacent nodes
      if (nodeToRemove && node.adjNodes.includes(nodeToRemove)) {
        // remove nodeToRemove
        node.removeNeighbour(nodeToRemove.data);
      }
    });
    this.nodes.delete(data);
    return nodeToRemove;
  }

  /**
   * add an edge to the graph
   * @param source
   * @param destination
   */
  addEdge(source: T, destination: T): void {
    let sourceNode: Node<T> = this.addNewNode(source);
    let destinationNode: Node<T> = this.addNewNode(destination);

    // add the destination node to the list of adjacent nodes for the destination node.
    sourceNode.addNewNeighbour(destinationNode);
  }

  /**
   * remove an edge from the graph
   * @param source
   * @param destination
   */
  removeEdge(source: T, destination: T): void {
    //get the source node
    let sourceNode: Node<T> | undefined = this.nodes.get(source);
    //get the destination node
    let destinationNode: Node<T> | undefined = this.nodes.get(destination);

    //remove the destination from the list of adjacent nodes on the source node
    if (sourceNode && destinationNode) {
      sourceNode.removeNeighbour(destinationNode.data);
    }
  }
}

function comparator(a: number, b: number) {
  if (a < b) return -1;

  if (a > b) return 1;

  return 0;
}

const graph: Graph<number> = new Graph<number>(comparator, 1);
graph.addEdge(1, 2);
graph.addEdge(1, 4);
graph.addEdge(2, 1);
graph.addEdge(2, 3);
graph.addEdge(2, 5);
graph.addEdge(3, 2);
graph.addEdge(3, 6);
graph.addEdge(4, 1);
graph.addEdge(4, 5);
graph.addEdge(4, 7);
graph.addEdge(5, 2);
graph.addEdge(5, 4);
graph.addEdge(5, 6);
graph.addEdge(5, 8);
graph.addEdge(6, 3);
graph.addEdge(6, 5);
graph.addEdge(6, 9);
graph.addEdge(7, 4);
graph.addEdge(7, 8);
graph.addEdge(8, 7);
graph.addEdge(8, 5);
graph.addEdge(8, 9);
graph.addEdge(9, 8);
graph.addEdge(9, 6);
