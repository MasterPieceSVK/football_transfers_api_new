const allLeagues = require("../../transferGrabberFunctions/allLeagues");

async function ifAllLeagues(top) {
  let selectStatements;
  if (top) {
    selectStatements = allLeagues.map((league) => {
      return `SELECT * FROM top_${league.table}`;
    });
  } else {
    selectStatements = allLeagues.map((league) => {
      return `SELECT * FROM ${league.table}`;
    });
  }

  let finalQuery = selectStatements.join(" UNION ALL ");
  return finalQuery;
}

module.exports = ifAllLeagues;
