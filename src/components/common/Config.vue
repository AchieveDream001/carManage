<script>
    // 这里写具体的服务地址
    /*let host = 'http://68.78.36.49:3000/';
    let wsHost = 'ws://68.78.36.49:3000/';
    const MAP_TILE = "http://68.78.39.195:99/wmts/services/qq/default/tile?set=map&x={x}&y={y}&z={z}";
    // 地址查询服务
    const KEY = '4934952660824fae84c58f9e8b83d580';
    const SERVICE_PATH = 'http://68.78.39.195/route-service/v1/route';
    const SERVICE_POSITION = 'http://68.78.39.195/address-services/v1/query';
    const SERVICE_UNPOSITION = 'http://68.78.39.195/address-services/v1/reversed-geocoder';*/
    let host = 'http://localhost:3000/';
    let wsHost = 'ws://localhost:3000/';
    const MAP_TILE = "http://t0.tianditu.com/vec_w/wmts?tk=e90d56e5a09d1767899ad45846b0cefd&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=tiles";
    // 地址查询服务
    const KEY = null;
    const SERVICE_PATH = null;
    const SERVICE_POSITION = null;
    const SERVICE_UNPOSITION = null;



    const GET_HISTORY_GPS = host + 'getHistoryGPS';
    const GET_CAR_RETURN = host + 'getCarReturn';
    const WS_GET_GPS_DATA = wsHost + 'getGpsData';
    const WS_GET_CAR_INFO = wsHost + 'getCarInfo';
    const SAVE_WARNING = host + 'saveWarningData';
    const GET_WARNING = host + 'getWarningData';
    const GET_ORGANIZATION = host + 'getOrganization';

    const GET_APPLY_INFO = host + 'getApplyInfo';
    const GET_CAR_INFO = host + 'getDetailInfo';

    const GET_ALL_CAR = host + 'getAllCar';
    const GET_ALL_CAR_TYPE = host + 'getAllCarType';
    const GET_CAR_PATH = host + 'getCarPath'
    const GET_ALL_CAR_STATE = host + 'getAllCarState';

    //const MAP_TILE = "https://ahocevar.com/geoserver/wms"

    const HIGHLIGHT_ZOOM = 16;
    const TRACK_ZOOM = 16;
    const WATCH_ZOOM = 16;
    export default {
        GET_HISTORY_GPS, GET_CAR_RETURN, WS_GET_CAR_INFO, WS_GET_GPS_DATA,
        MAP_TILE,
        HIGHLIGHT_ZOOM, TRACK_ZOOM, WATCH_ZOOM, SAVE_WARNING, GET_WARNING, GET_ORGANIZATION,
        KEY, SERVICE_PATH, SERVICE_POSITION, SERVICE_UNPOSITION,
        GET_APPLY_INFO, GET_CAR_INFO, GET_ALL_CAR, GET_CAR_PATH, GET_ALL_CAR_TYPE,
        GET_ALL_CAR_STATE
    };
</script>