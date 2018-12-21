# I18N Solution Guideline
Goals for this library

- Facilitate the approach on how to provide multi-language support as well as message displaying solutions

Contents
- Part 1: I18N translation solutions
- Part 2: Integration steps
- Part 3: Error Message Solution (API/UI)
- Part 4: Working Approaches

##Part One: Translation Solutions##

In order to simplify the whole job, we can do followings:
- We will use only one template for all languages instead of providing template for each language, this will help avoid duplicate templates when we need to modify it
- We will provide dictionary file for each language, this will greatly reduce the file size, as most likely user won't change language, so there is NO need to load it over network at all
- We can use msg as the msgId directly. This will avoid a lot hassel in creating msgId, and also, will make the UI much easier to develop than using msgId and then jump into dictionary to create the corresponding msg content. Remember, this is extendable, if you want to change contents and using dictionary, you can easily create a dictionary with default locale, and it will overwrite the default content in the page



**Step 1: Adding following js files into code base**
```sh
<script src="/js/libs/component/react-with-addons.min.js"></script>
<script src="/js/libs/component/react-dom.min.js"></script>
<script src="/js/libs/component/jnpr-components.min.js"></script>
<link rel="stylesheet" href="/js/libs/component/jquery-ui.min.css">

var i18n = JnprCL.I18NFactory.get();
var _t_ = i18n.trans.bind(i18n);
var _l_ = i18n.getLocale.bind(i18n);

```

I18N library is included inside NGCL component and exposed as I18NFactory, you need to use get() to get the singleton. All the dictionary data and locale are saved in this singleton object.

You are assigning trans() method to a helper function (such as _t_), and this helper function should be used in all place of your Application.

You are assigning getLocale() method to a helper function (such as _l_), and this helper function should be used in all place of your Application.

**Step 2: Display the message in all templates**

Once you have above helper function available, you can start using it as below format:

```
    <div><%=  _t_('Hello from MyJuniper','home') %></div>
```

Here the format for the translation function is:

_t_('msgId (or message)', 'pageId', 'list of parameters')

- parameter1 (Mandatory): This is the message or messageId you want to translate, for simplicity, you can use message directly here;
- pageId (Optional): this is used to specify from which page, the msgId is applied. If this message is generic, then you can ignore the pageId and it will be applied for all the pages;
- List of parameters (Optional): In many cases, your message will contain number or other dynamic data inside, in order to translate these

example for the translations:

```
_t_('Hello %1, %2', 'pageId', 'Frank', 'He') ===> Einloggen123 Frank, He
_t_('Hi %1 %2', '', 'Frank', 'He') ===> Bonjour Frank He
```

With these format, you can easily translate any messages with dynamic injected contents.

**Step 3: Creating Dictionary**

Dictionary data is in below format:

de-DE.json

```
{
    "pageId":{
        "key":"Germany Key Trans",
        "Hello %1, %2": "Einloggen %1, %2"
    },
    "home":{
        "Login": "Einloggen",
        "Hello": "Hallo",
        "Hi": "Hi"
    },
    "":{
        'msg1': 'msg1_de',
        'msg2': 'msg2_de',
        "Hello123 %1, %2": "Einloggen123 %1, %2"
    }
}
```

Inside this translation file,
- objectKey is the pageId: each page should have a unique pageId, if you are using global translation, then put the translation into the the last block, which contains empty string as Key
- msgId here can be the message directly, this will greatly facilitate the usage
- for each locale, provide a separate json file

##Part Two: Integration Steps##

Default locale is english: en-US

1. When you are using _t_('terms'), it will just work as is.

2. When user changed language, please call below method to set dictionary data:
```
var fileName =  'zh-CN.json';
$.get('./'+fileName, data=>{
    i18n.setDictFor( 'zh-CN', data );
});
```
Here, setDictFor(locale, dictionaryData)
Locale must follow standards as below: <language>-<countryCode>
such as zh-CN / ko-KR / ja-JP / fr-FR / en-GB / en-US

3. Once you call setDictFor, the locale is being saved in user's browser cookie

4. You can always get locale using below method:

```
var locale = i18n.locale;
or
locale = i18n.getLocale()
```

You should always obtain locale using above method, this method will handle cookie storage as well as browser locale detection.

5. Application specific change

- When the application is loaded, please use above method to get locale, once locale is obtained, you should change URL immediately by making url specific to certain locale;
- Once user visit the URL specific to certain locale, you need to obtain locale from URL, obtain dictionary data and then call setDictFor() method to set both locale and data;

##Part Three: Error Message Translation##

All the errors, no matter if it is from API or UI, need to be provided in dictionary as well. The format for dictionary is as follows:

```
{
	"pageId":{
		"key":"Germany Key Trans",
		"Hello %1, %2": "Einloggen %1, %2"
	},
	"home":{
		"Login": "Einloggen",
		"Hello": "Hallo",
		"Hi": "Hi"
	},
	"":{
		"msg1": "msg1_de",
		"msg2": "msg2_de",
		"Hello123 %1, %2": "Einloggen123 %1, %2"
	},
	"errors":{
		"300": "300 error - de",
		"301": "301 error - de",
		"401": "401 error - de",
		"501": "501 error - de",
	}
}

```

Once you put your erorr msg in the dictionary, you just need to do like below:

```
i18n.transError(300)
```

You can do similar to regular translation,

```
var i18n = JnprCL.I18NFactory.get();
var _e_ = i18n.trans.bind(i18n);
var errorMsg = _e_(300);
```

##Part Four: Working approaches##

Here, it is suggesed that you create some global helper function, such as __t__, __l__ as well as __e__, then you can easily use these global helper functions anywhere in yoru application.

For any newly created template, you must use:
1. Helper functions to show contents;
2. If you are only displaying English, there is no need to provide English dictionary, of course, you can provide English Dictionary used to overwrite the current msgs;
3. It is suggested to use msg as msgId, so as to save a lot of efforts, such as making msgIds

##Part Five: Default translation support##

If you are using code, such as '001', 'jnpr_001' as msgId instead of the term to be translated as msgId, you will meet the situation that these code is being displayed in the screen. This is because you are not providing the required dictionary yet. In order to have automatic fall back to default dictionary, you need to do below:

```
i18n.setDefaultLocaleFor('en-US', dicContent)
```
Once you did this, this i18n library will automatically return default locale translation when dictionary is missing.
