from rest_framework import serializers
from ..models.notification import Notification


class NotificationSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="notif_type", read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "type", "message", "link", "is_read", "created_at"]
