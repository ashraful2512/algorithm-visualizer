import { T } from '../constants/theme';

// ─── SORTING ALGORITHM GENERATORS ───────────────────────────────────────────────
export function* bubbleGen(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      yield { arr: [...a], comparing: [j, j + 1], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        yield { arr: [...a], comparing: [], swapped: [j, j + 1], sorted: [], pivot: -1, cmp: 0, sw: 1 };
      }
    }
  }
  yield { arr: [...a], comparing: [], swapped: [], sorted: a.map((_, i) => i), pivot: -1, cmp: 0, sw: 0 };
}

export function* mergeGen(arr) {
  const a = [...arr];
  yield* mergeHelper(a, 0, a.length - 1);
  yield { arr: [...a], comparing: [], swapped: [], sorted: a.map((_, i) => i), pivot: -1, cmp: 0, sw: 0 };
}

function* mergeHelper(a, l, r) {
  if (l >= r) return;
  
  const m = Math.floor((l + r) / 2);
  yield* mergeHelper(a, l, m);
  yield* mergeHelper(a, m + 1, r);
  
  const L = a.slice(l, m + 1);
  const R = a.slice(m + 1, r + 1);
  
  let i = 0, j = 0, k = l;
  
  while (i < L.length && j < R.length) {
    yield { arr: [...a], comparing: [k, k], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
    if (L[i] <= R[j]) {
      a[k] = L[i];
      i++;
    } else {
      a[k] = R[j];
      j++;
    }
    yield { arr: [...a], comparing: [], swapped: [k], sorted: [], pivot: -1, cmp: 0, sw: 1 };
    k++;
  }
  
  while (i < L.length) {
    a[k] = L[i];
    yield { arr: [...a], comparing: [], swapped: [k], sorted: [], pivot: -1, cmp: 0, sw: 1 };
    i++;
    k++;
  }
  
  while (j < R.length) {
    a[k] = R[j];
    yield { arr: [...a], comparing: [], swapped: [k], sorted: [], pivot: -1, cmp: 0, sw: 1 };
    j++;
    k++;
  }
}

export function* quickGen(arr) {
  const a = [...arr];
  
  function* quickSort(lo, hi) {
    if (lo < hi) {
      const pivot = a[hi];
      let i = lo - 1;
      for (let j = lo; j < hi; j++) {
        yield { arr: [...a], comparing: [j, hi], swapped: [], sorted: [], pivot: hi, cmp: 1, sw: 0 };
        if (a[j] < pivot) {
          i++;
          [a[i], a[j]] = [a[j], a[i]];
          yield { arr: [...a], comparing: [], swapped: [i, j], sorted: [], pivot: -1, cmp: 0, sw: 1 };
        }
      }
      [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
      yield { arr: [...a], comparing: [], swapped: [i + 1, hi], sorted: [], pivot: -1, cmp: 0, sw: 1 };
      
      yield* quickSort(lo, i);
      yield* quickSort(i + 2, hi);
    }
  }
  
  yield* quickSort(0, a.length - 1);
  yield { arr: [...a], comparing: [], swapped: [], sorted: a.map((_, i) => i), pivot: -1, cmp: 0, sw: 0 };
}

export function* insertionGen(arr) {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    
    yield { arr: [...a], comparing: [i], swapped: [], sorted: [], pivot: -1, cmp: 0, sw: 0 };
    
    while (j >= 0 && a[j] > key) {
      yield { arr: [...a], comparing: [j, i], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
      a[j + 1] = a[j];
      yield { arr: [...a], comparing: [], swapped: [j + 1], sorted: [], pivot: -1, cmp: 0, sw: 1 };
      j--;
    }
    
    a[j + 1] = key;
    yield { arr: [...a], comparing: [], swapped: [j + 1], sorted: [], pivot: -1, cmp: 0, sw: 1 };
  }
  yield { arr: [...a], comparing: [], swapped: [], sorted: a.map((_, i) => i), pivot: -1, cmp: 0, sw: 0 };
}

export function* selectionGen(arr) {
  const a = [...arr];
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    yield { arr: [...a], comparing: [i, minIdx], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
    for (let j = i + 1; j < a.length; j++) {
      yield { arr: [...a], comparing: [i, minIdx, j], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
      if (a[j] < a[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield { arr: [...a], comparing: [], swapped: [i, minIdx], sorted: [], pivot: -1, cmp: 0, sw: 1 };
    }
  }
  yield { arr: [...a], comparing: [], swapped: [], sorted: a.map((_, i) => i), pivot: -1, cmp: 0, sw: 0 };
}

export function* heapGen(arr) {
  const a = [...arr];
  const n = a.length;
  
  // Helper function to heapify a subtree
  function* heapify(a, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n) {
      yield { arr: [...a], comparing: [largest, left], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
      if (a[left] > a[largest]) {
        largest = left;
      }
    }
    
    if (right < n) {
      yield { arr: [...a], comparing: [largest, right], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
      if (a[right] > a[largest]) {
        largest = right;
      }
    }
    
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      yield { arr: [...a], comparing: [], swapped: [i, largest], sorted: [], pivot: -1, cmp: 0, sw: 1 };
      yield* heapify(a, n, largest);
    }
  }
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(a, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    [a[0], a[i]] = [a[i], a[0]];
    yield { arr: [...a], comparing: [], swapped: [0, i], sorted: [], pivot: -1, cmp: 0, sw: 1 };
    
    // Call heapify on the reduced heap
    yield* heapify(a, i, 0);
  }
  
  yield { arr: [...a], comparing: [], swapped: [], sorted: a.map((_, i) => i), pivot: -1, cmp: 0, sw: 0 };
}

export function* shellGen(arr) {
  const a = [...arr];
  const n = a.length;
  
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      yield { arr: [...a], comparing: [i, i - gap], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
      let temp = a[i];
      let j = i;
      while (j >= gap && a[j - gap] > temp) {
        a[j] = a[j - gap];
        j -= gap;
        yield { arr: [...a], comparing: [], swapped: [j, j + gap], sorted: [], pivot: -1, cmp: 0, sw: 1 };
      }
      a[j] = temp;
    }
  }
  yield { arr: [...a], comparing: [], swapped: [], sorted: a.map((_, i) => i), pivot: -1, cmp: 0, sw: 0 };
}

export function* countingGen(arr) {
  const a = [...arr];
  const max = Math.max(...a);
  const count = Array(max + 1).fill(0);
  
  // Count occurrences of each element
  for (let i = 0; i < a.length; i++) {
    yield { arr: [...a], comparing: [i], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
    count[a[i]]++;
  }
  
  // Modify count array to contain actual positions
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }
  
  const output = new Array(a.length);
  
  // Build the output array
  for (let i = a.length - 1; i >= 0; i--) {
    yield { arr: [...a], comparing: [i], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
    const value = a[i];
    const position = count[value] - 1;
    output[position] = value;
    count[value]--;
  }
  
  // Copy the sorted elements back to original array
  for (let i = 0; i < a.length; i++) {
    a[i] = output[i];
    yield { arr: [...a], comparing: [], swapped: [i], sorted: a.slice(0, i + 1), pivot: -1, cmp: 0, sw: 1 };
  }
  
  yield { arr: [...a], comparing: [], swapped: [], sorted: a.map((_, i) => i), pivot: -1, cmp: 0, sw: 0 };
}

export function* radixGen(arr) {
  const a = [...arr];
  const max = Math.max(...a);
  
  for (let exp = 1; Math.floor(max / Math.pow(10, exp - 1)) > 0; exp++) {
    const bucket = Array.from({ length: 10 }, () => []);
    
    // Distribute elements into buckets based on current digit
    for (let i = 0; i < a.length; i++) {
      yield { arr: [...a], comparing: [i], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
      const digit = Math.floor(a[i] / Math.pow(10, exp - 1)) % 10;
      bucket[digit].push(a[i]);
    }
    
    // Collect elements from buckets back to array
    let index = 0;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < bucket[i].length; j++) {
        a[index] = bucket[i][j];
        yield { arr: [...a], comparing: [], swapped: [index], sorted: [], pivot: -1, cmp: 0, sw: 1 };
        index++;
      }
    }
  }
  
  yield { arr: [...a], comparing: [], swapped: [], sorted: a.map((_, i) => i), pivot: -1, cmp: 0, sw: 0 };
}

export function* bucketGen(arr) {
  const a = [...arr];
  const n = a.length;
  const min = Math.min(...a);
  const max = Math.max(...a);
  const bucketCount = Math.min(n, 10); // Use at most 10 buckets
  const buckets = Array.from({ length: bucketCount }, () => []);
  
  // Distribute elements into buckets
  for (let i = 0; i < n; i++) {
    yield { arr: [...a], comparing: [i], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
    const bucketIdx = Math.floor(((a[i] - min) / (max - min + 1)) * bucketCount);
    buckets[Math.min(bucketIdx, bucketCount - 1)].push(a[i]);
  }
  
  // Sort individual buckets and concatenate
  let index = 0;
  for (let i = 0; i < bucketCount; i++) {
    if (buckets[i].length > 0) {
      // Sort the bucket
      buckets[i].sort((a, b) => a - b);
      
      // Add sorted elements to the main array
      for (let j = 0; j < buckets[i].length; j++) {
        a[index] = buckets[i][j];
        yield { arr: [...a], comparing: [], swapped: [index], sorted: [], pivot: -1, cmp: 0, sw: 1 };
        index++;
      }
    }
  }
  
  yield { arr: [...a], comparing: [], swapped: [], sorted: a.map((_, i) => i), pivot: -1, cmp: 0, sw: 0 };
}

export function* timGen(arr) {
  const a = [...arr];
  const n = a.length;
  const MIN_MERGE = 16;
  
  function* merge(arr, left, mid, right) {
    const l = arr.slice(left, mid);
    const r = arr.slice(mid, right);
    let i = 0, j = 0, k = left;
    
    while (i < l.length && j < r.length) {
      yield { arr: [...a], comparing: [left + i, mid + j], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
      if (l[i] <= r[j]) {
        arr[k] = l[i];
        i++;
      } else {
        arr[k] = r[j];
        j++;
      }
      yield { arr: [...a], comparing: [], swapped: [k], sorted: [], pivot: -1, cmp: 0, sw: 1 };
      k++;
    }
    
    while (i < l.length) {
      arr[k] = l[i];
      yield { arr: [...a], comparing: [], swapped: [k], sorted: [], pivot: -1, cmp: 0, sw: 1 };
      i++;
      k++;
    }
    
    while (j < r.length) {
      arr[k] = r[j];
      yield { arr: [...a], comparing: [], swapped: [k], sorted: [], pivot: -1, cmp: 0, sw: 1 };
      j++;
      k++;
    }
  }
  
  // Sort small runs using insertion sort
  for (let i = 0; i < n; i += MIN_MERGE) {
    const end = Math.min(i + MIN_MERGE, n);
    for (let j = i + 1; j < end; j++) {
      const key = a[j];
      let k = j - 1;
      
      yield { arr: [...a], comparing: [j], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
      
      while (k >= i && a[k] > key) {
        yield { arr: [...a], comparing: [k, j], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
        a[k + 1] = a[k];
        yield { arr: [...a], comparing: [], swapped: [k + 1], sorted: [], pivot: -1, cmp: 0, sw: 1 };
        k--;
      }
      
      a[k + 1] = key;
      yield { arr: [...a], comparing: [], swapped: [k + 1], sorted: [], pivot: -1, cmp: 0, sw: 1 };
    }
  }
  
  // Merge runs
  for (let size = MIN_MERGE; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = Math.min(left + size, n);
      const right = Math.min(left + 2 * size, n);
      
      if (mid < right) {
        yield* merge(a, left, mid, right);
      }
    }
  }
  
  yield { arr: [...a], comparing: [], swapped: [], sorted: a.map((_, i) => i), pivot: -1, cmp: 0, sw: 0 };
}

export function* cocktailGen(arr) {
  const a = [...arr];
  let swapped = true;
  let start = 0;
  let end = a.length - 1;
  
  while (swapped) {
    swapped = false;
    
    for (let i = start; i < end; i++) {
      yield { arr: [...a], comparing: [i, i + 1], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swapped = true;
        yield { arr: [...a], comparing: [], swapped: [i, i + 1], sorted: [], pivot: -1, cmp: 0, sw: 1 };
      }
    }
    
    if (!swapped) break;
    end--;
    
    for (let i = end; i > start; i--) {
      yield { arr: [...a], comparing: [i, i - 1], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
      if (a[i] < a[i - 1]) {
        [a[i], a[i - 1]] = [a[i - 1], a[i]];
        swapped = true;
        yield { arr: [...a], comparing: [], swapped: [i, i - 1], sorted: [], pivot: -1, cmp: 0, sw: 1 };
      }
    }
    
    if (!swapped) break;
    start++;
  }
  
  yield { arr: [...a], comparing: [], swapped: [], sorted: a.map((_, i) => i), pivot: -1, cmp: 0, sw: 0 };
}

export function* dijkstraGen(nodes, edges) {
  const n = nodes.length;
  const dist = Array(n).fill(Infinity);
  const visited = Array(n).fill(false);
  dist[0] = 0;
  
  for (let i = 0; i < n; i++) {
    let u = -1;
    let minDist = Infinity;
    
    for (let j = 0; j < n; j++) {
      if (!visited[j] && dist[j] < minDist) {
        minDist = dist[j];
        u = j;
      }
    }
    
    if (u === -1) break;
    
    visited[u] = true;
    
    for (const edge of edges) {
      let v = -1;
      if (edge.from === u) {
        v = edge.to;
      } else if (edge.to === u) {
        v = edge.from;
      }
      
      if (v !== -1 && !visited[v] && dist[u] + edge.weight < dist[v]) {
        dist[v] = dist[u] + edge.weight;
      }
    }
    
    const nodeColors = nodes.map((node, idx) => {
      if (idx === u) {
        return T.accent;
      }
      return dist[idx] < Infinity ? T.green : T.border;
    });
    
    yield { nodeColors, edgeColors: [], labels: dist.map(d => d === Infinity ? "∞" : d), cmp: 1, sw: 0, type: "dijkstra" };
  }
  
  const finalColors = nodes.map(node => dist[nodes.indexOf(node)] < Infinity ? T.green : T.border);
  yield { nodeColors: finalColors, edgeColors: [], labels: dist.map(d => d === Infinity ? "∞" : d), cmp: 0, sw: 0, type: "dijkstra" };
};

export function* bfsGen(nodes, edges) {
  const n = nodes.length;
  const queue = [0];
  const visited = new Set([0]);
  
  while (queue.length > 0) {
    const u = queue.shift();
    
    for (const edge of edges) {
      if (edge.from === u) {
        const v = edge.to;
        if (!visited.has(v)) {
          visited.add(v);
          queue.push(v);
        }
      }
    }
  }
  
  const finalColors = nodes.map(n => visited.has(n.id) ? T.green : T.border);
  yield { nodeColors: finalColors, edgeColors: [], labels: null, cmp: 0, sw: 0, type: "bfs" };
}

export function* dfsGen(nodes, edges) {
  const visited = new Set();

  function* dfs(u) {
    visited.add(u);

    const nodeColors = nodes.map(n =>
      visited.has(n.id) ? T.green : T.border
    );

    yield {
      nodeColors,
      edgeColors: [],
      labels: null,
      cmp: 0,
      sw: 0,
      type: "dfs"
    };

    for (const edge of edges) {
      if (edge.from === u) {
        const v = edge.to;

        if (!visited.has(v)) {
          yield* dfs(v);
        }
      }
    }
  }

  yield* dfs(0);

  const finalColors = nodes.map(n =>
    visited.has(n.id) ? T.green : T.border
  );

  yield {
    nodeColors: finalColors,
    edgeColors: [],
    labels: null,
    cmp: 0,
    sw: 0,
    type: "dfs"
  };
}
export function* gnomeGen(arr) {
  const a = [...arr];
  let i = 0;
  
  while (i < a.length) {
    yield { arr: [...a], comparing: [i, i - 1], swapped: [], sorted: [], pivot: -1, cmp: 1, sw: 0 };
    if (i === 0 || a[i] >= a[i - 1]) {
      i++;
    } else {
      [a[i], a[i - 1]] = [a[i - 1], a[i]];
      i--;
    }
  }
  
  yield { arr: [...a], comparing: [], swapped: [], sorted: a.map((_, i) => i), pivot: -1, cmp: 0, sw: 0 };
}

// ─── GRAPH ALGORITHM GENERATORS ────────────────────────────────────────────────
export function* kruskalGen(nodes, edges) {
  const n = nodes.length;
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = Array(n).fill(0);
  
  function find(u) {
    if (parent[u] !== u) {
      parent[u] = find(parent[u]);
    }
    return parent[u];
  }
  
  function union(u, v) {
    const rootU = find(u);
    const rootV = find(v);
    if (rootU !== rootV) {
      if (rank[rootU] < rank[rootV]) {
        parent[rootU] = rootV;
      } else if (rank[rootU] > rank[rootV]) {
        parent[rootV] = rootU;
      } else {
        parent[rootV] = rootU;
        rank[rootU]++;
      }
    }
  }
  
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const mst = [];
  
  for (const edge of sortedEdges) {
    const u = edge.from;
    const v = edge.to;
    
    if (find(u) !== find(v)) {
      union(u, v);
      mst.push(edge);
    }
    
    const nodeColors = nodes.map((node, idx) => {
      const isInMST = mst.some(e => (e.from === node.id || e.to === node.id));
      return isInMST ? T.green : T.border;
    });
    
    yield { nodeColors, edgeColors: [], labels: null, cmp: 1, sw: 0, type: "kruskal" };
  }
  
  const finalColors = nodes.map((node, idx) => {
    const isInMST = mst.some(e => (e.from === node.id || e.to === node.id));
    return isInMST ? T.green : T.border;
  });
  
  yield { nodeColors: finalColors, edgeColors: [], labels: null, cmp: 0, sw: 0, type: "kruskal" };
}

export function* bellmanFordGen(nodes, edges) {
  const n = nodes.length;
  const dist = Array(n).fill(Infinity);
  dist[0] = 0;
  
  for (let i = 0; i < n - 1; i++) {
    let relaxedEdge = null;
    for (const edge of edges) {
      const u = edge.from;
      const v = edge.to;
      if (dist[u] + edge.weight < dist[v]) {
        dist[v] = dist[u] + edge.weight;
        relaxedEdge = edge;
      }
    }
    
    const nodeColors = nodes.map((node, idx) => {
      if (relaxedEdge && ((relaxedEdge.from === idx) || (relaxedEdge.to === idx))) {
        return T.accent;
      }
      return dist[idx] < Infinity ? T.green : T.border;
    });
    
    yield { nodeColors, edgeColors: [], labels: dist.map(d => d === Infinity ? "∞" : d), cmp: 1, sw: 0, type: "bellman-ford" };
  }
  
  // Check for negative cycles
  let hasNegativeCycle = false;
  for (const edge of edges) {
    const u = edge.from;
    const v = edge.to;
    if (dist[u] + edge.weight < dist[v]) {
      hasNegativeCycle = true;
      break;
    }
  }
  
  const finalColors = nodes.map((node, idx) => {
    if (hasNegativeCycle) return T.red;
    return dist[idx] < Infinity ? T.green : T.border;
  });
  
  const finalLabel = hasNegativeCycle ? 
    ["Negative cycle detected!"] : 
    dist.map(d => d === Infinity ? "∞" : d);
    
  yield { nodeColors: finalColors, edgeColors: [], labels: finalLabel, cmp: 0, sw: 0, type: "bellman-ford" };
}

export function* floydWarshallGen(nodes, edges) {
  const n = nodes.length;
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  
  for (const edge of edges) {
    dist[edge.from][edge.to] = edge.weight;
  }
  
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
  }
  
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
    
    // Show intermediate state after each k iteration
    const nodeColors = nodes.map((node, idx) => {
      return dist[idx][idx] === 0 ? T.accent : T.border;
    });
    
    yield { nodeColors, edgeColors: [], labels: dist.map(d => d === Infinity ? "∞" : d), cmp: 1, sw: 0, type: "floyd-warshall" };
  }
  
  const finalColors = nodes.map(node => T.green);
  yield { nodeColors: finalColors, edgeColors: [], labels: dist.map(d => d === Infinity ? "∞" : d), cmp: 0, sw: 0, type: "floyd-warshall" };
}

export function* primGen(nodes, edges) {
  const n = nodes.length;
  const visited = Array(n).fill(false);
  const parent = Array(n).fill(-1);
  const key = Array(n).fill(Infinity);
  key[0] = 0;
  
  for (let count = 0; count < n; count++) {
    let u = -1;
    let minKey = Infinity;
    
    for (let i = 0; i < n; i++) {
      if (!visited[i] && key[i] < minKey) {
        minKey = key[i];
        u = i;
      }
    }
    
    if (u === -1) break;
    
    visited[u] = true;
    
    for (const edge of edges) {
      if (edge.from === u) {
        const v = edge.to;
        if (!visited[v] && edge.weight < key[v]) {
          parent[v] = u;
          key[v] = edge.weight;
        }
      }
    }
    
    const nodeColors = nodes.map((node, idx) => {
      if (idx === u) {
        return T.accent;
      }
      return visited[idx] ? T.green : T.border;
    });
    
    yield { nodeColors, edgeColors: [], labels: key.map(k => k === Infinity ? "∞" : k), cmp: 1, sw: 0, type: "prim" };
  }
  
  const finalColors = nodes.map(node => visited[nodes.indexOf(node)] ? T.green : T.border);
  yield { nodeColors: finalColors, edgeColors: [], labels: key.map(k => k === Infinity ? "∞" : k), cmp: 0, sw: 0, type: "prim" };
}

export function* topologicalGen(nodes, edges) {
  const n = nodes.length;
  const visited = Array(n).fill(false);
  const stack = [];
  const inDegree = Array(n).fill(0);
  
  // Calculate in-degrees
  for (const edge of edges) {
    inDegree[edge.to]++;
  }
  
  // Find nodes with in-degree 0
  const queue = [];
  for (let i = 0; i < n; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }
  
  const result = [];
  
  while (queue.length > 0) {
    const u = queue.shift();
    result.push(u);
    
    // Show current node being processed
    const nodeColors = nodes.map((node, idx) => {
      if (idx === u) return T.accent; // Currently processing
      if (result.includes(idx)) return T.green; // Already processed
      return T.border; // Not processed yet
    });
    
    yield { nodeColors, edgeColors: [], labels: result, cmp: 1, sw: 0, type: "topological" };
    
    // Update in-degrees of neighbors
    for (const edge of edges) {
      if (edge.from === u) {
        const v = edge.to;
        inDegree[v]--;
        if (inDegree[v] === 0) {
          queue.push(v);
        }
      }
    }
  }
  
  // Final state
  const finalColors = nodes.map((node, idx) => result.includes(idx) ? T.green : T.red);
  yield { nodeColors: finalColors, edgeColors: [], labels: result, cmp: 0, sw: 0, type: "topological" };
}

export function* kosarajuGen(nodes, edges) {
  const n = nodes.length;
  const visited = Array(n).fill(false);
  const stack = [];
  
  // Step 1: DFS on original graph to fill stack
  function dfs1(u) {
    visited[u] = true;
    
    for (const edge of edges) {
      if (edge.from === u) {
        const v = edge.to;
        if (!visited[v]) {
          dfs1(v);
        }
      }
    }
    stack.push(u); // Push after exploring all neighbors
  }
  
  // Run DFS from all unvisited nodes
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      dfs1(i);
    }
  }
  
  // Step 2: Create reversed graph
  const reversedEdges = [];
  for (const edge of edges) {
    reversedEdges.push({ from: edge.to, to: edge.from, weight: edge.weight });
  }
  
  // Step 3: Process nodes in stack order on reversed graph
  const visited2 = Array(n).fill(false);
  const components = [];
  
  while (stack.length > 0) {
    const u = stack.pop();
    
    if (!visited2[u]) {
      const component = [];
      
      function dfs2(v) {
        visited2[v] = true;
        component.push(v);
        
        for (const edge of reversedEdges) {
          if (edge.from === v) {
            const w = edge.to;
            if (!visited2[w]) {
              dfs2(w);
            }
          }
        }
      }
      
      dfs2(u);
      components.push(component);
      
      // Visualize current component
      const nodeColors = nodes.map((node, idx) => {
        if (component.includes(idx)) {
          return T.green; // Current strongly connected component
        }
        if (visited2[idx]) {
          return T.amber; // Previously processed components
        }
        return T.border; // Not processed yet
      });
      
      const edgeColors = edges.map((edge, idx) => {
        if (component.includes(edge.from) && component.includes(edge.to)) {
          return T.green; // Edges within current component
        }
        return T.border;
      });
      
      yield { 
        nodeColors, 
        edgeColors, 
        labels: [`Component ${components.length}: [${component.join(', ')}]`], 
        cmp: 1, 
        sw: 0, 
        type: "kosaraju" 
      };
    }
  }
  
  // Final state - show all components
  const finalColors = nodes.map((node, idx) => {
    for (let i = 0; i < components.length; i++) {
      if (components[i].includes(idx)) {
        // Different colors for different components
        const colors = [T.green, T.violet, T.amber, T.accent, T.red];
        return colors[i % colors.length];
      }
    }
    return T.border;
  });
  
  const finalEdgeColors = edges.map((edge, idx) => {
    for (let i = 0; i < components.length; i++) {
      if (components[i].includes(edge.from) && components[i].includes(edge.to)) {
        const colors = [T.green, T.violet, T.amber, T.accent, T.red];
        return colors[i % colors.length];
      }
    }
    return T.border;
  });
  
  yield { 
    nodeColors: finalColors, 
    edgeColors: finalEdgeColors, 
    labels: [`Found ${components.length} strongly connected components`], 
    cmp: 0, 
    sw: 0, 
    type: "kosaraju" 
  };
}

export function* astarGen(nodes, edges) {
  const n = nodes.length;
  const start = 0;
  const goal = n - 1;
  
  // Heuristic function: Euclidean distance
  const heuristic = (u, v) => {
    const dx = nodes[u].x - nodes[v].x;
    const dy = nodes[u].y - nodes[v].y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const gScore = Array(n).fill(Infinity);
  const fScore = Array(n).fill(Infinity);
  const cameFrom = Array(n).fill(-1);
  const openSet = new Set([start]);
  const closedSet = new Set();
  
  gScore[start] = 0;
  fScore[start] = heuristic(start, goal);
  
  let iterations = 0;
  const maxIterations = n * n; // Prevent infinite loops
  while (openSet.size > 0 && iterations < maxIterations) {
    let current = -1;
    let lowestFScore = Infinity;
    for (const node of openSet) {
      if (fScore[node] < lowestFScore) {
        lowestFScore = fScore[node];
        current = node;
      }
    }
    
    if (current === goal) {
      const path = [];
      let temp = current;
      while (temp !== -1) {
        path.unshift(temp);
        temp = cameFrom[temp];
      }
      
      const nodeColors = nodes.map((node, idx) => {
        if (path.includes(idx)) {
          return idx === goal ? T.green : T.accent;
        }
        return closedSet.has(idx) ? T.green : T.border;
      });
      
      const edgeColors = edges.map((edge, idx) => {
        for (let i = 0; i < path.length - 1; i++) {
          if ((edge.from === path[i] && edge.to === path[i + 1]) ||
              (edge.to === path[i] && edge.from === path[i + 1])) {
            return T.green;
          }
        }
        return T.border;
      });
      
      yield { nodeColors, edgeColors, labels: gScore.map(g => g === Infinity ? "∞" : g), cmp: 0, sw: 0, type: "astar" };
      break;
    }
    
    openSet.delete(current);
    closedSet.add(current);
    
    for (const edge of edges) {
      let v = -1;
      if (edge.from === current) {
        v = edge.to;
      } else if (edge.to === current) {
        v = edge.from;
      }
      
      if (v !== -1 && !closedSet.has(v)) {
        const tentativeGScore = gScore[current] + edge.weight;
        const tentativeFScore = tentativeGScore + heuristic(v, goal);
        
        if (!openSet.has(v)) {
          openSet.add(v);
          fScore[v] = tentativeFScore;
          cameFrom[v] = current;
        } else if (tentativeFScore < fScore[v]) {
          fScore[v] = tentativeFScore;
          cameFrom[v] = current;
        }
      }
    }
    
    const nodeColors = nodes.map((node, idx) => {
      if (idx === current) {
        return T.accent; // Currently processing node
      }
      if (openSet.has(idx)) {
        return T.amber; // In open set (to be explored)
      }
      return closedSet.has(idx) ? T.green : T.border; // Visited vs unvisited
    });
    
    const edgeColors = edges.map((edge, idx) => {
      if (edge.from === current || edge.to === current) {
        return T.accent; // Edges from current node
      }
      return T.border;
    });
    
    yield { nodeColors, edgeColors, labels: gScore.map(g => g === Infinity ? "∞" : g), cmp: 1, sw: 0, type: "astar" };
    iterations++;
  }
  
  const finalColors = nodes.map((node, idx) => closedSet.has(idx) ? T.green : T.border);
  yield { nodeColors: finalColors, edgeColors: [], labels: gScore.map(g => g === Infinity ? "∞" : g), cmp: 0, sw: 0, type: "astar" };
}

export function* fordFulkersonGen(nodes, edges) {
  const n = nodes.length;
  const source = 0;
  // ... (rest of the code remains the same)
  const sink = n - 1;
  
  // Build adjacency list and capacity matrix
  const capacity = Array.from({ length: n }, () => Array(n).fill(0));
  const residualCapacity = Array.from({ length: n }, () => Array(n).fill(0));
  const adj = Array.from({ length: n }, () => []);
  
  for (const edge of edges) {
    capacity[edge.from][edge.to] = edge.weight;
    residualCapacity[edge.from][edge.to] = edge.weight;
    adj[edge.from].push(edge.to);
    // Only add reverse edge if not already present
    if (!adj[edge.to].includes(edge.from)) {
      adj[edge.to].push(edge.from);
    }
  }
  
  let maxFlow = 0;
  let iteration = 0;
  
  let iterations = 0;
  const maxIterations = n * edges.length * 2; // Prevent infinite loops
  while (iterations < maxIterations) {
    iteration++;
    
    // BFS to find augmenting path
    const parent = Array(n).fill(-1);
    const visited = Array(n).fill(false);
    const queue = [source];
    visited[source] = true;
    
    while (queue.length > 0) {
      const u = queue.shift();
      
      for (const v of adj[u]) {
        if (!visited[v] && residualCapacity[u][v] > 0) {
          parent[v] = u;
          visited[v] = true;
          queue.push(v);
        }
      }
    }
    
    // No augmenting path found
    if (!visited[sink]) break;
    iterations++;
    
    // Find bottleneck capacity and reconstruct path
    let pathFlow = Infinity;
    let v = sink;
    const path = [v];
    while (v !== source && parent[v] !== -1) {
      pathFlow = Math.min(pathFlow, residualCapacity[parent[v]][v]);
      v = parent[v];
      path.unshift(v);
    }
    
    // Add source to path if not already included
    if (path[0] !== source) {
      path.unshift(source);
    }
    
    // Update capacities along path
    v = sink;
    while (v !== source) {
      residualCapacity[parent[v]][v] -= pathFlow;
      residualCapacity[v][parent[v]] += pathFlow;
      v = parent[v];
    }
    
    maxFlow += pathFlow;
    
    // Visualize current state
    const nodeColors = nodes.map((node, idx) => {
      if (idx === source) {
        return T.violet; // Source node
      }
      if (idx === sink) {
        return T.green; // Sink node
      }
      if (path.includes(idx)) {
        return T.amber; // Nodes in current augmenting path
      }
      // Check if node is saturated (no residual capacity)
      const isSaturated = path.includes(idx) && 
                        parent[idx] !== -1 && 
                        residualCapacity[parent[idx]] && 
                        residualCapacity[parent[idx]][idx] === 0;
      if (isSaturated) {
        return T.red; // Saturated nodes
      }
      return T.border; // Other nodes
    });
    
    const edgeColors = edges.map((edge, idx) => {
      if (path.includes(edge.from) && path.includes(edge.to)) {
        return T.accent; // Augmenting path edges
      }
      // Check if edge is saturated
      const fromSaturated = path.includes(edge.from) && 
                           parent[edge.from] !== -1 && 
                           residualCapacity[parent[edge.from]] && 
                           residualCapacity[parent[edge.from]][edge.to] === 0;
      const toSaturated = path.includes(edge.to) && 
                         parent[edge.to] !== -1 && 
                         residualCapacity[parent[edge.to]] && 
                         residualCapacity[parent[edge.to]][edge.from] === 0;
      if (fromSaturated || toSaturated) {
        return T.red; // Saturated edges
      }
      return T.border; // Other edges
    });
    
    yield { 
      nodeColors, 
      edgeColors, 
      labels: [maxFlow.toString()], 
      cmp: 1, 
      sw: pathFlow, 
      type: "ford-fulkerson",
      path,
      pathFlow: pathFlow,
      iteration: iteration,
      maxFlow: maxFlow
    };
  }
  
  // Safety check - if we hit max iterations, show final state
  if (iterations >= maxIterations) {
    const finalColors = nodes.map((node, idx) => {
      if (idx === source) {
        return T.violet;
      }
      if (idx === sink) {
        return T.green;
      }
      return T.border;
    });

    const edgeColors = edges.map((edge, idx) => {
      return T.border;
    });

    yield { 
      nodeColors: finalColors, 
      edgeColors, 
      labels: [maxFlow.toString() + " (stopped)"], 
      cmp: 1, 
      sw: 0, 
      type: "ford-fulkerson",
      path: [],
      pathFlow: 0,
      iteration: iteration,
      maxFlow: maxFlow
    };
  }
  
  // Final state - show complete flow network
  const finalColors = nodes.map((node, idx) => {
    if (idx === source) {
      return T.violet; // Source node
    }
    if (idx === sink) {
      return T.green; // Sink node
    }
    return T.border; // Other nodes
  });

  const edgeColors = edges.map((edge, idx) => {
    return T.border; // Other edges
  });

  yield { 
    nodeColors: finalColors, 
    edgeColors, 
    labels: [maxFlow.toString()], 
    cmp: 1, 
    sw: 0, 
    type: "ford-fulkerson",
    path: [],
    pathFlow: 0,
    iteration: iteration,
    maxFlow: maxFlow
  };
}

export function* boyerMooreGen(text = "HERE IS A SIMPLE EXAMPLE", pattern = "EXAMPLE") {

  // Build bad character heuristic
  const badChar = {};
  for (let i = 0; i < pattern.length; i++) {
    badChar[pattern[i]] = pattern.length - i - 1;
  }
  
  let s = 0;
  while (s <= text.length - pattern.length) {
    let j = pattern.length - 1;
    while (j >= 0 && pattern[j] === text[s + j]) j--;
    
    if (j < 0) {
      yield { text, pattern, s: s, j: pattern.length - 1, shift: 1, found: true, cmp: 1, sw: 0, type: "boyer-moore" };
      break;
    } else {
      const shift = j - (badChar[text[s + j]] || -1);
      yield { text, pattern, s, j, shift, found: false, cmp: 1, sw: 0, type: "boyer-moore" };
      s += shift;
    }
  }
  
  yield { text, pattern, s, j: -1, shift: -1, found: false, cmp: 0, sw: 0, type: "boyer-moore" };
}

// ─── DP ALGORITHM GENERATORS ────────────────────────────────────────────────
export function* fibGen() {
  const n = 10;
  const dp = Array(n + 1).fill(0);
  dp[0] = 0;
  dp[1] = 1;
  
  yield { dp: [...dp], current: -1, cmp: 0, sw: 0, type: "fibonacci" };
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
    yield { dp: [...dp], current: i, cmp: 1, sw: 1, type: "fibonacci" };
  }
  
  yield { dp: [...dp], current: n, cmp: 0, sw: 0, type: "fibonacci" };
}

export function* lcsGen(X = "ABCBDAB", Y = "BDCABA") {
  const m = X.length, n = Y.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0 || j === 0) {
        dp[i][j] = 0;
      } else if (X[i - 1] === Y[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
      yield { dp: dp.map(r => [...r]), ci: i, cj: j, X, Y, cmp: 1, sw: 1, type: "lcs" };
    }
  }
  
  yield { dp: dp.map(r => [...r]), ci: m, cj: n, X, Y, cmp: 0, sw: 0, type: "lcs" };
}

export function* knapsackGen(W = [2, 3, 4, 5], V = [3, 4, 5, 6], CAP = 8) {
  const n = W.length;
  const dp = Array.from({ length: n + 1 }, () => Array(CAP + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= CAP; w++) {
      if (W[i - 1] <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], V[i - 1] + dp[i - 1][w - W[i - 1]]);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
      yield { dp: dp.map(r => [...r]), ci: i, cw: w, W, V, CAP, cmp: 1, sw: 1, type: "knapsack" };
    }
  }
  
  yield { dp: dp.map(r => [...r]), ci: n, cw: CAP, W, V, CAP, cmp: 0, sw: 0, type: "knapsack" };
}

export function* coinChangeGen(COINS = [1, 3, 4], TARGET = 6) {
  const dp = Array(TARGET + 1).fill(Infinity);
  dp[0] = 0;
  
  yield { dp: [...dp], current: -1, coin: -1, COINS, TARGET, cmp: 0, sw: 0, type: "coinchange" };
  
  for (let coinIdx = 0; coinIdx < COINS.length; coinIdx++) {
    const coin = COINS[coinIdx];
    for (let amount = coin; amount <= TARGET; amount++) {
      yield { dp: [...dp], current: amount, coin: coinIdx, COINS, TARGET, cmp: 0, sw: 0, type: "coinchange" };
      if (dp[amount - coin] + 1 < dp[amount]) {
        dp[amount] = dp[amount - coin] + 1;
      }
      yield { dp: [...dp], current: amount, coin: coinIdx, COINS, TARGET, cmp: 1, sw: 1, type: "coinchange" };
    }
  }
  
  yield { dp: [...dp], current: TARGET, coin: -1, COINS, TARGET, cmp: 0, sw: 0, type: "coinchange" };
}

export function* editDistanceGen(str1 = "kitten", str2 = "sitting") {
  const m = str1.length, n = str2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],    // deletion
          dp[i][j - 1],    // insertion
          dp[i - 1][j - 1] // substitution
        );
      }
      yield { dp: dp.map(r => [...r]), ci: i, cj: j, str1, str2, cmp: 1, sw: 1, type: "editdistance" };
    }
  }
      
  yield { dp: dp.map(r => [...r]), ci: m, cj: n, str1, str2, cmp: 0, sw: 0, type: "editdistance" };
}

