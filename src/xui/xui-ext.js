/**
 * xui-ext: this is an extension file for xui
 * This implementation is mainly based in Ext-Core  
 * @author Maximiliano Fierro
 */
xui.extend({
    /**
     * @method: namespace
     * This method allow us to create namespaces to be used for scoping variables and classes avoiding globals.
     * @param {String} ns the namespace to be created.
     * @return {Object} The namespace object.
     */	
    namespace: function(ns){
        var d, o, n;
        n = ns.split('.');
        o = window[n[0]] = window[n[0]] || {};
        var l = n.length;
        for(var i=1; i<l; i++){
            o = o[n[i]] = o[n[i]] || {};
        }
        return o;
    },

    /**
     * @method extend
     * @param  
     */
    extendFrom: function(sb, sp, overrides){
        if(typeof sp == 'object'){
            overrides = sp;
            sp = sb;
            sb = overrides.constructor;
        }
        var F = function(){},
        sbp,
        spp = sp.prototype;

        F.prototype = spp;
        sbp = sb.prototype = new F();
        sbp.constructor=sb;
        sb.superclass=spp;
        if(spp.constructor == Object.prototype.constructor){
            spp.constructor=sp;
        }
        sbp.superclass = sbp.supr = (function(){
            return spp;
        });
        this.override(sb.prototype, overrides);
        return sb;
    },

    /**
     * @method override
     * @param {Object} o
     * @param {Object} c
     * @param {Object} defaults
     */
    override: function(o, c, defaults){
        if(defaults){
            this.override(o, defaults);
        }
        if(o && c && typeof c == 'object'){
            for(var p in c){
                o[p] = c[p];
            }
        }
        return o;
    }
});

//Extending the String object
String.prototype.format = function(){
    var args = arguments;
    obj = (args.length == 1 && (typeof args[0] == 'object')) ? args[0] : args; 
    return this.replace(/\{(\w+)\}/g, function(m, i){
        return obj[i];
    });
}
String.prototype.wrap = function(prefix, suffix) {
    return (typeof this != 'undefined' && this.length > 0?(typeof prefix != 'undefined'?prefix:'') + this + (typeof suffix != 'undefined'?suffix:''):'');
}
if (typeof Array.prototype.indexOf == 'undefined') {
    // Thank you jsfromhell.com
    Array.prototype.indexOf = function(v) {
       for(var i = this.length; i-- && this[i] != v;);
       return i;
    }
}