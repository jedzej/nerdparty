const MANIFEST = require('./manifest');

const {
  QUEST_STAGE,
  QUEST_MAP,
  VISIBILITY_MAP,
  TEAM,
  LOYALITY_MAP,
  CHAR,
  COMPLETE_CAUSE
} = MANIFEST.CONSTS;

const countIf = (arr, cond) => arr.reduce((s, e) => cond(e) ? s + 1 : s, 0);

const vals = Object.values;
const keys = Object.keys;

const clone = (obj) => {
  if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
    return obj;
  let temp;
  if (obj instanceof Date) {
    temp = new obj.constructor();
  } else {
    temp = obj.constructor();
  }

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj['isActiveClone'] = null;
      temp[key] = clone(obj[key]);
      delete obj['isActiveClone'];
    }
  }
  return temp;
}

const idsEqual = (id1, id2) => id1.toString() === id2.toString();

const ac = {

  get: {
    default: () => MANIFEST.DEFAULT_STORE,
    assassin: (store, lobby) => lobby.members.find(
      m => ac.get.char(store, m._id) === CHAR.ASSASSIN),
    goodCount: (playersCount) => LOYALITY_MAP[playersCount].good,
    evilCount: (playersCount) => LOYALITY_MAP[playersCount].evil,
    currentQuest: store => vals(store.quests).find(
      quest => quest.stage === QUEST_STAGE.ONGOING),
    members: (store, lobby) => store.playersOrder.map(
      id => lobby.members.find(m => idsEqual(m._id, id))),
    squadVoters: quest => keys(quest.squadVotes || []),
    questVoters: quest => keys(quest.questVotes || []),
    playersCount: store => store.playersOrder.length,
    squadCount: quest => keys(quest.squad).length,
    squadCountRequired: (store, quest) =>
      QUEST_MAP[ac.get.playersCount(store)].squadCount[quest.number - 1],
    failureCountRequired: (store, quest) =>
      QUEST_MAP[ac.get.playersCount(store)].failsRequired[quest.number - 1],
    commanderId: (store) =>
      store.playersOrder[store.roundNumber % store.playersOrder.length],
    squadAttemptsCount: (quest) =>
      quest.votingHistory ? quest.votingHistory.length : 0,
    squadAttemptsLimit: (store) => store.configuration.squadVotingLimit,
    char: (store, userId) => store.charactersMap[userId],
    charFor: (store, observerId, observedId) =>
      VISIBILITY_MAP[ac.get.char(store, observerId)][ac.get.char(store, observedId)],
    completeCause: (store) =>
      store.assassinVote && store.charactersMap[store.assassinVote] === CHAR.MERLIN ?
        COMPLETE_CAUSE.ASSASSIN_KILLS_MERLIN : ac.is.won.byGood(store) ?
          COMPLETE_CAUSE.MISSIONS_COMPLETED : COMPLETE_CAUSE.MISSIONS_FAILED
  },

  sum: {
    successSquadVotes: quest =>
      countIf(vals(quest.squadVotes), v => v === true),
    failureSquadVotes: quest =>
      countIf(vals(quest.squadVotes), v => v === false),
    successQuestVotes: quest =>
      countIf(vals(quest.questVotes), v => v === true),
    failureQuestVotes: quest =>
      countIf(vals(quest.questVotes), v => v === false),
    failedQuests: store =>
      countIf(vals(store.quests), q => q.stage === QUEST_STAGE.FAILURE),
    succeededQuests: store =>
      countIf(vals(store.quests), q => q.stage === QUEST_STAGE.SUCCESS),
  },

  is: {
    good: (char) => TEAM.GOOD.includes(char),
    evil: (char) => TEAM.EVIL.includes(char),
    inStage: (entity, stage) => (entity.stage === stage),
    notInStage: (entity, stage) => (entity.stage !== stage),
    squadMember: (quest, userId) =>
      (quest.squad.some(id => idsEqual(id, userId))),
    squadFull: (store, quest) =>
      (ac.get.squadCount(quest) === ac.get.squadCountRequired(store, quest)),
    commander: (store, userId) => idsEqual(ac.get.commanderId(store), userId),
    assassin: (store, userId) => ac.get.char(store, userId) === CHAR.ASSASSIN,
    won: {
      byGood: store => ac.sum.succeededQuests(store) >= 3,
      byEvil: store => ac.sum.failedQuests(store) >= 3,
    },
    completeConditionFulfilled: store =>
      ac.is.won.byGood(store) || ac.is.won.byEvil(store),
    quest: {
      taken: (quest) =>
        ac.is.notInStage(quest, QUEST_STAGE.NOT_TAKEN)
    },

    squadVoting: {
      doneFor: (quest, userId) => Boolean(
        ac.get.squadVoters(quest).find(voterId => idsEqual(voterId, userId))),
      done: (store, quest) =>
        (ac.get.squadVoters(quest).length === ac.get.playersCount(store)),
      success: (store, quest) =>
        (ac.sum.successSquadVotes(quest) > ac.get.playersCount(store) / 2),
      failure: (store, quest) =>
        (ac.is.squadVoting.success(store, quest) === false),
      limitExceeded: (store, quest) =>
        (quest.votingHistory.length >= store.configuration.squadVotingLimit),
    },

    questVoting: {
      doneFor: (quest, userId) => Boolean(
        ac.get.questVoters(quest).find(voterId => idsEqual(voterId, userId))),
      done: (store, quest) =>
        (ac.get.questVoters(quest).length === ac.get.squadCountRequired(store, quest)),
      success: (store, quest) =>
        (ac.sum.failureQuestVotes(quest) < ac.get.failureCountRequired(store, quest)),
      failure: (store, quest) =>
        (ac.is.questVoting.success(store, quest) === false),
    },
  }
}

module.exports = ac;