export function* matrixChainGen(dims = [10, 20, 30, 40, 30]) {
  const n = dims.length - 1;
  const dp = Array.from({ length: n + 1 }, () => Array(n + 1).fill(Infinity));
  const split = Array.from({ length: n + 1 }, () => Array(n + 1).fill(-1));
      
  for (let i = 0; i <= n; i++) {
    dp[i][i] = 0;
  }
      
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
            
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          split[i][j] = k;
        }
      }
            
      yield { dp: dp.map(r => [...r]), split: split.map(r => [...r]), ci: i, cj: j, dims, cmp: 1, sw: 0, type: "matrixchain" };
    }
  }
      
  yield { dp: dp.map(r => [...r]), split: split.map(r => [...r]), ci: 0, cj: n - 1, dims, cmp: 0, sw: 0, type: "matrixchain" };
}

export function* inorderGen(nodes) {
  const visited = new Set();
        
  function* inorder(node) {
    if (!node || visited.has(node.id)) return;
    visited.add(node.id);
            
    yield { nodeColors: nodes.map(n => visited.has(n.id) ? T.green : T.border), edgeColors: [], labels: null, cmp: 0, sw: 0, type: "inorder" };
            
    if (node.left) yield* inorder(node.left);
    if (node.right) yield* inorder(node.right);
  }
        
  yield* inorder(nodes[0]);
  yield { nodeColors: nodes.map(() => T.green), edgeColors: [], labels: null, cmp: 0, sw: 0, type: "inorder" };
}

