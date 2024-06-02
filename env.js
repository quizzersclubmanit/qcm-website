const env = {
    projectId: import.meta.env.VITE_PROJECT_ID,
    apiEndpoint: import.meta.env.VITE_API_ENDPOINT,
    dbId: import.meta.env.VITE_DB_ID,
    quizId: import.meta.env.VITE_QUIZ_COLLECTION_ID,
    scoreId: import.meta.env.VITE_SCORE_COLLECTION_ID,
    HOME: import.meta.env.VITE_HOME_URL
}

export default env