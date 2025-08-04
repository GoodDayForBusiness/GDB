import dotenv from "dotenv"
//import mysql from "mysql2"
dotenv.config()

import {
  getStoreZonesParams,
  getStoreByZoneandIndustryParams,
  CollectZoneStoreDataParams
} from './types';


import { createConnection } from "net"
/*
const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'kimm97531!',
    database : 'areadb'
})*/
//123
/*
connection.connect(err => { 
    if (err) {
        console.error('❌ MySQL 연결 실패:', err.message);
    } else {
        console.log('✅ MySQL 연결 성공!');
    }
})*/

//service.ts의 역할 : 외부 api를 가져오는 메서드들을 담은 클래스를 정의하는 파일
export class BbsArticleService {
    /*
    async getSeoulMarketZone(param : MarketZone){
    const sql = `
        SELECT * FROM 서울시상권분석
        WHERE (상권_구분_코드 = ?)
        AND (상권_코드 = ?)
        AND (상권_코드_명 = ?)
        AND (엑스좌표_값 = ?)
        AND (와이좌표_값 = ?)
        AND (자치구_코드 = ?)
        AND (자치구_코드_명 = ?)
        AND (행정동_코드 = ?)
        AND (행정동_코드_명 = ?)
        AND (영역_면적 = ?)`

        const values = [
            param.상권_구분_코드,
            param.상권_코드,
            param.상권_코드_명,
            param.엑스좌표_값,
            param.와이좌표_값,
            param.자치구_코드,
            param.자치구_코드_명,
            param.행정동_코드,
            param.행정동_코드_명,
            param.영역_면적
        ]
        const data =  await connection.execute(sql)
        console.log(data)
    }
*//*
    async getAllSeoulMarketZones(){
        //const sql = `select * from 서울시상권분석`
        //const data = await connection.execute(sql)
        //console.log(typeof(data))
        const url = `https://localhost:3030/getDB`
        const res = await fetch(url).then((response)=>{
            return response.json()
        })

        console.log(res)
    }
    */



    //typeScript에서 클래스의 메서드 정의할때 function 키워드 없이 메서드 이름만 적어주면 된다.
    async getStoreZones(params : getStoreZonesParams) : Promise<any>{ //구분ID, 행정구역코드 파라미터로, 구체적 설명은 readme에
        //ex) divId = ctprvnCd(시도단위로), key = 11 (서울특별시)
        const url =`https://apis.data.go.kr/B553077/api/open/sdsc2/storeZoneInAdmi?divId=${params.divId}&key=${params.key}&type=json&serviceKey=${process.env.DATA_API_KEY3}` 
        const res = await fetch(url).then((response)=>{
        return response.json()
        }).then((data)=>{
            console.log(data.body.items)
            return data.body.items
        })

        return res
    }

    //각 상권 업종별 점포 수 조회 함수(9번 오퍼레이션)
 async getStoreByZoneandIndustry(params : getStoreByZoneandIndustryParams): Promise<any[]>{
    var pageNo = 1
    const numOfRows = 20
    const result = []

    while(true){
        //ex) divId =  indsLclsCd(대분류),key = I2(음식점)
        const url = `https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInArea?key=${params.key}&indsLclsCd=${params.indsLclsCd}&indsMclsCd=${params.indsMclsCd}&indsSclsCd=${params.indsSclsCd}&numOfRows=${params.numOfRows}&pageNo=${params.pageNo}&type=json&serviceKey=${process.env.DATA_API_KEY}`
        const res = await fetch(url).then((response)=>{
            return response.json()
        }).then((data)=>{
            //console.log(data.body.items, {depth : null})
            return data.body.items
        }).catch((error)=>{
            console.error(`page ${pageNo} 에서 ${error}에러`)
            return []
        })

        if(!res ||res.length == 0) //undefined일시 error 발생하므로 예외처리
            break

        result.push(...res)    
        pageNo++
    }
        return result
    }

    //특정 구역의 상권 목록 조회 후, 상권의 업종별 점포 수 모으기
    async collectZoneStoreData(params : CollectZoneStoreDataParams){ 
    //지역코드(ex) 서울 : 11), 업종 코드(ex) 음식점 I2)를 파라미터로 받는다.
    //const zones = await this.getStoreZones("ctprvnCd",zoneCode)
    const zones = await this.getStoreZones(params.getStoreZonesParams)
    const result = [] //상권명 + 점포 리스트 결과 넣을 배열
    let cnt = 1

    for(const zone of zones){
        var zoneName : string = zone.mainTrarNm //특정 지역의 상권 명
        var zoneNum : string = zone.trarNo //특정 지역의 상권 번호

        var params2 : getStoreByZoneandIndustryParams = {
            key : zoneNum,
            indsLclsCd : params.industryCode,
            indsMclsCd : "" ,
            indsSclsCd : "" ,
            numOfRows : "20",
            pageNo : "1"
        }

        //console.log(`상권명은 ${zoneName} 이며, 상권번호는 ${zoneNum}`)
        console.log(`${zones.length} 중 ${cnt}개 완료...`)


        const industrys = await this.getStoreByZoneandIndustry(params2)
        //const industrys = await this.getStoreByZoneandIndustry(String(zoneNum),industryCode)

        //console.log(`${zoneName} 있는 ${industryCode}업종 업소 리스트 입니다.`)

        let storeNames : string[]= [];

        if(industrys){
            for(const industry of industrys){
                storeNames.push(industry.bizesNm)
                //console.log(industry.bizesNm)
            }
        }
        // for(const industry of industrys){
        //     var marketName = industry.bizesNm
        //     console.log(`${marketName}`)
        // }
        result.push({"상권명" : zoneName, "점포 개수" : storeNames.length,"점포 리스트" : storeNames})
        //console.log(result)
    }
    //console.dir(zones,{depth : null})


    //console.log(result)
    return result
    }
    
}


async function main(){

    const tmp : BbsArticleService = new BbsArticleService();
    const tmp1 : getStoreZonesParams  = {
        divId : 'ctprvnCd',
        key : '11'
    }
    console.log(await tmp.getStoreZones(tmp1))
    
}

main()