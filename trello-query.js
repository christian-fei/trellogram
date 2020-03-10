const trelloApi = require('simple-trello-api')

module.exports = async ({ key, token, boardName = 'GTD', since, until, member } = {}) => {
  const boards = await trelloApi.getBoards({ key, token })
  const board = boards.find(b => b.name.toLowerCase() === boardName.toLowerCase())

  if (!board) {
    console.log(`"${boardName}" not found,available boards`, boards.map(b => b.name).join(', '))
    throw new Error('no such board')
  }
  console.log(`"${boardName}" found: loading members, lists and cards..`)

  const boardId = board.id
  let [lists, members, cards] = await Promise.all([
    trelloApi.getBoardLists({ key, token }, boardId),
    trelloApi.getBoardMembers({ key, token }, boardId),
    trelloApi.getBoardCards({ key, token }, boardId)
  ])

  if (since === 'today') since = todayStart()
  if (until === 'today') until = todayEnd()
  if (since === 'yesterday') since = yesterdayStart()
  if (until === 'yesterday') until = yesterdayEnd()

  cards = cards.map(c => Object.assign(c, {
    list: lists.find(l => l.id === c.idList),
    members: members.filter(m => c.idMembers.includes(m.id))
  }))
    .filter(c => {
      if (!since) return c
      const dateLastActivity = new Date(c.dateLastActivity)
      const filterSince = new Date(since)
      return dateLastActivity >= filterSince
    })
    .filter(c => {
      if (!until) return c
      const dateLastActivity = new Date(c.dateLastActivity)
      const filterUnilt = new Date(until)
      return dateLastActivity <= filterUnilt
    })
    .filter(c => {
      if (!member) return c
      return (c.members || []).find(m => m.username === member)
    })
    .sort((a, b) => new Date(a.dateLastActivity) - new Date(b.dateLastActivity))

  return { board, cards, lists, members }
}

function todayStart () {
  const t = new Date()
  t.setHours(0)
  t.setMinutes(0)
  t.setSeconds(0)
  return t
}
function todayEnd () {
  const t = new Date()
  t.setHours(23)
  t.setMinutes(59)
  t.setSeconds(59)
  return t
}
function yesterdayEnd () {
  const y = new Date()
  y.setDate(y.getDate() - 1)
  y.setHours(23)
  y.setMinutes(59)
  y.setSeconds(59)
  return y
}
function yesterdayStart () {
  const y = new Date()
  y.setDate(y.getDate() - 1)
  y.setHours(0)
  y.setMinutes(0)
  y.setSeconds(0)
  return y
}
