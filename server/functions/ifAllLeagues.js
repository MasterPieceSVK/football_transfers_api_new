const allLeagues = require("../../transferGrabberFunctions/allLeagues");

async function ifAllLeagues(top) {
  let selectStatements;
  if (top) {
    selectStatements = `SELECT * FROM top_all_transfers`;
  } else {
    selectStatements = `SELECT * FROM all_transfers`;
  }

  return selectStatements;
}

module.exports = ifAllLeagues;
