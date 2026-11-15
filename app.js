// Готовая защитная механика. Не изменяйте эту функцию.
const escapeHtml = (value) => (String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
);

const selectAttempts = (filter) => {
  const attempts = window.reportData.attempts

  const filterVariants = {
    passed: (attempt) => attempt.passed === true,
    failed: (attempt) => attempt.passed === false,
  }

  return attempts.filter(filterVariants[filter])
}

const renderAttempts = (attempts) => {
  const total = window.reportData.attempts.length
  let html = ''

  attempts.forEach((attempt) => {
    const name = escapeHtml(attempt.name)
    html +=
      '<li class="result-item"><span class="result-name">' +
      name +
      '</span> — ' +
      attempt.score +
      ' из ' +
      attempt.questionCount +
      ' (' +
      attempt.percentage +
      '%)</li>'
  })

  document.querySelector('#result-list').innerHTML = html
  document.querySelector('#result-count').textContent =
    'Показано: ' + attempts.length + ' из ' + total
}

const startFilter = () => {
  const form = document.querySelector('#filter-form')
  const select = document.querySelector('#filter')
  const resultCount = document.querySelector('#result-count')
  const resultList = document.querySelector('#result-list')

  if (!form || !select || !resultCount || !resultList) {
    return
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const filter = select.value
    const attempts = selectAttempts(filter)
    renderAttempts(attempts)
  })
}

startFilter()
