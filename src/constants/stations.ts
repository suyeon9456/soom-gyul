export interface Station {
  name: string;
  addr: string;
  lat: number;
  lng: number;
}

/** 에어코리아 주요 측정소 좌표 (서울/경기/광역시) */
export const STATIONS: Station[] = [
  // 서울
  { name: "종로구", addr: "서울 종로구", lat: 37.572, lng: 126.9794 },
  { name: "중구", addr: "서울 중구", lat: 37.5641, lng: 126.9979 },
  { name: "용산구", addr: "서울 용산구", lat: 37.5322, lng: 126.9814 },
  { name: "성동구", addr: "서울 성동구", lat: 37.5631, lng: 127.0369 },
  { name: "광진구", addr: "서울 광진구", lat: 37.5384, lng: 127.0822 },
  { name: "동대문구", addr: "서울 동대문구", lat: 37.5744, lng: 127.0396 },
  { name: "중랑구", addr: "서울 중랑구", lat: 37.5997, lng: 127.0926 },
  { name: "성북구", addr: "서울 성북구", lat: 37.6066, lng: 127.0204 },
  { name: "강북구", addr: "서울 강북구", lat: 37.6397, lng: 127.0256 },
  { name: "도봉구", addr: "서울 도봉구", lat: 37.6688, lng: 127.047 },
  { name: "노원구", addr: "서울 노원구", lat: 37.6558, lng: 127.078 },
  { name: "은평구", addr: "서울 은평구", lat: 37.6176, lng: 126.9388 },
  { name: "서대문구", addr: "서울 서대문구", lat: 37.5792, lng: 126.9368 },
  { name: "마포구", addr: "서울 마포구", lat: 37.558, lng: 126.9016 },
  { name: "양천구", addr: "서울 양천구", lat: 37.517, lng: 126.8664 },
  { name: "강서구", addr: "서울 강서구", lat: 37.5509, lng: 126.8496 },
  { name: "구로구", addr: "서울 구로구", lat: 37.4954, lng: 126.8874 },
  { name: "금천구", addr: "서울 금천구", lat: 37.457, lng: 126.8954 },
  { name: "영등포구", addr: "서울 영등포구", lat: 37.5264, lng: 126.8963 },
  { name: "동작구", addr: "서울 동작구", lat: 37.5124, lng: 126.9393 },
  { name: "관악구", addr: "서울 관악구", lat: 37.4784, lng: 126.9516 },
  { name: "서초구", addr: "서울 서초구", lat: 37.4837, lng: 127.0324 },
  { name: "강남구", addr: "서울 강남구", lat: 37.5172, lng: 127.0473 },
  { name: "송파구", addr: "서울 송파구", lat: 37.5145, lng: 127.105 },
  { name: "강동구", addr: "서울 강동구", lat: 37.5492, lng: 127.1468 },
  // 경기
  { name: "수원", addr: "경기 수원시", lat: 37.2636, lng: 127.0286 },
  { name: "성남", addr: "경기 성남시", lat: 37.4201, lng: 127.1268 },
  { name: "안양", addr: "경기 안양시", lat: 37.3943, lng: 126.9568 },
  { name: "부천", addr: "경기 부천시", lat: 37.5034, lng: 126.766 },
  { name: "고양", addr: "경기 고양시", lat: 37.6584, lng: 126.832 },
  { name: "용인", addr: "경기 용인시", lat: 37.2411, lng: 127.1776 },
  { name: "인천", addr: "인천시", lat: 37.4563, lng: 126.7052 },
  // 광역시
  { name: "부산", addr: "부산시", lat: 35.1796, lng: 129.0756 },
  { name: "대구", addr: "대구시", lat: 35.8714, lng: 128.6014 },
  { name: "대전", addr: "대전시", lat: 36.3504, lng: 127.3845 },
  { name: "광주", addr: "광주시", lat: 35.1595, lng: 126.8526 },
  { name: "울산", addr: "울산시", lat: 35.5384, lng: 129.3114 },
];
