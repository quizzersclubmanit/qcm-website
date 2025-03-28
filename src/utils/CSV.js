class CSV {
  toCSV(data) {
    const csvRows = []

    // Get the headers (keys of the first object)
    const headers = Object.keys(data[0])
    csvRows.push(headers.join(",")) // Join headers with comma

    // Loop through each object and create a row of CSV
    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"') // Escape double quotes
        return `"${escaped}"` // Wrap each value in double quotes for safety
      })
      csvRows.push(values.join(",")) // Join each row's values with comma
    }

    return csvRows.join("\n") // Join all rows with new line
  }

  downloadCSV(csvData, filename) {
    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.setAttribute("href", url)
    a.setAttribute("download", filename)
    a.click()
  }
}

export default new CSV()
