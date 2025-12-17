function filterObjects(arrayOfObjects = [], key = "", value) {
  const result = arrayOfObjects.filter((obj) => obj[key].toLowerCase() == value)
  return result
}

export default filterObjects
