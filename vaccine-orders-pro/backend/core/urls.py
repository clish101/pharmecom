from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.schemas import get_schema_view
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from api.views import FrontendCatchallView

schema_view = get_schema_view(title="Vaccine Orders API")

# Custom view to serve Vite assets
def serve_vite_assets(request, path):
    """Serve Vite assets from staticfiles/assets/"""
    return serve(request, f'assets/{path}', document_root=settings.STATIC_ROOT)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/schema/', schema_view, name='api-schema'),
    # Serve Vite assets (assets/..., index.html, etc.)
    re_path(r'^assets/(?P<path>.*)$', serve_vite_assets, name='assets'),
    # Catchall route - must be last to serve React frontend
    path('', FrontendCatchallView.as_view()),
    path('<path:path>', FrontendCatchallView.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

