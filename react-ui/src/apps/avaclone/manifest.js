const CHAR = {
  MORDRED: "MORDRED",
  MORGANA: "MORGANA",
  MERLIN: "MERLIN",
  PERCIVAL: "PERCIVAL",
  ASSASSIN: "ASSASSIN",
  OBERON: "OBERON",
  GOOD: "GOOD",
  EVIL: "EVIL"
};

const TEAM = {
  EVIL: [
    CHAR.EVIL,
    CHAR.MORDRED,
    CHAR.MORGANA,
    CHAR.ASSASSIN,
    CHAR.OBERON
  ],
  GOOD: [
    CHAR.GOOD,
    CHAR.MERLIN,
    CHAR.PERCIVAL
  ]
};

const STAGE = {
  NOT_INITIALIZED: "NOT_INITIALIZED",
  CONFIGURATION: "CONFIGURATION",
  COMPLETE: "COMPLETE",
  QUEST_SELECTION: "QUEST_SELECTION",
  SQUAD_PROPOSAL: "SQUAD_PROPOSAL",
  SQUAD_VOTING: "SQUAD_VOTING",
  QUEST_VOTING: "QUEST_VOTING"
};

const QUEST_STAGE = {
  NOT_TAKEN: "NOT_TAKEN",
  ONGOING: "ONGOING",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE"
};

const evilVisibilityMap = {
  [CHAR.EVIL]: CHAR.EVIL,
  [CHAR.MORDRED]: CHAR.EVIL,
  [CHAR.MORGANA]: CHAR.EVIL,
  [CHAR.ASSASSIN]: CHAR.EVIL,
  [CHAR.OBERON]: CHAR.EVIL,
  [CHAR.GOOD]: CHAR.GOOD,
  [CHAR.MERLIN]: CHAR.GOOD,
  [CHAR.PERCIVAL]: CHAR.GOOD
};

const goodVisibilityMap = {
  [CHAR.EVIL]: CHAR.GOOD,
  [CHAR.MORDRED]: CHAR.GOOD,
  [CHAR.MORGANA]: CHAR.GOOD,
  [CHAR.ASSASSIN]: CHAR.GOOD,
  [CHAR.OBERON]: CHAR.GOOD,
  [CHAR.GOOD]: CHAR.GOOD,
  [CHAR.MERLIN]: CHAR.GOOD,
  [CHAR.PERCIVAL]: CHAR.GOOD
}

const VISIBILITY_MAP = {
  [CHAR.EVIL]: evilVisibilityMap,
  [CHAR.MORDRED]: {
    ...evilVisibilityMap,
    [CHAR.MORDRED]: CHAR.MORDRED,
  },
  [CHAR.MORGANA]: {
    ...evilVisibilityMap,
    [CHAR.MORGANA]: CHAR.MORGANA,
  },
  [CHAR.ASSASSIN]: {
    ...evilVisibilityMap,
    [CHAR.ASSASSIN]: CHAR.ASSASSIN,
  },
  [CHAR.OBERON]: {
    ...goodVisibilityMap,
    [CHAR.OBERON]: CHAR.OBERON,
  },
  [CHAR.GOOD]: goodVisibilityMap,
  [CHAR.MERLIN]: {
    ...evilVisibilityMap,
    [CHAR.MERLIN]: CHAR.MERLIN,
    [CHAR.MORDRED]: CHAR.GOOD,
  },
  [CHAR.PERCIVAL]: {
    ...goodVisibilityMap,
    [CHAR.PERCIVAL]: CHAR.PERCIVAL,
    [CHAR.MERLIN]: CHAR.MERLIN,
    [CHAR.MORGANA]: CHAR.MERLIN,
  }
};


const LOYALITY_MAP = {
  5: { good: 3, evil: 2 },
  6: { good: 4, evil: 2 },
  7: { good: 4, evil: 3 },
  8: { good: 5, evil: 3 },
  9: { good: 6, evil: 3 },
  10: { good: 6, evil: 4 }
};

const QUEST_MAP = {
  5: {
    squadCount: [2, 3, 2, 3, 3],
    failsRequired: [1, 1, 1, 1, 1]
  },
  6: {
    squadCount: [2, 3, 4, 3, 4],
    failsRequired: [1, 1, 1, 1, 1]
  },
  7: {
    squadCount: [2, 3, 3, 4, 4],
    failsRequired: [1, 1, 1, 2, 1]
  },
  8: {
    squadCount: [3, 4, 4, 5, 5],
    failsRequired: [1, 1, 1, 2, 1]
  },
  9: {
    squadCount: [3, 4, 4, 5, 5],
    failsRequired: [1, 1, 1, 2, 1]
  },
  10: {
    squadCount: [3, 4, 4, 5, 5],
    failsRequired: [1, 1, 1, 2, 1]
  }
};

const questData = {
  number: 0,
  stage: QUEST_STAGE.NOT_TAKEN,
  squad: null,
  votingHistory: null,
  squadVotes: null,
  questVotes: null
}

module.exports = {
  NAME: "AVACLONE",
  EXCLUSIVE: true,
  HOT_JOIN: true,
  HOT_LEAVE: true,
  FULLSCREEN: false,

  DEFAULT_STORE: {
    stage: STAGE.NOT_INITIALIZED,
    roundNumber: 0,
    playersOrder: [],
    charactersMap: {},
    configuration: {
      squadVotingLimit: 3,
      squadProposalLimit: 0,
      questVotingLimit: 0,
      squadProposalVotingLimit: 0,
      specialChars: {
        [CHAR.ASSASSIN]: false,
        [CHAR.MORGANA]: false,
        [CHAR.MERLIN]: false,
        [CHAR.MORDRED]: false,
        [CHAR.PERCIVAL]: false,
        [CHAR.OBERON]: false,
      }
    },
    quests: {
      1: {
        ...questData,
        number: 1
      },
      2: {
        ...questData,
        number: 2
      },
      3: {
        ...questData,
        number: 3
      },
      4: {
        ...questData,
        number: 4
      },
      5: {
        ...questData,
        number: 5
      }
    }
  },

  CONSTS: {
    STAGE,
    CHAR,
    TEAM,
    LOYALITY_MAP,
    VISIBILITY_MAP,
    QUEST_STAGE,
    QUEST_MAP,
    ACTION: {
      APP_UPDATE_AVACLONE: "APP_UPDATE_AVACLONE",
      AVACLONE_START: "AVACLONE_START",
      AVACLONE_CONFIGURE: "AVACLONE_CONFIGURE",
      AVACLONE_CONFIGURE_FULFILLED: "AVACLONE_CONFIGURE_FULFILLED",
      AVACLONE_CONFIGURE_REJECTED: "AVACLONE_CONFIGURE_REJECTED",
      AVACLONE_QUEST_SELECT: "AVACLONE_QUEST_SELECT",
      AVACLONE_SQUAD_PROPOSE: "AVACLONE_SQUAD_PROPOSE",
      AVACLONE_SQUAD_CONFIRM: "AVACLONE_SQUAD_CONFIRM",
      AVACLONE_SQUAD_VOTE: "AVACLONE_SQUAD_VOTE",
      AVACLONE_QUEST_VOTE: "AVACLONE_QUEST_VOTE",
      AVACLONE_CLEAR: "AVACLONE_CLEAR",
    }
  }
};
