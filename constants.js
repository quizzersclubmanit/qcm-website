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
  7,  // Section 1: Single Correct (5 Q)
  8,  // Section 2: Multiple Correct (5 Q)
  15, // Section 3: Aptitude (10 Q)
  10, // Section 4: Integer Type (5 Q)
  10, // Section 5: Match the Following (5 Q)
  10, // Section 6: Assertion Reason (5 Q)
  10  // Section 7: Image Based (5 Q)
]

export default env
