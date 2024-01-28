async function ifAllLeagues(top) {
  let selectStatements;
  if (top) {
    selectStatements = `
    SELECT * FROM (
      SELECT DISTINCT ON (name, player_image, from_club, from_club_icon, "to_club", "to_club_icon", "fee", "fee_subtitle", "position", "contract", "market_value", "transfer_date")
      *
      FROM top_all_transfers
      ORDER BY name, player_image, from_club, from_club_icon, "to_club", "to_club_icon", "fee", "fee_subtitle", "position", "contract", "market_value", "transfer_date"
    ) sub`;
  } else {
    selectStatements = `
    SELECT * FROM (
      SELECT DISTINCT ON (name, player_image, from_club, from_club_icon, "to_club", "to_club_icon", "fee", "fee_subtitle", "position", "contract", "market_value", "transfer_date")
      *
      FROM all_transfers
      ORDER BY name, player_image, from_club, from_club_icon, "to_club", "to_club_icon", "fee", "fee_subtitle", "position", "contract", "market_value", "transfer_date"
    ) sub`;
  }

  return selectStatements;
}

module.exports = ifAllLeagues;