export function* preorderGen(nodes) {
  const visited = new Set();
        
  function* preorder(node) {
    if (!node || visited.has(node.id)) return;
    visited.add(node.id);
            
    yield { nodeColors: nodes.map(n => visited.has(n.id) ? T.green : T.border), edgeColors: [], labels: null, cmp: 0, sw: 0, type: "preorder" };
            
    if (node.left) yield* preorder(node.left);
    if (node.right) yield* preorder(node.right);
  }
        
  yield* preorder(nodes[0]);
  yield { nodeColors: nodes.map(() => T.green), edgeColors: [], labels: null, cmp: 0, sw: 0, type: "preorder" };
}

export function* postorderGen(nodes) {
  const visited = new Set();
        
  function* postorder(node) {
    if (!node || visited.has(node.id)) return;
            
    if (node.left) yield* postorder(node.left);
    if (node.right) yield* postorder(node.right);
            
    visited.add(node.id);
    yield { nodeColors: nodes.map(n => visited.has(n.id) ? T.green : T.border), edgeColors: [], labels: null, cmp: 0, sw: 0, type: "postorder" };
  }
        
  yield* postorder(nodes[0]);
  yield { nodeColors: nodes.map(() => T.green), edgeColors: [], labels: null, cmp: 0, sw: 0, type: "postorder" };
}

