//for running leaflet map tests
const createElementNSOrig = global.document.createElementNS;
global.document.createElementNS = function(namespaceURI, qualifiedName) {
    if (namespaceURI==='http://www.w3.org/2000/svg' && qualifiedName==='svg'){
        const element = createElementNSOrig.apply(this,arguments);
        element.createSVGRect = function(){};
        return element;
    }
    return createElementNSOrig.apply(this,arguments)
}
//for clicking on leaflet map
const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });