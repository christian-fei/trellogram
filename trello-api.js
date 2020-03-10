const got = require('got')

module.exports = {
  getBoards,
  getBoardLists,
  getBoardMembers,
  getBoardCards
}

async function getBoards ({ key, token }) {
  const url = `https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`
  const { body } = await got.get(url)
  return JSON.parse(body)
}

async function getBoardLists ({ key, token }, boardId) {
  const url = `https://api.trello.com/1/boards/${boardId}/lists?key=${key}&token=${token}`
  const { body } = await got.get(url)
  return JSON.parse(body)
}

async function getBoardMembers ({ key, token }, boardId) {
  const url = `https://api.trello.com/1/boards/${boardId}/members?key=${key}&token=${token}`
  const { body } = await got.get(url)
  return JSON.parse(body)
}

async function getBoardCards ({ key, token }, { boardId, since }) {
  const url = `https://api.trello.com/1/boards/${boardId}/cards?key=${key}&token=${token}`
  const { body } = await got.get(url)
  const cards = JSON.parse(body)
  if (!since) return cards
  return cards.filter(c => {
    const dateLastActivity = new Date(c.dateLastActivity)
    const filterSince = new Date(since)
    return dateLastActivity > filterSince
  })
}
