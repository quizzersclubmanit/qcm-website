import storeService from "../api/store.service"

function deleteFiles(quiz, toDelete = [true, true, true, true, true]) {
  return Promise.allSettled([
    toDelete[0] && storeService.deleteFile({ fileId: quiz?.supportingPic }),
    toDelete[1] && storeService.deleteFile({ fileId: quiz?.options[0] }),
    toDelete[2] && storeService.deleteFile({ fileId: quiz?.options[1] }),
    toDelete[3] && storeService.deleteFile({ fileId: quiz?.options[2] }),
    toDelete[4] && storeService.deleteFile({ fileId: quiz?.options[3] })
  ])
}

export default deleteFiles
