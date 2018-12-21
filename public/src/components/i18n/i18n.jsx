
class I18N{

    constructor(){
        this._dict = {};
        this._locale = null;
        this._defaultLocale = 'en-US';
    }

    setDefaultLocaleFor(locale, dicContent){
        if(!(locale in this._dict)){
            this._dict[locale] = {}
        }
        this._dict[locale] = dicContent;
        this._defaultLocale = locale;
    }

    setDictFor(locale, dicContent ){
        if(!(locale in this._dict)){
            this._dict[locale] = {}
        }
        this._dict[locale] = dicContent;
        this.locale = locale;
    }

    getDictFor(locale){
        if(!(locale in this._dict)){
            this._dict[locale] = {}
        }
        return this._dict[locale];
    }

    //start handling locale settings
    set locale(locale){
        this._locale = locale;
        //once we set it, we need to save it to cookie, so that user can fetch it next time before settings
        this._setCookie('l',locale, 1000);
    }
    get locale(){
        if(!this._locale){
            //first check cookie
            this._locale = this._getCookie('l');
            if(this._locale ==''){
                this._locale = this._brwoserLocale;
            }
        }
        return this._locale;
    }

    getLocale(){
        return this.locale;
    }

    getLocaleLowerCase(){
        return this.locale.toLowerCase();
    }

    get _brwoserLocale(){
        var defaultLocale = navigator.language;
        if(!defaultLocale){
            defaultLocale = 'en-US';
        }
        return defaultLocale;
    }

    transError(){
        var pageId = 'errors';
        var key =  arguments[0];
        if(arguments.length>1){
            var regEx = this.getTranslatedTerm( pageId, key );
            for(var i=0; i<arguments.length-1;i++){
                regEx=regEx.replace("%"+(i+1), arguments[i+1]);
            }
            return regEx;
        }else{
            return this.getTranslatedTerm( pageId, key );
        }
    }

    trans(){
        var pageId = arguments.length==1?'':arguments[1];
        var key = arguments[0];
        if(arguments.length>2){
            var regEx = this.getTranslatedTerm( pageId, key );
            for(var i=0; i<arguments.length-2;i++){
                regEx=regEx.replace("%"+(i+1), arguments[i+2]);
            }
            return regEx;
        }else{
            return this.getTranslatedTerm( pageId, key );
        }
    }

    getTranslatedTerm(pageId, key){
        //if english, there is NO dictionary, in this case, we just return key immediately
        if(this._dict && this.locale in this._dict){
            if(this._dict[this.locale][pageId] && this._dict[this.locale][pageId][key]){
                return this._dict[this.locale][pageId][key];
            }else{
                return this.getDefaultTranslatedTerm(pageId, key);
            }
        }else{
            return this.getDefaultTranslatedTerm(pageId, key);
        }
    }

    getDefaultTranslatedTerm(pageId, key){
        if(this._dict && this._defaultLocale in this._dict){
            if(this._dict[this._defaultLocale][pageId] && this._dict[this._defaultLocale][pageId][key]){
                return this._dict[this._defaultLocale][pageId][key];
            }else{
                return key;
            }
        }else{
            return key;
        }
    }

    _setCookie(cname, cvalue, exdays){
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        if (exdays == 0) {
            document.cookie = cname + "=" + encodeURIComponent(cvalue);
        } else {
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + encodeURIComponent(cvalue) + "; "
            + expires;
        }
    }

    _getCookie(cname){
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
            c = c.substring(1);
            if (c.indexOf(name) == 0) {
                var cookie = c.substring(name.length, c.length);
                if (cookie == "null") {
                    return "";
                } else {
                    return decodeURIComponent(c.substring(name.length, c.length));
                }
            }
        }
        return "";
    }

}

let i18nFactory = {
    i18n: null,

    get: function(){
        if(this.i18n==null){
            this.i18n = new I18N();
        }
        return this.i18n;
    }
}

module.exports = i18nFactory;
