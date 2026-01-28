from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import hello, PatientViewSet

router = DefaultRouter()
router.register(r'patients', PatientViewSet, basename='patient')

urlpatterns = [
    path('hello/', hello),

    path('', include(router.urls)),
]
