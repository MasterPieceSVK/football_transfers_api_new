const manualGrabber = require("./manualGrabber");

async function manualToDb(url, leagueId, pool, top) {
  let results = await manualGrabber(url);
  let numberOfAddedEntries = 0;

  try {
    let values = results.map((result) => {
      let time_added = result.time_added;
      // time_added = time_added.toLocaleString();
      time_added = new Date(new Date(time_added).toISOString());
      let market_value = result.marketValue;
      if (!market_value) {
        market_value = null;
      }
      return [
        result.name,
        result.playerImage,
        result.fromClub,
        result.fromClubIcon,
        result.toClub,
        result.toClubIcon,
        result.fee,
        result.feeSubtitle,
        result.position,
        result.contract,
        market_value,
        result.transferDate,
        leagueId,
        time_added,
      ];
    });

    values.reverse();

    // console.log(values);
    let lastEntry;
    if (top) {
      lastEntry = await pool.query(
        `SELECT name,transfer_date,from_club FROM top_all_transfers WHERE league_id=$1 ORDER BY id DESC LIMIT 1`,
        [leagueId]
      );
    } else {
      lastEntry = await pool.query(
        `SELECT name,transfer_date,from_club FROM all_transfers WHERE league_id=$1 ORDER BY id DESC LIMIT 1`,
        [leagueId]
      );
    }

    let indexOfFirstDupe;
    if (lastEntry.rows.length > 0) {
      const lastEntryName = lastEntry.rows[0].name;
      const lastEntryTransferDate = lastEntry.rows[0].transfer_date;
      const lastEntryFromClub = lastEntry.rows[0].from_club;

      const inputDate = new Date(lastEntryTransferDate);
      const options = { year: "numeric", month: "short", day: "numeric" };
      const outputDateString = inputDate.toLocaleString("en-US", options);
      // console.log(outputDateString, lastEntryName, lastEntryTransferDate);
      // find the index of the first duplicate player transfer

      for (let i = 0; i < values.length; i++) {
        const foundIndex = values.findIndex(
          (element) =>
            element[0] == lastEntryName &&
            element[11] == outputDateString &&
            element[2] == lastEntryFromClub
        );

        if (foundIndex != -1) {
          // console.log("index found at index " + foundIndex);
          indexOfFirstDupe = foundIndex;
          break;
        }
      }
      // console.log(indexOfFirstDupe);
    }
    // console.log(indexOfFirstDupe);
    if (indexOfFirstDupe >= 0) {
      values = values.slice(indexOfFirstDupe + 1);
    }

    if (values.length > 0) {
      numberOfAddedEntries = values.length;
    }

    // console.log(values);
    if (values.length > 0) {
      const placeholders = values
        .map(
          (_, i) =>
            `($${i * 14 + 1}, $${i * 14 + 2}, $${i * 14 + 3}, $${
              i * 14 + 4
            }, $${i * 14 + 5}, $${i * 14 + 6}, $${i * 14 + 7}, $${
              i * 14 + 8
            }, $${i * 14 + 9}, $${i * 14 + 10}, $${i * 14 + 11}, $${
              i * 14 + 12
            }, $${i * 14 + 13}, $${i * 14 + 14})`
        )
        .join(",");

      // Add the table name directly into the query string
      let query;
      if (top) {
        query = {
          text: `INSERT INTO top_all_transfers ("name","player_image","from_club","from_club_icon","to_club","to_club_icon","fee","fee_subtitle","position","contract","market_value","transfer_date", "league_id", "time_added") VALUES ${placeholders}`,
          values: [].concat(...values),
        };
      } else {
        query = {
          text: `INSERT INTO all_transfers ("name","player_image","from_club","from_club_icon","to_club","to_club_icon","fee","fee_subtitle","position","contract","market_value","transfer_date", "league_id", "time_added") VALUES ${placeholders}`,
          values: [].concat(...values),
        };
      }

      await pool.query(query);
    }
  } catch (er) {
    console.log(er);
  }
  return numberOfAddedEntries;
}

module.exports = manualToDb;
