const { serial: test } = require('ava')
// const got = require('got')
const { getBoards, getBoardLists, getBoardMembers, getBoardCards } = require('./trello-api')
const nock = require('nock')

const key = process.env.npm_config_trello_api_key || process.env.TRELLO_API_KEY
const token = process.env.npm_config_trello_api_token || process.env.TRELLO_API_TOKEN

test.before(Function.prototype)
const baseTrelloApiUrl = 'https://api.trello.com'
const boardId = 1

test('getBoards', async t => {
  nock(baseTrelloApiUrl)
    .get(`/1/members/me/boards?key=${key}&token=${token}`)
    .reply(200, [{ name: 'test' }])

  const boards = await getBoards({ key, token })
  t.truthy(boards.length > 0)
})
test('getBoardLists', async t => {
  nock(baseTrelloApiUrl)
    .get(`/1/boards/${boardId}/lists?key=${key}&token=${token}`)
    .reply(200, [{ name: 'test' }])

  const lists = await getBoardLists({ key, token }, boardId)
  t.truthy(lists.length > 0)
})
test('getBoardMembers', async t => {
  nock(baseTrelloApiUrl)
    .get(`/1/boards/${boardId}/members?key=${key}&token=${token}`)
    .reply(200, [{ name: 'test' }])

  const members = await getBoardMembers({ key, token }, boardId)
  t.truthy(members.length > 0)
})
test('getBoardCards', async t => {
  nock(baseTrelloApiUrl)
    .get(`/1/boards/${boardId}/cards?key=${key}&token=${token}`)
    .reply(200, [{ name: 'test' }])

  const cards = await getBoardCards({ key, token }, boardId)
  t.truthy(cards.length > 0)
})
