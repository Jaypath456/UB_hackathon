import asyncio

import requests
from asgiref.sync import sync_to_async
from django.core.management.base import BaseCommand

from sensor_app.models import Buildings, Device

data_url = "http://127.0.0.1:8000/test_data.json"


data_list = []


async def process_data():
    while True:
        response = requests.get(data_url)
        response.raise_for_status()
        data_list = response.json()

        for data in data_list:
            serial_no = data.get("serial")
            temp = data.get("temperature")
            location = data.get("location")

            device = await sync_to_async(Device.objects.get)(serial_no=serial_no)

            building = Buildings(temp=temp, location=location, device=device)
            await sync_to_async(building.save)()

            print(f"Saved data: {temp}°C, {location}, device: {serial_no}")

            await asyncio.sleep(2)


async def main():
    await process_data()


class Command(BaseCommand):
    def handle(self, *args, **options):
        asyncio.run(main())
