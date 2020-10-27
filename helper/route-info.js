'use strict';
module.exports.findPaths = function(list, start, end) {
    let tree = buildTree(
      list,
      findConnection(list, start),
      null
    );
    
    let allPaths = buildPaths(tree, []);
    
    let goodPaths = verifyPaths(allPaths, start, end);
    return format(goodPaths);
  }
  function findConnection(connections, source) {
    return connections.filter(conn => conn.source === source);
  }
  function buildTree(list, nodes, parent) {
   
    return nodes.map(node => {
      node.parent = parent;
      node.path = findConnection(list, node.destination);
      if (node.path && node.path.length > 0) {
        buildTree(list, node.path, {
          source: node.source,
          destination: node.destination,
          parent: node.parent
        });
      }
      return node;
    });
  }
  function buildPaths(tree, prev) {
    tree.forEach(step => {
      if (step.path.length > 0) {
        buildPaths(step.path, prev);
      } else {
        prev.push(step);
      }
    });
    return prev;
  }
  
  function verifyPaths(paths, start, end) {
    return paths.filter(path => path.destination === end).filter(path => {
      while (path.parent) {
        path = path.parent;
      }
      return path.source == start;
    });
  }
  function format(arr) {
    return arr.map(el => {
      let temp = [];
      temp.unshift({
        source: el.source,
        destination: el.destination
      });
      while (el.parent) {
        el = el.parent;
        temp.unshift({
          source: el.source,
          destination: el.destination
        });
      }
      return temp;
    });
  }