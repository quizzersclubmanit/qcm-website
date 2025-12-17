import storeService from "../api/store.service"

function uploadFiles(formData) {
  const files = [
    formData.supportingPic[0],
    formData.options[0][0] || "NOFILE",
    formData.options[1][0] || "NOFILE",
    formData.options[2][0] || "NOFILE",
    formData.options[3][0] || "NOFILE"
  ]

  return Promise.allSettled([
    storeService.uploadFile({ file: files[0] }),
    storeService.uploadFile({ file: files[1] }),
    storeService.uploadFile({ file: files[2] }),
    storeService.uploadFile({ file: files[3] }),
    storeService.uploadFile({ file: files[4] })
  ])
}

export default uploadFiles
