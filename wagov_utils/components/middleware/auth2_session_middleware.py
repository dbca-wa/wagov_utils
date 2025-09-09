from django import http, VERSION
from django.conf import settings
from django.contrib.auth import login, logout, get_user_model
from django.db.models import signals
from django.utils.deprecation import MiddlewareMixin
import urllib.request, json
import urllib.parse
from django.contrib import messages
from django.conf import settings
# from confy import env
from django.http import Http404, HttpResponse, JsonResponse, HttpResponseRedirect
import datetime
# Only required if using webtemplate2 and NOT using ledger_api_client.

class SSOLoginSessionMiddleware(MiddlewareMixin):

    def process_request(self, request):
       
        if request.path.startswith('/static') or request.path.startswith('/favicon') or request.path.startswith('/media'):
             pass
        else:
             pass
             User = get_user_model()
             ENABLE_DJANGO_LOGIN=settings.ENABLE_DJANGO_LOGIN
             
             SESSION_EXPIRY_SSO = 3600
             if settings.SESSION_EXPIRY_SSO:
                 SESSION_EXPIRY_SSO = settings.SESSION_EXPIRY_SSO
             if (request.path.startswith('/logout') or request.path.startswith('/ledger/logout')) \
                         and 'HTTP_X_LOGOUT_URL' in request.META and request.META['HTTP_X_LOGOUT_URL']:
                 print ("LOGGING OUT")
                 if 'is_authenticated' in request.session:
                      del request.session['is_authenticated']
                 if 'user_obj' in request.session:
                      del request.session['user_obj']
                 logout(request)
                 return http.HttpResponseRedirect(request.META['HTTP_X_LOGOUT_URL'])

             if VERSION < (2, 0):
                 user_auth = request.user.is_authenticated()
             else:
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
                              user_obj = {'user_id': request.user.id, 'email': request.user.email, 'first_name': request.user.first_name, 'last_name': request.user.last_name, 'is_staff': request.user.is_staff}
                              request.session['user_obj'] = user_obj
                     user_auth = is_authenticated
   
                     if user_auth is True:
                          pass
                          if ENABLE_DJANGO_LOGIN is True:
                              if 'HTTP_REMOTE_USER' in request.META:
                                   if len(request.META['HTTP_REMOTE_USER']) > 3:
                                         response = HttpResponse("<center><h1 style='font-family: Arial, Helvetica, sans-serif;'>Error: SSO detected as enabled.  ENABLE_DJANGO_LOGIN should be set to False when sso is enabled.</h1><br></center><script></script>")
                                         return response 
                          else:
                              pass
                              #if request.user.email.lower() != request.META['HTTP_REMOTE_USER'].lower():
                              if user_obj['email'].lower() != request.META['HTTP_REMOTE_USER'].lower():
                                  response = HttpResponse("<center><h1 style='font-family: Arial, Helvetica, sans-serif;'>Wait one moment please...</h1><br><img src='/static/ledger_api/images/ajax-loader-spinner.gif'></center><script> location.reload();</script>")
                                  response.delete_cookie('sessionid')
                                  return response
                 except:
                     print ("user_auth request user does not exist")
                     response = HttpResponse("<center><h1 style='font-family: Arial, Helvetica, sans-serif;'>Wait one moment please...</h1><br><img src='/static/ledger_api/images/ajax-loader-spinner.gif'></center><script> location.reload();</script>")
                     response.delete_cookie('sessionid')
                     return response
            
             if user_auth:                        
                 user.backend = 'django.contrib.auth.backends.ModelBackend'
                 del request.session['is_authenticated']
                 try:
                    is_authenticated = request.user.is_authenticated
                    request.session['is_authenticated'] = is_authenticated
                    user_obj = {'user_id': request.user.id, 'email': request.user.email, 'first_name': request.user.first_name, 'last_name': request.user.last_name, 'is_staff': request.user.is_staff}
                    request.session['user_obj'] = user_obj
                 except Exception as e:
                     print ("ERROR in sso middleware logging in")
                     print (e)
                        
