const PASSING_PERCENTAGE = 67

const isArray = (value) => Array.isArray(value);
const isObject = (value) => typeof value === 'object' && !!value;
const isString = (value) => typeof value === 'string' && !!value.trim();

export const validateQuizData = (data) => {

  if (!isObject(data) || isArray(data)) {
    return false
  }

  if (!isString(data.quizTitle)) {
    return false
  }

  if (!isArray(data.correctAnswers) || !data.correctAnswers.length) {
    return false
  }

  if (!isArray(data.attempts) || !data.attempts.length) {
    return false
  }

  for (const attempt of data.attempts) {
    if (!isObject(attempt) || isArray(attempt)) {
      return false
    }

    if (!isString(attempt.name)) {
      return false
    }

    if (
      !isArray(attempt.answers) ||
      attempt.answers.length !== data.correctAnswers.length
    ) {
      return false
    }
  }

  return true
}

export const calculateAttempt = (attempt, correctAnswers) => {
  let score = 0

  for (let i = 0; i <= correctAnswers.length - 1; i++) {
    if (attempt.answers[i] !== correctAnswers[i]) continue;

    score++
  }

  const percentage = Math.round((score / correctAnswers.length) * 100)

  return {
    name: attempt.name.trim(),
    score,
    percentage,
    passed: percentage >= PASSING_PERCENTAGE,
  }
}

export const calculateReport = (data) => {
  const attempts = []

  data.attempts.forEach((attempt) =>
    attempts.push(calculateAttempt(attempt, data.correctAnswers))
  );

  let totalPercentage = 0
  let passedCount = 0
  let best = attempts[0]

  attempts.forEach((attempt) => {
    totalPercentage += attempt.percentage

    if (attempt.passed) {
      passedCount += 1
    }

    if (attempt.score > best.score) {
      best = attempt
    }
  })

  return {
    quizTitle: data.quizTitle.trim(),
    questionCount: data.correctAnswers.length,
    participantCount: attempts.length,
    averagePercentage: Math.round(totalPercentage / attempts.length),
    passedCount,
    threshold: PASSING_PERCENTAGE,
    best,
    attempts,
  }
}
