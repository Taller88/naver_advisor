const { chromium } = require('playwright');
const axios = require('axios');

let browser = null;
let context = null;
let page = null;

const definePlaywight = async function(){
    
    console.log("definePlaywight init!");
    browser = await chromium.launch({headless:false});
    context = await browser.newContext();
    page = await context.newPage();

    console.log("definePlaywight complete!");

}

const naverLogin = async function(){
    try {
        // await page.goto('https://nid.naver.com/nidlogin.login');
        await page.goto('https://searchadvisor.naver.com/');

        await page.click('#app > div > main > div > div:nth-child(1) > header > div > div.hidden-sm-and-down.d-md-flex.no-gutters > div > div.hidden-sm-and-down.flex-shrink-1.ml-3 > button');
        await page.waitForSelector('#app > div > main > div > div:nth-child(1) > header > div > div.hidden-sm-and-down.d-md-flex.no-gutters > div > div.hidden-sm-and-down.flex-shrink-1.ml-3 > button');

        // 아이디와 비밀번호 입력
        await page.type('#id', 'moyocompany');
        await page.type('#pw', 'ahdyrkwmdk!!');
        
       /**
        * 
        * ========================================로그인 과정========================================
        * 
        */

        // await browser.close();
        let response = await page.waitForResponse(response => response.url().includes('api/auth/login-token') && response.status() === 200);
        let bodyJson = await response.json();
        const encId = bodyJson["userData"]["enc_id"];
        console.log("encId: "+encId);

        // 로그인 성공까지 대기!
        await page.waitForSelector('#app > div > main > div > div:nth-child(1) > header > div > div.hidden-sm-and-down.d-md-flex.no-gutters > a:nth-child(2)');
        let cookie = "";

        await context.route("**/*", (route, request) => {
            // console.log(`Intercepted: ${request.url()}`);
            if(request.url().includes('/api-console/report/diagnosis/meta/')){
                const headers = request.headers()
                console.log(headers);
                const cookiesTemp = headers["cookie"];
                console.log(`Cookies: ${cookiesTemp}`);
                cookie = cookiesTemp               
            }
            route.continue();
          });


        // '웹 마스터 도구' 클릭
        await page.click('#app > div > main > div > div:nth-child(1) > header > div > div.hidden-sm-and-down.d-md-flex.no-gutters > a:nth-child(2)')

        // moyoplan 도메인 클릭
        await page.click('#app > div > main > div > div.container.py-0 > div.row.mt-5.mb-12.no-gutters > div > div > div > table > tbody > tr > td:nth-child(2) > a')

        await page.click('#app > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div.row.mt-8.pb-12.justify-space-between > div.hidden-sm-and-down.py-0.col.col-3 > div > div > div:nth-child(2) > div.v-list-group__header.v-list-item.v-list-item--link.theme--light > div.v-list-item__icon.v-list-group__header__append-icon > i')        
        await page.click('#app > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div.row.mt-8.pb-12.justify-space-between > div.hidden-sm-and-down.py-0.col.col-3 > div > div > div.v-list-group.primary--text.text--darken-2.v-list-group--active.v-list-group--no-action.primary--text > div.v-list-group__items > div > a:nth-child(1) > div > div > div')

        
        // response = await page.waitForResponse(response => response.url().includes('/api-console/report/diagnosis/meta/') && response.status() === 200);
        // bodyJson = await response.json();

        await browser.close();

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        const host = "https://searchadvisor.naver.com";
        let path = "/api-console/report/expose/"+encId+"?site=https:%2F%2Fwww.moyoplan.com&period=90&device=d&topN=10"
        header = {};
        //GET https://searchadvisor.naver.com/api-console/report/expose/f1b32b2c0ff7ee775bfc329fc72fec106ecb661d18a9c6cdb7e85dfb8cab3a9b?site=https:%2F%2Fwww.moyoplan.com&period=30&device=d&topN=10        
        header['Host']='searchadvisor.naver.com'
        header['Connection']='keep-alive'
        header['sec-ch-ua']='"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"'
        header['Accept']='application/json, text/plain, */*'
        header['sec-ch-ua-mobile']='?0'
        header['User-Agent']='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        header['sec-ch-ua-platform']='"Windows"'
        header['Sec-Fetch-Site']='same-origin'
        header['Sec-Fetch-Mode']='cors'
        header['Sec-Fetch-Dest']='empty'
        header['Referer']='https://searchadvisor.naver.com/console/site/report/expose?site=https%3A%2F%2Fwww.moyoplan.com'
        header['Accept-Encoding']='gzip, deflate, br'
        header['Accept-Language']='ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'        
        header['Cookie']=cookie;

        result = await axios({
            method:'GET',
            url:host+path,
            headers:header
        });

        let resultData = result.data;
        
        console.log("================================================================PC+Mobile================================================================================================")
        console.log(JSON.stringify(resultData));


        path = "/api-console/report/expose/"+encId+"?site=https:%2F%2Fwww.moyoplan.com&period=90&device=pc&topN=10"
        header = {};
        //GET https://searchadvisor.naver.com/api-console/report/expose/f1b32b2c0ff7ee775bfc329fc72fec106ecb661d18a9c6cdb7e85dfb8cab3a9b?site=https:%2F%2Fwww.moyoplan.com&period=30&device=d&topN=10        
        header['Host']='searchadvisor.naver.com'
        header['Connection']='keep-alive'
        header['sec-ch-ua']='"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"'
        header['Accept']='application/json, text/plain, */*'
        header['sec-ch-ua-mobile']='?0'
        header['User-Agent']='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        header['sec-ch-ua-platform']='"Windows"'
        header['Sec-Fetch-Site']='same-origin'
        header['Sec-Fetch-Mode']='cors'
        header['Sec-Fetch-Dest']='empty'
        header['Referer']='https://searchadvisor.naver.com/console/site/report/expose?site=https%3A%2F%2Fwww.moyoplan.com'
        header['Accept-Encoding']='gzip, deflate, br'
        header['Accept-Language']='ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'        
        header['Cookie']=cookie;

        result = await axios({
            method:'GET',
            url:host+path,
            headers:header
        });

        resultData = result.data;

        console.log("================================================================PC================================================================================================")
        console.log(JSON.stringify(resultData));
        


        path = "/api-console/report/expose/"+encId+"?site=https:%2F%2Fwww.moyoplan.com&period=90&device=mo&topN=10"
        header = {};
        //GET https://searchadvisor.naver.com/api-console/report/expose/f1b32b2c0ff7ee775bfc329fc72fec106ecb661d18a9c6cdb7e85dfb8cab3a9b?site=https:%2F%2Fwww.moyoplan.com&period=30&device=d&topN=10        
        header['Host']='searchadvisor.naver.com'
        header['Connection']='keep-alive'
        header['sec-ch-ua']='"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"'
        header['Accept']='application/json, text/plain, */*'
        header['sec-ch-ua-mobile']='?0'
        header['User-Agent']='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        header['sec-ch-ua-platform']='"Windows"'
        header['Sec-Fetch-Site']='same-origin'
        header['Sec-Fetch-Mode']='cors'
        header['Sec-Fetch-Dest']='empty'
        header['Referer']='https://searchadvisor.naver.com/console/site/report/expose?site=https%3A%2F%2Fwww.moyoplan.com'
        header['Accept-Encoding']='gzip, deflate, br'
        header['Accept-Language']='ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'        
        header['Cookie']=cookie;

        result = await axios({
            method:'GET',
            url:host+path,
            headers:header
        });

        resultData = result.data;


        console.log("================================================================Mobile================================================================================================")
        console.log(JSON.stringify(resultData));
        
        // postData = '{"osType":"WEB","email":"'+email+'","password":"'+password+'","refreshToken":null}'

        // result = await axios({
        //     method:'POST',
        //     url:host+'/auth/v2/token/issue',
        //     data:postData,
        //     headers:header
        // });

    } catch (error) {
        console.log(error);
        console.log("playwright naverLogin error")        
    }
};

(async () => {
    console.log("init!");
    await definePlaywight();
    
    // page.route('https://searchadvisor.naver.com/api/auth/login-token', async (route, req) => {

    //     console.log("route!!!!!!!!!!!!!!")
    //     const response = await req.response();
    //     console.log(response)
    //     const json = await response.json();
        

    //     console.log(json)
    //     console.log("route!!!!!!!!!!!!!! json ")

    // });

    console.log(process.cwd());

    console.log("playwright init!");
    await naverLogin();
    console.log("playwright end!");
    console.log(process.cwd());

})()

