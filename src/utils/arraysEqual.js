function arraysEqual(arr1, arr2) {
  return arr1.every((element, index) => element === arr2[index])
}

export default arraysEqual
