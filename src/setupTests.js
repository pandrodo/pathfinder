// require('jest-localstorage-mock');

//needs for running leaflet map tests
var createElementNSOrig = global.document.createElementNS
global.document.createElementNS = function(namespaceURI, qualifiedName) {
    if (namespaceURI==='http://www.w3.org/2000/svg' && qualifiedName==='svg'){
        var element = createElementNSOrig.apply(this,arguments)
        element.createSVGRect = function(){};
        return element;
    }
    return createElementNSOrig.apply(this,arguments)
}
//needs for clicking on leaflet map
const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });