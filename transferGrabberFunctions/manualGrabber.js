// import puppeteer from "pupeteer";
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

require("dotenv").config();

const manualGrabber = async (baseURL, table, params) => {
  puppeteer.use(StealthPlugin());
  const url = new URL(baseURL);
  if (params) {
    url.search = new URLSearchParams(params).toString();
  }

  const browser = await puppeteer.launch({
    headless: "new",
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto(url.href, { timeout: 0 });

    try {
      await page.waitForSelector(".fc-primary-button", { timeout: 1000 }); // waits for 5 seconds
      await page.click(".fc-primary-button");
    } catch (error) {}

    // await page.waitForSelector(
    //   "div.css-lsp674-TransferItemContainer-TransferItemGrid"
    // );
    await page.screenshot({ path: `screenshots/${table}.png` });

    const allTransfers = await page.evaluate(() => {
      const transfers = document.querySelectorAll(
        "div.css-lsp674-TransferItemContainer-TransferItemGrid"
      );
      let time_added = Date.now();

      return Array.from(transfers).map((transfer) => {
        // name
        const nameElement = transfer.querySelector(
          "div.css-96nd5q-NameAndTeam > a"
        );
        const name = nameElement ? nameElement.innerText : null;

        //player image
        const playerImageElement = transfer.querySelector(
          "div.PlayerIcon > img"
        );
        const playerImage = playerImageElement ? playerImageElement.src : null;

        // from club

        let fromClubElement = transfer.querySelector(
          "div.css-81ylns-ClubContainer-ClubContainer > span"
        );
        let fromClub = fromClubElement ? fromClubElement.innerText : null;
        if (!fromClub) {
          fromClubElement = transfer.querySelector(
            "div.css-3bqrvv-ClubContainer > span"
          );
          fromClub = fromClubElement ? fromClubElement.innerText : null;
        }

        // from club icon
        const fromClubIconElement = transfer.querySelector(
          "div.css-81ylns-ClubContainer-ClubContainer > img"
        );
        const fromClubIcon = fromClubIconElement
          ? fromClubIconElement.src
          : null;

        //to club
        let toClubElement = transfer.querySelector(
          "div.css-1be32r3-ToClubContainer > a > span"
        );
        let toClub = toClubElement ? toClubElement.innerText : null;
        if (!toClub) {
          toClubElement = transfer.querySelector(
            "div.css-1be32r3-ToClubContainer > span"
          );
          toClub = toClubElement ? toClubElement.innerText : null;
        }

        // to club icon
        const toClubIconElement = transfer.querySelector(
          "div.css-1be32r3-ToClubContainer > a > img"
        );
        const toClubIcon = toClubIconElement ? toClubIconElement.src : null;
        // fee subtitle
        const feeSubtitleElement = transfer.querySelector(
          "span.css-qi5qxe-LoanSubtitle"
        );
        let feeSubtitle = feeSubtitleElement
          ? feeSubtitleElement.innerText
          : null;

        // fee
        const feeElement = transfer.querySelector(
          "div.css-1h2jmoc-FeeTextContainer > span"
        );

        // on loan = 0.1
        // free transfer = 0.2
        let fee = feeElement ? feeElement.innerText : null;
        if (fee) {
          if (fee.endsWith("M")) {
            fee = fee.replace(/[^0-9.]/g, "");
            fee = Number(fee);
            fee = fee.toFixed(1);
            fee = fee * 1000000;
          } else if (fee.endsWith("K")) {
            fee = fee.replace(/[^0-9.]/g, "");
            fee = Number(fee);
            fee = fee.toFixed(1);
            fee = fee * 1000;
          } else if (fee == "On Loan") {
            feeSubtitle = "On Loan";
            fee = null;
          } else if (fee == "Free Transfer") {
            feeSubtitle = "Free Transfer";
            fee = null;
          } else {
            fee = null;
          }
        }

        // position
        const positionElement = transfer.querySelector(
          "div.css-6b8uq8-PlayerPositionChip"
        );
        const position = positionElement ? positionElement.innerText : null;

        // contract

        const contractElement = transfer.querySelector(
          "div.css-lsp674-TransferItemContainer-TransferItemGrid > span"
        );

        const contract = contractElement ? contractElement.innerText : null;

        // martket value
        const marketValueElement = transfer.querySelectorAll(
          "div.css-lsp674-TransferItemContainer-TransferItemGrid > span"
        )[1];
        let marketValue = marketValueElement
          ? marketValueElement.innerText
          : null;

        if (marketValue) {
          if (marketValue.endsWith("M")) {
            marketValue = marketValue.replace(/[^0-9.]/g, "");
            marketValue = Number(marketValue);

            marketValue = marketValue * 1000000;
          } else if (marketValue.endsWith("K")) {
            marketValue = marketValue.replace(/[^0-9.]/g, "");
            marketValue = Number(marketValue);

            marketValue = marketValue * 1000;
          } else {
            marketValue = Number(marketValue);
            if (isNaN(marketValue)) {
              marketValue = null;
            }
          }
        }

        // transfer date
        const transferDateElement = transfer.querySelector(
          "span.css-1swbb4c-TransferDate"
        );
        const transferDate = transferDateElement
          ? transferDateElement.innerText
          : null;
        time_added -= 1;
        return {
          name,
          playerImage,
          fromClub,
          fromClubIcon,
          toClub,
          toClubIcon,
          fee,
          feeSubtitle,
          position,
          contract,
          marketValue,
          transferDate,
          time_added,
        };
      });
    });
    return allTransfers;
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
};
module.exports = manualGrabber;
// async function debug(url, table) {
//   const abc = await manualGrabber(url, table);
//   console.log(abc);
// }

// debug("https://www.fotmob.com/transfers?showTop=true", "seria_a");
