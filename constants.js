const env = {
  projectId: import.meta.env.VITE_PROJECT_ID,
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT,
  dbId: import.meta.env.VITE_DB_ID,
  quizId: import.meta.env.VITE_QUIZ_COLLECTION_ID,
  leaderboardId: import.meta.env.VITE_LEADERBOARD_COLLECTION_ID,
  userId: import.meta.env.VITE_USER_COLLECTION_ID,
  storeId: import.meta.env.VITE_STORE_ID,
  finalYearId: import.meta.env.VITE_FINAL_YEAR_ID,
  preFinalYearId: import.meta.env.VITE_PRE_FINAL_YEAR_ID
}

export const timeLimits = [
  10, // in mins
  25,
  10
]

export default env
