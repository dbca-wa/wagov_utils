from django import http, VERSION
from django.conf import settings
from django.contrib.auth import login, logout
from django.db.models import signals
from django.utils.deprecation import MiddlewareMixin
import urllib.request, json
import urllib.parse
from django.contrib import messages
# from confy import env
from django.http import Http404, HttpResponse, JsonResponse, HttpResponseRedirect
import datetime
import re
from django.utils.module_loading import import_string
from wagov_utils.components.json_auth.no_signal_login import login_without_signal
from wagov_utils.components.json_auth.auth_middleware_backend import _JSONAuthStore

class SSOLoginMiddleware(MiddlewareMixin):


    def __init__(self, get_response):
        pass
        super().__init__(get_response)
   
        cfg = getattr(settings, "JSON_SSO", {}) or {}

        self.backend_path = cfg.get(
            "BACKEND_PATH",
            "wagov_utils.components.json_auth.auth_middleware_backend.JSONFileOnlyBackend",
        )
        self.backend_cls = import_string(self.backend_path)


    def process_request(self, request):
        request.META['HTTP_X_FIRST_NAME'] = "Jason"
        request.META['HTTP_X_LAST_NAME'] = "Moore"
        request.META['HTTP_REMOTE_USER'] = "jason.moore@dbca.wa.gov.au"
        request.META['HTTP_X_EMAIL'] ="jason.moore@dbca.wa.gov.au"
        if request.path.startswith('/static') or request.path.startswith('/favicon') or request.path.startswith('/media'):
             pass
        else:
            pass
            SESSION_EXPIRY_SSO = 3600
            if settings.SESSION_EXPIRY_SSO:
                SESSION_EXPIRY_SSO = settings.SESSION_EXPIRY_SSO
                if (request.path.startswith('/logout')) and 'HTTP_X_LOGOUT_URL' in request.META and request.META['HTTP_X_LOGOUT_URL']:    
                    pass
                    print ("LOGGING OUT")
                    if 'is_authenticated' in request.session:
                        del request.session['is_authenticated']    
                    if 'user_obj' in request.session:
                        del request.session['user_obj']
                    logout(request)
                    return http.HttpResponseRedirect(request.META['HTTP_X_LOGOUT_URL'])      


            try:
                user_obj = {'email': None, 'first_name': None, "last_name": None, "user_id" : None, 'is_staff': False}
                is_authenticated = None
                if 'is_authenticated' in request.session and 'user_obj' in request.session:
                    #request.session['is_authenticated'] = request.user.is_authenticated
                    is_authenticated = request.session['is_authenticated']
                    user_obj = request.session['user_obj']
                
                if is_authenticated is None:
                    is_authenticated = request.user.is_authenticated
                    request.session['is_authenticated'] = is_authenticated
                    if is_authenticated is True:
                        user_obj = {'email': request.user.email, 'first_name': request.user.first_name, 'last_name': request.user.last_name, 'is_staff': request.user.is_staff}
                        request.session['user_obj'] = user_obj
                user_auth = is_authenticated
                #user_auth = user_obj.is_authenticated
                if user_auth is True:            
                    if 'HTTP_REMOTE_USER' in request.META: 
                        if user_obj is not None:
                            a = _JSONAuthStore()
                            u = a.get_user_record(user_obj['email'].lower())
                            if u['email'] != request.META['HTTP_REMOTE_USER'].lower():
                                response = HttpResponse("<center><h1 style='font-family: Arial, Helvetica, sans-serif;'>Wait one moment please...</h1><br><img src='/static/ledger_api/images/ajax-loader-spinner.gif'></center><script> location.reload();</script>")
                                response.delete_cookie('sessionid')
                                return response
            except Exception as e:
                print ("user_auth request user does not exist")
                print (e)
                response = HttpResponse("<center><h1 style='font-family: Arial, Helvetica, sans-serif;'>Wait one moment please...</h1><br><img src='/static/ledger_api/images/ajax-loader-spinner.gif'></center><script> location.reload();</script>")
                response.delete_cookie('sessionid')
                return response                
            # a = _JSONAuthStore("./secrets/users.json")
            # user = a.get_user_record(user_obj['email'].lower())

            if user_auth:                        
                if request.META:
                    if 'HTTP_REMOTE_USER' in request.META:
                        if 'HTTP_X_FIRST_NAME' in request.META:
                            if user_obj['first_name'] !=  request.META['HTTP_X_FIRST_NAME']:
                                user_auth = False
                        if 'HTTP_X_LAST_NAME' in request.META:
                            if user_obj['last_name'] != request.META['HTTP_X_LAST_NAME']:
                                user_auth = False

            if not user_auth and 'HTTP_REMOTE_USER' in request.META and request.META['HTTP_REMOTE_USER']:
                attributemap = {
                    'username': 'HTTP_REMOTE_USER',
                    'last_name': 'HTTP_X_LAST_NAME',
                    'first_name': 'HTTP_X_FIRST_NAME',
                    'email': 'HTTP_X_EMAIL',
                }

                for key, value in attributemap.items():
                    if value in request.META:
                        attributemap[key] = self.remove_html_tags(request.META[value])
                
                a = _JSONAuthStore()           
                user = a.create_update_user(attributemap['email'],None,True,attributemap['first_name'],attributemap['last_name'],None,None,None,None)
        
                backend = self.backend_cls()
                user_backend = backend.get_user(user['email'])                           
                login_without_signal(request, user_backend, backend_path=self.backend_path)
        return None
    
    def remove_html_tags(self,text):
        
        if text is None:
            return None

        HTML_TAGS_WRAPPED = re.compile(r'<[^>]+>.+</[^>]+>')
        HTML_TAGS_NO_WRAPPED = re.compile(r'<[^>]+>')

        text = HTML_TAGS_WRAPPED.sub('', text)
        text = HTML_TAGS_NO_WRAPPED.sub('', text)
        return text    