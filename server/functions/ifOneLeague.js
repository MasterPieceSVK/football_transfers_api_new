async function ifOneLeague(top) {
  let finalQuery;
  if (top) {
    finalQuery = `SELECT * FROM top_all_transfers WHERE league_id=$1`;
  } else {
    finalQuery = `SELECT * FROM all_transfers WHERE league_id=$1`;
  }

  return finalQuery;
}

module.exports = ifOneLeague;
