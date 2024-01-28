async function ifOneLeague(client, league_id, top) {
  const table_name_query = `SELECT name_of_table FROM leagues WHERE id=$1`;
  let table_name = await client.query(table_name_query, [league_id]);
  table_name = table_name.rows[0].name_of_table;
  let finalQuery;
  if (top) {
    finalQuery = `SELECT * FROM top_${table_name}`;
  } else {
    finalQuery = `SELECT * FROM ${table_name}`;
  }

  return finalQuery;
}

module.exports = ifOneLeague;
