// You can also create a separate constants file for better organization
export const mbtiQuestionTags = [
  "I",
  "E", // Introvert vs Extrovert
  "N",
  "S", // Intuition vs Sensing
  "T",
  "F", // Thinking vs Feeling
  "J",
  "P", // Judging vs Perceiving
]

export const loveLanguageQuestionTags = [
  "Words of Affirmation", // Lời nói yêu thương
  "Acts of Service", // Hành động quan tâm
  "Receiving Gifts", // Nhận quà
  "Quality Time", // Thời gian bên nhau
  "Physical Touch", // Chạm vào
]

export const big5QuestionTags = [
  "Openness", // Cởi mở
  "Conscientiousness", // Tận tâm
  "Extraversion", // Hướng ngoại
  "Agreeableness", // Hòa đồng
  "Neuroticism", // Bất ổn cảm xúc
]

export const discQuestionTags = [
  "Dominance", // Dominance
  "Influence", // Influence
  "Steadiness", // Steadiness
  "Conscientiousness", // Conscientiousness
]

export const getSurveyTags = (surveyName: string) => {
  const surveyNameLower = surveyName.toLowerCase()

  if (surveyNameLower.includes("mbti")) {
    return mbtiQuestionTags
  } else if (surveyNameLower.includes("love") || surveyNameLower.includes("language")) {
    return loveLanguageQuestionTags
  } else if (surveyNameLower.includes("big") || surveyNameLower.includes("5")) {
    return big5QuestionTags
  } else if (surveyNameLower.includes("disc")) {
    return discQuestionTags
  }

  // Default fallback - combine all tags
  return [...mbtiQuestionTags, ...loveLanguageQuestionTags, ...big5QuestionTags, ...discQuestionTags]
}
