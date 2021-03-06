/**
 * [Author] Penumbra
 * [Date] 2020-09-21
 */

import puppeteer from "puppeteer";
import chalk from "chalk";
import path from "path";
import fs from "fs";
import rm from "rimraf";

const log = (message: string, color?: string): void => {
  let printColor = color || "green";
  // @ts-ignore
  console.log(chalk[printColor](message));
};

const BASE_URL: string = "https://juejin.im";

// TODO:
// Merge Seperate PDFS
// Bottom Button Remove
// Custom Tab/KeyWord
// Automatic Dev Script
// Type Definitions Accomplished
//

enum Tab2URL {
  FE = "frontend",
  BE = "backend",
  ANDROID = "android",
  IOS = "ios",
  AI = "ai",
  TOOL = "freebie",
  LIFE = "career",
  ARTICLE = "article",
}

const mkdirOutputpath = (outputPath: string): void => {
  try {
    fs.mkdirSync(outputPath);
    log("√ mkdir successfully!");
  } catch (e) {
    log(`X mkdir  failed! ${JSON.stringify(e)}`, "red");
  }
};

const outputConfig = {
  // 输出路径
  outputPath: "./article-output/",
  // 生成pdf时的页边距
  margin: {
    top: "60px",
    right: "0px",
    bottom: "60px",
    left: "0px",
  },
  // 生成pdf时是否显示页眉页脚
  displayHeaderFooter: true,
  // 生成pdf页面格式
  format: "A4" as "A4",
};

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  log("√ Open New Page Successfully");
  //   await page.goto(`${BASE_URL}/${Tab2URL["FE"]}`);
  // FIXME: use single article url to test PDF print
  await page.goto("https://juejin.im/post/6859314697204662279");
  log(`√ Open ${BASE_URL}/${Tab2URL["FE"]} Successfully`);
  await page.waitFor(2000);

  const wh = await page.evaluate(() => {
    return {
      width: 1920,
      height: document.documentElement.clientHeight,
    };
    // return {
    //   width: 400,
    //   height: 628,
    // };
  });

  await page.setViewport(wh);
  await page.waitFor(3000);

  // Get Article Main Part
  await page.evaluate(() => {
    // TODO: insert actions
    // TODO: title & author
    try {
      const main = document.querySelector(".main-area")!;
      const container = document.querySelector(".view")!;
      const global = document.querySelector(".view-container")!;

      const comment = document.querySelector("#comment-box")!;
      const tag = document.querySelector(".tag-list-box")!;
      const banner = document.querySelector(".article-banner")!;

      const recommended = document.querySelector(".recommended-area")!;
      const suspended = document.querySelector(".article-suspended-panel")!;
      const action = document.querySelector(".action-box")!;

      const header = document.querySelector(".main-header-box")!;

      main.removeChild(comment);
      main.removeChild(tag);
      main.removeChild(banner);
      main.removeChild(action);
      global.removeChild(header);

      container.removeChild(recommended);
      container.removeChild(suspended);

      comment.parentNode!.removeChild(comment);
      tag.parentNode!.removeChild(tag);
      banner.parentNode!.removeChild(banner);
      recommended.parentNode!.removeChild(recommended);
      suspended.parentNode!.removeChild(suspended);
      header.parentNode!.removeChild(header);
      action.parentNode!.removeChild(action);

      // const imgList = Array.from(document.querySelectorAll("img"));

      // for (let img of imgList) {
      //   img.parentNode!.removeChild(img);
      // }
    } catch (e) {}
  });

  const outputPath = path.resolve(__dirname, outputConfig.outputPath);
  const isExists = fs.existsSync(outputPath);

  log(`${isExists ? `${outputPath}` : "Create"}`);

  isExists
    ? mkdirOutputpath(outputPath)
    : rm(outputPath, (err) => {
        if (err) throw err;
        console.log("remove the file successfully!");
        mkdirOutputpath(outputPath);
      });

  log(`Current OutputPath: ${outputPath}`);

  // await page.pdf({
  //   // 注意文件名需要带上 ".pdf" 后缀
  //   path: path.resolve(__dirname, outputPath, "xxx.pdf"),
  //   margin: outputConfig.margin,
  //   displayHeaderFooter: outputConfig.displayHeaderFooter,
  //   format: outputConfig.format,
  // });
})();
