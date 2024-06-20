const env = {
  projectId: import.meta.env.VITE_PROJECT_ID,
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT,
  dbId: import.meta.env.VITE_DB_ID,
  quizId: import.meta.env.VITE_QUIZ_COLLECTION_ID,
  leaderboardId: import.meta.env.VITE_LEADERBOARD_COLLECTION_ID,
  userId: import.meta.env.VITE_USER_COLLECTION_ID,
  bucketId: import.meta.env.VITE_STORE_ID,
  locationIqApiKey: import.meta.env.VITE_LOCATION_IQ_ACCESS_TOKEN
}

export const timeLimits = [
  10, // in mins
  20,
  10
]

export default env
