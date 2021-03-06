var PARAMS_REGEX = /[^&?]*=[^&?]*/g;


function URL(link) {
    this.url = link || location.href;
    this.search = location.search ||'';
    this.hash=location.hash|'';
    this.origin=location.protocol|'';
    this.host= location.host|'';
    location.origin? this.origin=location.origin:this.origin = location.protocol + "//" + location.host;
    return this;
}

URL.prototype.createParams = function(data) {
    if (Object.keys(this.readParams()).length > 0) return {};
    return this.url + '?' + obj2arr(data).join('&');
}

URL.prototype.readParams = function(opt) {
    opt = opt || {
        type: 'Object'
    };
    var paramsArray = this.url.match(PARAMS_REGEX);
    if (!paramsArray) return {};
    if (opt.type == 'Array') return paramsArray;
    return arr2obj(paramsArray);
}

URL.prototype.updateParams = function(opt) {
    opt = extend(opt, {
        override: true,
        data: {}
    });
    var paramsObject = this.readParams();
    paramsObject = extend(paramsObject, opt.data, opt.override);
    return this.url.split('?')[0] + '?' + obj2arr(paramsObject).join('&');
}
URL.prototype.deleteParams = function(data) {
    data=data||{};
    var paramsObject  = this.readParams();   
    Object.keys(paramsObject).forEach(function(v,idx){
    	if(data.hasOwnProperty(v))delete paramsObject[v];
    });
    return Object.keys(paramsObject).length==0?this.url.split('?')[0]:this.url.split('?')[0] + '?' + obj2arr(paramsObject).join('&');
}

URL.prototype.hash=function(data){
    if(data) return location.href=data;
    return this.hash?this.hash.split('#')[1]:'';
}

function obj2arr(obj) {
    var _arr = [];
    Object.keys(obj).forEach(function(v, idx) {
        _arr.push(v + '=' + obj[v].toString());
    })
    return _arr;
}

function arr2obj(arr) {
    var _obj = {};
    arr.forEach(function(v, idx) {
        _obj[v.split('=')[0]] = v.split('=')[1];
    });
    return _obj;
}

function extend(dist, origin, override) {
    origin = origin || {};
    override = override || false;
    Object.keys(origin).forEach(function(v, idx) {
        if ((dist.hasOwnProperty(v) && override == true) || !dist.hasOwnProperty(v)) {
            dist[v] = origin[v];
        }
    })
    return dist
}

module.exports=URL;
