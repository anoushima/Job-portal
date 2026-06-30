from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models.notification import Notification


def notify(recipient, notif_type, message, link=""):
    """
    Create a Notification row AND push it instantly over WebSocket to
    the recipient if they're currently connected.

    Safe to call from anywhere: synchronous views, signals, etc.
    If no channel layer is configured (e.g. channels not installed yet),
    this still saves the row to the DB so the REST fallback works.
    """
    notification = Notification.objects.create(
        recipient=recipient,
        notif_type=notif_type,
        message=message,
        link=link,
    )

    payload = {
        "id": notification.id,
        "type": notification.notif_type,
        "message": notification.message,
        "link": notification.link,
        "is_read": notification.is_read,
        "created_at": notification.created_at.isoformat(),
    }

    try:
        channel_layer = get_channel_layer()
        if channel_layer is not None:
            async_to_sync(channel_layer.group_send)(
                f"user_{recipient.id}",
                {"type": "send_notification", "notification": payload},
            )
    except Exception:
        # Channel layer not running / channels not installed — DB row
        # still exists, the REST endpoint will pick it up on next poll.
        pass

    return notification


def notify_many(recipients, notif_type, message, link=""):
    for r in recipients:
        notify(r, notif_type, message, link)
