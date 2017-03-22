const Koa = require('koa');
const router = (require('koa-router'))();
const fs = require('fs');

const {headers} = require('./config.js');
const {requestP} = require('./modules/request.js');
const cheerio = require('cheerio');

const app = new Koa();

app.use(async (ctx, next) => {
    await next();
});
router.get('/:page', async (ctx, next) => {
    let page = Number(ctx.params.page);
    page = isNaN(page) ? null : page;
    let pagesNum = await getPagesNum();

    let data = await main();
    ctx.body = '1'
});
app.use(router.routes());
app.listen(3000);

async function getPagesNum() {
    let data = await requestP(headers);
    let $ = cheerio.load(data);
    return $('span.current-comment-page')[0].children[0].data.replace('[', '').replace(']', '');
}

async function main(page) {
    let packData = (data) => {
        const $ = cheerio.load(data);
        let imgsArr = $('.text img').toArray();
        return imgsArr.map(img => {
            return {
                src: img.attribs.src
            };
        });
    }
    try {
        let data = await requestP(headers);
        let imgsurlArr = packData(data);
        return imgsurlArr;
    } catch (e) {
        console.log(`[error]: ${JSON.stringify(e)}`);
        return [];
    }
}