// ─── UTILITY FUNCTIONS ───────────────────────────────────────────────────────
export function generateSortingArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

// ─── GRAPH ALGORITHMS ─────────────────────────────────────────────────────────
export function generateGraph(W, H) {
  // Increase graph size for better visualization
  const N = Math.min(12, Math.floor(Math.min(W, H) / 60));
  const nodes = Array.from({ length: N }, (_, i) => ({
    id: i,
    x: Math.random() * (W - 100) + 50,
    y: Math.random() * (H - 100) + 50,
    label: String.fromCharCode(65 + i),
  }));

  const edges = [];
  // Create a denser, more complex graph
  const edgeDensity = 0.3; // 30% connection probability
  for (let i = 0; i < N; i++) {
    // Ensure each node has multiple connections for complexity
    const numConnections = Math.floor(Math.random() * 3) + 2;
    for (let j = 0; j < numConnections; j++) {
      const target = Math.floor(Math.random() * N);
      if (target !== i && !edges.find(e => (e.from === i && e.to === target) || (e.from === target && e.to === i))) {
        const w = Math.floor(Math.random() * 15) + 1;
        edges.push({ from: i, to: target, weight: w });
      }
    }
  }

  return { nodes, edges };
}

// ─── DYNAMIC PROGRAMMING HELPERS ─────────────────────────────────────────────────
export function generateRandomStrings(minLength = 5, maxLength = 8) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length1 = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const length2 = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  
  const str1 = Array.from({ length: length1 }, () => 
    alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join('');
  
  const str2 = Array.from({ length: length2 }, () => 
    alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join('');
  
  return { str1, str2 };
}

export function generateRandomKnapsackData(numItems = 4, maxWeight = 10, maxValue = 15) {
  const weights = Array.from({ length: numItems }, () => 
    Math.floor(Math.random() * (maxWeight - 1)) + 1
  );
  
  const values = Array.from({ length: numItems }, () => 
    Math.floor(Math.random() * maxValue) + 1
  );
  
  // Set capacity to be roughly half of total weight for interesting problems
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  const capacity = Math.max(5, Math.floor(totalWeight * 0.6));
  
  return { weights, values, capacity };
}

export function generateRandomCoinChangeData(numCoins = 3, maxCoin = 7, maxTarget = 12) {
  // Generate unique coins
  const coins = [];
  while (coins.length < numCoins) {
    const coin = Math.floor(Math.random() * maxCoin) + 1;
    if (!coins.includes(coin)) {
      coins.push(coin);
    }
  }
  coins.sort((a, b) => a - b);
  
  // Set target to be a reasonable multiple of coins
  const maxPossible = coins[coins.length - 1] * 3;
  const target = Math.max(5, Math.floor(Math.random() * Math.min(maxTarget, maxPossible)) + 3);
  
  return { coins, target };
}

export function generateRandomMatrixChainData(numMatrices = 4, minDim = 5, maxDim = 25) {
  const dims = [];
  for (let i = 0; i <= numMatrices; i++) {
    const dim = Math.floor(Math.random() * (maxDim - minDim + 1)) + minDim;
    dims.push(dim);
  }
  return dims;
}

export function generateRandomLISData(numElements = 8, minVal = 1, maxVal = 100) {
  const arr = [];
  for (let i = 0; i < numElements; i++) {
    const val = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    arr.push(val);
  }
  return arr;
}

export function generateRandomSubsetSumData(numElements = 6, minVal = 1, maxVal = 20) {
  const nums = [];
  let total = 0;
  
  for (let i = 0; i < numElements; i++) {
    const val = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    nums.push(val);
    total += val;
  }
  
  // Set target to be roughly half of total sum for interesting problems, but never exceed 15
  const calculatedTarget = Math.floor(total * 0.4);
  const target = Math.max(5, Math.min(15, calculatedTarget));
  
  return { nums, target };
}

export function generateRandomStringData(minLength = 8, maxLength = 15) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  
  const text = Array.from({ length }, () => 
    alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join('');
  
  return text;
}
