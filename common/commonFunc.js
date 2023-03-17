exports.sendToSlack = async (channel, message, status)=>{
    const axios = require("axios");
    const notifyMnoScrapingResult = "https://hooks.slack.com/services/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"
    const notifyMsaferScrapingResult = "https://hooks.slack.com/services/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";
    const naverSearchScrapingResult = "https://hooks.slack.com/services/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";
    const map = {
        "mno":notifyMnoScrapingResult,
        "msafer":notifyMsaferScrapingResult,
        "gowid":notifyMsaferScrapingResult,
        "searchAd":naverSearchScrapingResult
        }

    let text = null;

    if(status==200){
        text = ":large_green_circle: ["+channel+" 성공]: "+message
    }else if(status==400){
        text = ":red_circle: ["+channel+" 실패]: "+message
    }

    result = await axios({
        method:'POST',
        url:map[channel],
        data:{
            'text':text
        }
    });
    return;

}