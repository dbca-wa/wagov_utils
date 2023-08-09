Overview
========

Includes a view function that can be used directly from a URL spec:

```python
from proxy.views import proxy_view

urlpatterns = patterns(
	...
	url('proxy/(?P<url>.*)', proxy_view),
	...
)
```

In the views.py

```python
from django.views.decorators.csrf import csrf_exempt
from proxy.views import proxy_view

@csrf_exempt
def myview(request, path):
	extra_requests_args = {...}
	remoteurl = 'http://<host_name>/' + path
	return proxy_view(request, remoteurl, extra_requests_args)

urlpatterns = patterns(
	...
	url('proxy/(?P<path>.*)', myview),
	...
)
```

