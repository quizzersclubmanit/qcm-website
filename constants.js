const env = {
  projectId: import.meta.env.VITE_PROJECT_ID,
  apiEndpoint: import.meta.env.VITE_API_ENDPOINT,
  dbId: import.meta.env.VITE_DB_ID,
  quizId: import.meta.env.VITE_QUIZ_COLLECTION_ID,
  leaderboardId: import.meta.env.VITE_LEADERBOARD_COLLECTION_ID,
  userId: import.meta.env.VITE_USER_COLLECTION_ID,
  questionBucketId: import.meta.env.VITE_QUESTION_BUCKET_ID,
  teamBucketId: import.meta.env.VITE_TEAM_BUCKET_ID,
  publicBucketId: import.meta.env.VITE_PUBLIC_BUCKET_ID,
  devContact: import.meta.env.VITE_DEV_CONTACT
}

export const timeLimits = [
  8,  // Section 1: Aptitude (10)
  8,  // Section 2: Single Correct + Assertion (5 each)
  7,  // Section 3: Multiple Correct + Integer (5 each)
  7   // Section 4: Match + Image (5 each)
]

export default env
