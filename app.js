var size = 100,
  CurrentArray = [],
  Delay = 5,
  BarsDiv = document.getElementById("mainArea"),
  BarsArray = document.getElementById("mainArea").children;

/******************************** Utils ********************************/
function seekSize() {
  size = +document.getElementById("SizeSlider").value;
  document.getElementById("currentSize").innerHTML = "Size=" + size;
  GenerateArray(1, 30);
}

function seekDelay() {
  Delay = +document.getElementById("DelaySlider").value;
  document.getElementById("currentDelay").innerHTML = "Delay=" + Delay;
}

function DrawArray() {
  BarsDiv.innerHTML = "";
  CurrentArray.forEach((i) => {
    let div = document.createElement("div");
    div.className = "bar";
    div.setAttribute("style", "height: " + i + "px");
    BarsDiv.appendChild(div);
  });
}

function GenerateArray(descending = 0, start = 30) {
  CurrentArray = [];
  for (let i = size * 5 + start; i > start; i -= 5) {
    CurrentArray.push(i);
  }
  if (descending === 0) {
    shuffle(CurrentArray);
  }
  DrawArray();
}

async function SwapTwoNodes(node1, node2) {
  let clonedElement1 = node1.cloneNode(true),
    clonedElement2 = node2.cloneNode(true);

  node2.parentNode.replaceChild(clonedElement1, node2);
  node1.parentNode.replaceChild(clonedElement2, node1);
}

function shuffle(array) {
  //  modern Fisher – Yates shuffle algorithm
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function pause(DelayTime) {
  return new Promise((resolve, reject) => {
    setTimeout((_) => {
      resolve(1);
    }, DelayTime);
  });
}

async function ChangeState(state) {
  document.getElementById("generateArray").disabled = state;
  document.getElementById("start").disabled = state;
  document.getElementById("SizeSlider").disabled = state;
  document.getElementById("DelaySlider").disabled = state;
  document.getElementById("ListOfAlgorithms").disabled = state;
}

/******************************** Sorting Algorithms ********************************/
async function merge(lowerBound, middle, upperBound) {
  let i = lowerBound,
    j = middle + 1;
  while (i < j && j <= upperBound) {
    if (BarsArray[j].offsetHeight > BarsArray[i].offsetHeight) {
      i++;
    } else {
      let tmp = BarsArray[j];
      BarsDiv.removeChild(tmp);
      BarsDiv.insertBefore(tmp, BarsArray[i]);
      i++, j++;
    }
    await pause(Delay);
  }
}

async function mergeSort(lowerBound, upperBound) {
  if (lowerBound < upperBound) {
    let middle = Math.floor(lowerBound + (upperBound - lowerBound) / 2);
    await mergeSort(lowerBound, middle);
    await mergeSort(middle + 1, upperBound);
    await merge(lowerBound, middle, upperBound);
  }
}

async function RunMergeSort() {
  await ChangeState(1);
  await mergeSort(0, CurrentArray.length - 1);
  await ChangeState(0);
}

async function BubbleSort() {
  let N = size;
  while (N > 1) {
    let newN = 0;
    for (let i = 1; i < N; i++) {
      if (BarsArray[i].offsetHeight < BarsArray[i - 1].offsetHeight) {
        await SwapTwoNodes(BarsArray[i], BarsArray[i - 1]);
        newN = i;
        await pause(Delay);
      }
    }
    N = newN;
  }
}

async function RunBubbleSort() {
  await ChangeState(1);
  await BubbleSort();
  await ChangeState(0);
}

async function SelectionSort() {
  for (let i = 0; i < size; i++) {
    let minIndex = i;
    for (let j = i + 1; j < size; j++) {
      if (BarsArray[j].offsetHeight < BarsArray[minIndex].offsetHeight) {
        minIndex = j;
      }
    }
    await SwapTwoNodes(BarsArray[minIndex], BarsArray[i]);
    await pause(Delay);
  }
}

async function RunSelectionSort() {
  await ChangeState(1);
  await SelectionSort();
  await ChangeState(0);
}

async function InsertionSort() {
  let i = 1;
  while (i < size) {
    let j = i;
    while (j > 0 && BarsArray[j].offsetHeight < BarsArray[j - 1].offsetHeight) {
      await SwapTwoNodes(BarsArray[j], BarsArray[j - 1]);
      j--;
      await pause(Delay);
    }
    i++;
  }
}

async function RunInsertionSort() {
  await ChangeState(1);
  await InsertionSort();
  await ChangeState(0);
}

async function heapify(index, size) {
  let largest = index,
    leftChild = 2 * index + 1,
    rightChild = 2 * index + 2;

  await pause(Delay);

  if (
    rightChild < size &&
    BarsArray[rightChild].offsetHeight > BarsArray[largest].offsetHeight
  ) {
    largest = rightChild;
  }

  if (
    leftChild < size &&
    BarsArray[leftChild].offsetHeight > BarsArray[largest].offsetHeight
  ) {
    largest = leftChild;
  }

  if (largest !== index) {
    await SwapTwoNodes(BarsArray[largest], BarsArray[index]);
    await pause(Delay);
    await heapify(largest, size);
  }
}

async function HeapSort() {
  for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
    await heapify(i, size);
  }
  for (let i = size - 1; i > 0; i--) {
    await SwapTwoNodes(BarsArray[i], BarsArray[0]);
    await heapify(0, i);
  }
}

async function RunHeapSort() {
  await ChangeState(1);
  await HeapSort();
  await ChangeState(0);
}

/******************************************* Main **************************************/
async function RunAlgorithm() {
  let algo = document.getElementById("ListOfAlgorithms").value;
  console.log(algo);
  if (algo === "") {
    return;
  } else if (algo === "Merge Sort") {
    await RunMergeSort();
  } else if (algo === "Heap Sort") {
    await RunHeapSort();
  } else if (algo === "Bubble Sort") {
    await RunBubbleSort();
  } else if (algo === "Selection Sort") {
    await RunSelectionSort();
  } else if (algo === "Insertion Sort") {
    await RunInsertionSort();
  }
}
