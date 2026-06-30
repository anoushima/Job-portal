import json
from urllib.parse import parse_qs

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()


@database_sync_to_async
def get_user_from_token(token_str):
    try:
        token = AccessToken(token_str)
        user_id = token["user_id"]
        return User.objects.get(id=user_id)
    except Exception:
        return None


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    """
    WebSocket endpoint: ws://<host>/ws/notifications/?token=<JWT access token>

    Each authenticated user joins a personal group "user_<id>" so the
    backend can push a notification to exactly that user the moment
    it's created (see projectapp/notifications.py -> notify()).
    """

    async def connect(self):
        query_string = self.scope["query_string"].decode()
        params = parse_qs(query_string)
        token = params.get("token", [None])[0]

        if not token:
            await self.close(code=4001)
            return

        user = await get_user_from_token(token)
        if user is None:
            await self.close(code=4001)
            return

        self.user = user
        self.group_name = f"user_{user.id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    # Called when something sends a message to this user's group
    # (see projectapp/notifications.py). The event dict has a "notification" key.
    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event["notification"]))
