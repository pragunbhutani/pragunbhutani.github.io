(function register() {

    // Cookie helpers
    var setCookie = function(cname, cvalue, exdays, domain) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = 'expires=' + d.toUTCString();
        if (exdays === 0) {
            expires = '';
        }
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/' + ';domain=' + domain;
    }

    var getCookie = function(cname) {
        var name = cname + '=';
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    // Retrieve a named value from query string
    var getParameterByName = function(key) {
        key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
        var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
        return match && decodeURIComponent(match[1].replace(/\+/g, " "));
    }

    // Get domain name
    var cookieDomain = function getDomain() {
        var regex = /[\w-]+.(com|net|org|co.uk|co|us)/ig;
        var url = location.hostname;
        return url.match(regex);
    }() || 'amplitude.com';

    // Mapping marketo fields names with utms
    var marketoFieldsMap = {
        'utm_content': 'campaignContent',
        'utm_term': 'campaignTerm',
        'utm_campaign': 'campaignID',
        'utm_source': 'campaignSource',
        'utm_medium': 'campaignMedium'
    };

    var marketoUTMProperties = {};

    // Retrieve all UTM query string params and values, store to object
    for (var property in marketoFieldsMap) {
        if (marketoFieldsMap.hasOwnProperty(property) && getParameterByName(property) && getParameterByName(property).length > 0) {
            marketoUTMProperties[marketoFieldsMap[property]] = getParameterByName(property);
        }
    }

    // Update / Create cookie from query string parameters
    if(Object.keys(marketoUTMProperties).length > 0) {
        setCookie('marketoUTMProperties', encodeURIComponent(JSON.stringify(marketoUTMProperties)), 0, cookieDomain);
    }

    var fieldsToCreate = function() {
        var cookie = getCookie('marketoUTMProperties');
        if (cookie) {
            try {
                return JSON.parse(decodeURIComponent(cookie));
            } catch (e) {
                return marketoUTMProperties;
            }
        }
        return marketoUTMProperties;
    }();

    // Create hidden fields
    var addUtmFields = function (form) {
        for (var field in fieldsToCreate) {
            if (fieldsToCreate.hasOwnProperty(field)) {
                addHiddenField(form, field, fieldsToCreate[field]);
            }
        }
    };

    var FIELDS = {
        '.contact-form.signup-form': [
            'email',
            'firstName',
            'lastName'
        ],
        '.try-demo-form': [
            'email'
        ],
        '.try-demo-company-form': [
            'company',
            'title'
        ],
        '.try-demo-phone-form': [
            'phone',
            'country'
        ],
        '.contact-form.contact-sales': [
            'firstName',
            'lastName',
            'company',
            'title',
            'email',
            'phone',
            'why'
        ]
    };

    var validateField = function validateField(name, value) {
        var re;
        if (name === 'email') {
            re = /\S+@\S+\.\S+/;
        } else if (name === 'phone') {
            re = /^[\+0-9\s\-\(\)]+$/;
        } else {
            re = /\S+/;
        }
        return re.test(value);
    };

    var addHiddenField = function addHiddenField(form, name, value) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
    };

    var showExistingAccountInfo = function () {
        var message = document.querySelector('.account-already-exists');
        var error = getParameterByName('error', window.location.href);

        if (error && message) {
            message.classList.remove('hidden');
        }
    };

    var hideExistingAccountInfo = function () {
        var message = document.querySelector('.account-already-exists');
        if (message) {
            message.classList.add('hidden');
        }
    };

    var render = function render() {

        var bindIfExists = function bindIfExists(formSelector, eventName) {
            var form = document.querySelector(formSelector);
            if (!form) {
                return;
            }

            showExistingAccountInfo();
            addUtmFields(form);

            var fields = FIELDS[formSelector];

            var onFormSubmit = function onFormSubmit(e) {
                var validForm = true;
                var eventProps = {};

                // Split fullname to firstName and lastName
                var nameNode = form.querySelector('input[name="name"]');
                var firstName = '';
                var lastName = '';

                if (nameNode) {
                    var name = nameNode.value;
                    var parent = nameNode.parentNode;
                    if (validateField('name', name)) {
                        parent.classList.remove('has-error');

                        var splitName = (name || '').split(' ');
                        firstName = splitName[0];
                        lastName = splitName.slice(1).join(' ');
                    } else {
                        parent.classList.add('has-error');
                        validForm = false;
                    }

                    eventProps['has firstName'] = !!firstName;
                    eventProps['has lastName'] = !!lastName;
                }

                hideExistingAccountInfo();

                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    var fieldNode = form.querySelector('input[name="' + field + '"]');

                    if (fieldNode) {
                        var value;
                        if (fieldNode.type === 'radio') {
                            var checkedNode = form.querySelector('input[name="' + field + '"]:checked');
                            value = checkedNode && checkedNode.value;
                        } else {
                            value = fieldNode.value;
                        }
                        var parent = fieldNode.parentNode;
                        eventProps['has ' + field] = !!value;
                        if (validateField(field, value)) {
                            parent.classList.remove('has-error');
                        } else {
                            parent.classList.add('has-error');
                            validForm = false;
                        }
                    }
                }

                if (validForm) {
                    eventProps.userFlowId = form.getAttribute('data-user-flow-id');

                    addHiddenField(form, '_mktoReferrer', window.location.href); // TODO(greg) deprecated
                    addHiddenField(form, 'cookie', getCookie('_mkto_trk'));

                    if (nameNode) {
                        addHiddenField(form, 'firstName', firstName);
                        addHiddenField(form, 'lastName', lastName);
                    }

                    if (formSelector === '.contact-form.signup-form') {
                        var signupSource = 'simple';
                        var email = form.querySelector('input[name="email"]').value;
                        if (form.getAttribute('data-signup-form-type') === 'simple') {
                            signupSource = 'normal';
                        }
                        window.amp.analytics.setUserProperties({'signup source': signupSource});
                    }

                    console.log('form AAAAAAAAAAAAAAAA', $(form).serialize());

                    window.amp.analytics.logEvent(eventName, eventProps);
                } else {
                    e.preventDefault();
                    return false;
                }
            };

            form.addEventListener('submit', onFormSubmit);
        };

        bindIfExists('.contact-form.signup-form', 'signup: submit signup form');
        bindIfExists('.try-demo-form', 'try demo: submit try demo form');
        bindIfExists('.try-demo-company-form', 'try demo: submit try demo company form');
        bindIfExists('.try-demo-phone-form', 'try demo: submit try demo phone form');
        bindIfExists('.contact-form.contact-sales', 'contact: submit contact sales form');
    };

    document.addEventListener('DOMContentLoaded', render);
})();
