import json
from channels.generic.websocket import AsyncWebsocketConsumer


class YjsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.document_id = self.scope["url_route"]["kwargs"]["document_id"]
        self.room_group_name = f"document_{self.document_id}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        # Simply broadcast the message to the group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "yjs_message", "message": text_data}
        )

    # Receive message from room group
    async def yjs_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=message)