export function* levelorderGen(nodes) {
  const visited = new Set();
  const queue = [nodes[0]];
        
  while (queue.length > 0) {
    const node = queue.shift();
    if (node && !visited.has(node.id)) {
      visited.add(node.id);
      yield { nodeColors: nodes.map(n => visited.has(n.id) ? T.green : T.border), edgeColors: [], labels: null, cmp: 0, sw: 0, type: "levelorder" };
            
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
        
  yield { nodeColors: nodes.map(() => T.green), edgeColors: [], labels: null, cmp: 0, sw: 0, type: "levelorder" };
}

export function* kmpGen(text = "ABABDABACDABABCABAB", pattern = "ABABCABAB") {
  const n = text.length, m = pattern.length;
  const lps = Array(m).fill(0);
        
  // Compute LPS array
  for (let i = 1; i < m; i++) {
    let len = 0;
    while (len > 0 && pattern[len] !== pattern[i]) {
      len = lps[len - 1];
    }
    if (pattern[len] === pattern[i]) len++;
    lps[i] = len;
    yield { text, pattern, s: -1, j: i, lps: [...lps], buildingLPS: true, cmp: 1, sw: 0, type: "kmp" };
  }
        
  // Search
  for (let i = 0; i < n; i++) {
    let j = 0;
    while (j > 0 && text[i] !== pattern[j]) {
      j = lps[j - 1];
    }
    if (text[i] === pattern[j]) j++;
            
    if (j === m) {
      yield { text, pattern, s: i - m + 1, j, lps, found: true, cmp: 1, sw: 0, type: "kmp" };
      j = lps[j - 1];
    } else {
      yield { text, pattern, s: i, j, lps, found: false, cmp: 1, sw: 0, type: "kmp" };
    }
  }
        
  yield { text, pattern, s: -1, j: -1, lps, found: false, cmp: 0, sw: 0, type: "kmp" };
}

export function* rabinKarpGen(text = "ABABDABACDABABCABAB", pattern = "CAB") {
  const n = text.length, m = pattern.length;
  const d = 256; // number of characters in the alphabet
  const q = 101; // a prime number
  const h = Math.pow(d, m - 1) % q;
        
  let p = 0, t = 0;
  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }
        
  for (let i = 0; i <= n - m; i++) {
    if (p === t) {
      let match = true;
      for (let j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        yield { text, pattern, s: i, t, found: true, cmp: 1, sw: 0, type: "rabin-karp" };
      }
    }
            
    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) t += q;
      yield { text, pattern, s: i, t, found: false, cmp: 1, sw: 0, type: "rabin-karp" };
    }
  }
        
  yield { text, pattern, s: -1, t, found: false, cmp: 0, sw: 0, type: "rabin-karp" };
}

