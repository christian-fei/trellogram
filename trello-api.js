const got = require('got')

const getBoards = ({ key, token }) => get(`https://api.trello.com/1/members/me/boards?key=${key}&token=${token}`)
const getBoardLists = ({ key, token }, boardId) => get(`https://api.trello.com/1/boards/${boardId}/lists?key=${key}&token=${token}`)
const getBoardMembers = ({ key, token }, boardId) => get(`https://api.trello.com/1/boards/${boardId}/members?key=${key}&token=${token}`)
const getBoardCards = ({ key, token }, boardId) => get(`https://api.trello.com/1/boards/${boardId}/cards?key=${key}&token=${token}`)

module.exports = {
  getBoards,
  getBoardLists,
  getBoardMembers,
  getBoardCards
}

async function get (url) {
  const { body } = await got.get(url)
  return JSON.parse(body)
}
