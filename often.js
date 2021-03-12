
//检测是否为PC端浏览器模式
function isPCBroswer() {
    let e = navigator.userAgent.toLowerCase()
        , t = "ipad" == e.match(/ipad/i)
        , i = "iphone" == e.match(/iphone/i)
        , r = "midp" == e.match(/midp/i)
        , n = "rv:1.2.3.4" == e.match(/rv:1.2.3.4/i)
        , a = "ucweb" == e.match(/ucweb/i)
        , o = "android" == e.match(/android/i)
        , s = "windows ce" == e.match(/windows ce/i)
        , l = "windows mobile" == e.match(/windows mobile/i);
    return !(t || i || r || n || a || o || s || l)
}

//isStatic: 检测数据是不是除了symbol外的原始数据
function isStatic(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'undefined' ||
        value === null
    )
}

//isPrimitive：检测数据是不是原始数据
function isPrimitive(value) {
    return isStatic(value) || typeof value === 'symbol'
}

//isObject:判断数据是不是引用类型的数据（例如：array,function,object,regexe,new Number(),new String())
function isObject(value) {
    let type = typeof value;
    return value != null && (type == 'object' || type == 'function');
}

//isObjectLike:检查value是否是类对象。如果一个值是类对象，那么它不应该是null，而且typeof后的结果是“object”。
function isObjectLike(value) {
    return value != null && typeof value == 'object';
}

//getRawType：获取数据类型，返回结果为Number、String、Object、Array等
function getRawType(value) {
    return Object.prototype.toString.call(value).slice(8, -1)
}

//isPlainObject：判断数据是不是Object类型的数据
function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

//isArray：判断数据是不是数组类型的数据（Array.isArray的兼容写法）
function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
}

//isRegExp：判断数据是不是正则对象
function isRegExp(value) {
    return Object.prototype.toString.call(value) === '[object RegExp]'
}

//isDate：判断数据是不是时间对象
function isDate(value) {
    return Object.prototype.toString.call(value) === '[object Date]'
}

/*
isNative：判断value是不是浏览器内置函数
内置函数toString后的主体代码块为[native code] ，而非内置函数则为相关代码，所以非内置函数可以进行拷贝（toString后掐头去尾再由Function转）
*/
function isNative(value) {
    return typeof value === 'function' && /native code/.test(value.toString())
}

//isFunction：检查value是不是函数
function isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]'
}

//isLength：检查value是否为有效的类数组长度
function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= Number.MAX_SAFE_INTEGER;
}

/*
isArrayLike：检查value是否是类数组
如果一个值被认为是类数组，那么它不是一个函数，并且value.length是个整数，大于等于0，小于或等于Number.MAX_SAFE_INTEGER。这里字符串也被当作类数组。
*/
function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}

/*
isEmpty：检查value是否为空
如果是null，直接返回true；如果是类数组，判断数据长度；如果是Object对象，判断是否具有属性；如果是其他数据，直接返回false（也可以改为返回true）
*/
function isEmpty(value) {
    if (value == null) {
        return true;
    }
    if (isArrayLike(value)) {
        return !value.length;
    } else if (isPlainObject(value)) {
        for (let key in value) {
            if (hasOwnProperty.call(value, key)) {
                return false;
            }
        }
    }
    return false;
}

//cached：记忆函数：缓存函数的运算结果
function cached(fn) {
    let cache = Object.create(null);
    return function cachedFn(str) {
        let hit = cache[str];
        return hit || (cache[str] = fn(str))
    }
}

//camelize：横线转驼峰命名
let camelizeRE = /-(\w)/g;
function camelize(str) {
    return str.replace(camelizeRE, function(_, c) {
        return c ? c.toUpperCase() : '';
    })
}
//ab-cd-ef ==> abCdEf
//使用记忆函数
let _camelize = cached(camelize)

//hyphenate：驼峰命名转横线命名：拆分字符串，使用-相连，并且转换为小写
let hyphenateRE = /\B([A-Z])/g;
function hyphenate(str){
    return str.replace(hyphenateRE, '-$1').toLowerCase()
}
//abCd ==> ab-cd
//使用记忆函数
let _hyphenate = cached(hyphenate);

//capitalize：字符串首位大写
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}
// abc ==> Abc
//使用记忆函数
let _capitalize = cached(capitalize)

//extend：将属性混合到目标对象中
function extend(to, _form) {
    for(let key in _form) {
        to[key] = _form[key];
    }
    return to
}

//Object.assign:对象属性复制，浅拷贝
Object.assign = Object.assign || function() {
    if (arguments.length == 0) throw new TypeError('Cannot convert undefined or null to object');
    let target = arguments[0],
        args = Array.prototype.slice.call(arguments, 1),
        key;
    args.forEach(function(item) {
        for (key in item) {
            item.hasOwnProperty(key) && (target[key] = item[key])
        }
    })
    return target
}

/*
clone：克隆数据，可深度克隆
这里列出了原始类型，时间、正则、错误、数组、对象的克隆规则，其他的可自行补充

*/
function clone(value, deep) {
    if (isPrimitive(value)) {
        return value
    }
    if (isArrayLike(value)) {  //是类数组
        value = Array.prototype.slice.call(vall)
        return value.map(item => deep ? clone(item, deep) : item)
    } else if (isPlainObject(value)) {  //是对象
        let target = {}, key;
        for (key in value) {
            value.hasOwnProperty(key) && ( target[key] = deep ? clone(value[key], value[key] ))
        }
    }
    let type = getRawType(value);
    switch(type) {
        case 'Date':
        case 'RegExp':
        case 'Error': value = new window[type](value); break;
    }
    return value
}

//识别各种浏览器及平台
//运行环境是浏览器
let inBrowser = typeof window !== 'undefined';
//运行环境是微信
let inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
let weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
//浏览器 UA 判断
let UA = inBrowser && window.navigator.userAgent.toLowerCase();
let isIE = UA && /msie|trident/.test(UA);
let isIE9 = UA && UA.indexOf('msie 9.0') > 0;
let isEdge = UA && UA.indexOf('edge/') > 0;
let isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
let isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
let isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

//getExplorerInfo：获取浏览器信息
function getExplorerInfo() {
    let t = navigator.userAgent.toLowerCase();
    return 0 <= t.indexOf("msie") ? { //ie < 11
        type: "IE",
        version: Number(t.match(/msie ([\d]+)/)[1])
    } : !!t.match(/trident\/.+?rv:(([\d.]+))/) ? { // ie 11
        type: "IE",
        version: 11
    } : 0 <= t.indexOf("edge") ? {
        type: "Edge",
        version: Number(t.match(/edge\/([\d]+)/)[1])
    } : 0 <= t.indexOf("firefox") ? {
        type: "Firefox",
        version: Number(t.match(/firefox\/([\d]+)/)[1])
    } : 0 <= t.indexOf("chrome") ? {
        type: "Chrome",
        version: Number(t.match(/chrome\/([\d]+)/)[1])
    } : 0 <= t.indexOf("opera") ? {
        type: "Opera",
        version: Number(t.match(/opera.([\d]+)/)[1])
    } : 0 <= t.indexOf("Safari") ? {
        type: "Safari",
        version: Number(t.match(/version\/([\d]+)/)[1])
    } : {
        type: t,
        version: -1
    }
}