export function* lisGen(arr = [10, 22, 9, 33, 21, 50, 41, 60, 80]) {
  const n = arr.length;
  const dp = Array(n).fill(1);
  const parent = Array(n).fill(-1);
        
  yield { arr: [...arr], dp: [...dp], parent: [...parent], lis: [], maxIdx: -1, cmp: 0, sw: 0, type: "lis" };

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        parent[i] = j;
      }
    }
    const maxLen = Math.max(...dp);
    const maxIdx = dp.indexOf(maxLen);
    const lis = [];
    let cur = maxIdx;
    while (cur !== -1) { lis.unshift(cur); cur = parent[cur]; }
    yield { arr: [...arr], dp: [...dp], parent: [...parent], lis, maxIdx, cmp: 1, sw: 0, type: "lis" };
  }
        
  const maxLen = Math.max(...dp);
  const maxIdx = dp.indexOf(maxLen);
  const lis = [];
  let cur = maxIdx;
  while (cur !== -1) { lis.unshift(cur); cur = parent[cur]; }
  yield { arr: [...arr], dp: [...dp], parent: [...parent], lis, maxIdx, cmp: 0, sw: 0, type: "lis" };
}

export function* subsetSumGen(nums = [3, 34, 4, 12, 5, 2], target = 9) {
  const n = nums.length;
  const dp = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));
        
  for (let i = 0; i <= n; i++) {
    for (let j = 0; j <= target; j++) {
      if (j === 0) {
        dp[i][j] = true;
      } else if (i === 0) {
        dp[i][j] = false;
      } else {
        dp[i][j] = dp[i - 1][j] || (j >= nums[i - 1] && dp[i - 1][j - nums[i - 1]]);
      }
    }
    const solution = [];
    if (dp[n][target]) {
      let rem = target, idx = n;
      while (rem > 0 && idx > 0) {
        if (dp[idx-1][rem]) {
          // Target can be achieved without including nums[idx-1]
          idx--;
        } else {
          // nums[idx-1] must be included
          solution.push(nums[idx-1]);
          rem -= nums[idx-1];
          idx--;
        }
      }
    }
    yield { nums, dp: dp.map(r => [...r]), solution, target, cmp: 1, sw: 0, type: "subsetsum" };
  }
        
  const finalSolution = [];
  if (dp[n][target]) {
    let rem = target, idx = n;
    while (rem > 0 && idx > 0) {
      if (dp[idx-1][rem]) {
        // Target can be achieved without including nums[idx-1]
        idx--;
      } else {
        // nums[idx-1] must be included
        finalSolution.push(nums[idx-1]);
        rem -= nums[idx-1];
        idx--;
      }
    }
  }
  yield { nums, dp: dp.map(r => [...r]), solution: finalSolution, target, cmp: 0, sw: 0, type: "subsetsum" };
}
