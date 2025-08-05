
export interface getStoreZonesParams {
    divId : string
    key : string
};

export interface getStoreByZoneandIndustryParams {
    key : string
    indsLclsCd : string
    indsMclsCd : string 
    indsSclsCd : string 
    numOfRows : string
    pageNo : string
};

export interface CollectZoneStoreDataParams {
  getStoreZonesParams: getStoreZonesParams;
  industryCode: string;
};

/*
export interface MarketZone {
  상권_구분_코드: string;
  상권_구분_코드_명: string;
  상권_코드: number;
  상권_코드_명: string;
  엑스좌표_값 : number;
  와이좌표_값 : number;
  자치구_코드 : number;
  자치구_코드_명 : string;
  행정동_코드 : number;
  행정동_코드_명 : string;
  영역_면적 : number;
  // 필요한 필드 더 추가
}*/